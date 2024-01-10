from django.http import JsonResponse
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
from server.serializers import UserSerializer, PostSerializer
from django.utils import timezone
from django.shortcuts import get_object_or_404, get_list_or_404
import json
import base64
from PIL import Image
from io import BytesIO
import uuid
import os
import pika
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token


from django.contrib.auth.models import User
from .models import Post

# TODO: image endpoint/view + activate login_required

# / - post
class LoginView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            token = Token.objects.create(user=user)
            print(token.key)
            return JsonResponse({"userId": user.id, 'token': str(token)})
        else:
            return JsonResponse({"error": "Invalid credentials"})

# /logout - post
class LogoutView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def post(self, request):
        logout(request)
        return JsonResponse({"success": "Logged out successfully"})

# /users - get + post
class UsersView(View):
    # @method_decorator(login_required())
    def get(self, request):
        # Get filter parameters from the request
        id = request.GET.get('id')
        username = request.GET.get('username')
        first_name = request.GET.get('first_name')
        last_name = request.GET.get('last_name')
        email = request.GET.get('email')

        # Create a dictionary to store filter parameters
        filter_params = {}
        if id:
            filter_params['id'] = id
        if username:
            filter_params['username'] = username
        if first_name:
            filter_params['first_name'] = first_name
        if last_name:
            filter_params['last_name'] = last_name
        if email:
            filter_params['email'] = email

        serialized_users = UserSerializer(User.objects.filter(**filter_params), many=True)
        return JsonResponse(serialized_users.data, safe=False)

    @method_decorator(csrf_exempt)
    def post(self, request):
        user = User.objects.create_user(
            username=request.POST.get('username'))
        user.set_password(request.POST.get('password'))
        user.save()
        return JsonResponse(UserSerializer(user).data, safe=False)

# /users/<id> - get + patch + put + delete
class UserDetailView(View):
    # @method_decorator(login_required())
    def get(self, request, id):
        user = User.objects.get(pk=id)
        return JsonResponse(UserSerializer(user).data, safe=False)

    @method_decorator(csrf_exempt)
    #@method_decorator(login_required())
    def patch(self, request, id):
        user = User.objects.get(pk=id)
        data = json.loads(request.body)

        # set new values
        if "username" in data:
            user.username = data["username"]
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        if "email" in data:
            user.email = data["email"]
        if "password" in data:
            user.set_password(data["password"])

        user.save()
        return JsonResponse(UserSerializer(user).data, safe=False)

    @method_decorator(csrf_exempt)
    #@method_decorator(login_required())
    def put(self, request, id):
        user = User.objects.get(pk=id)
        data = json.loads(request.body)

        # update all fields based on the incoming JSON data
        user.username = data.get("username", user.username)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.set_password(data.get("password"))

        user.save()
        return JsonResponse(UserSerializer(user).data, safe=False)

    #@method_decorator(login_required())
    def delete(self, request, id):
        user = User.objects.get(pk=id)
        user.delete()
        return JsonResponse({"success": "User deleted successfully"})

# /posts - get + post
class PostsView(View):
    
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Get filter parameters from the request
        id = request.GET.get('id')
        user_id = request.GET.get('user.id')
        text = request.GET.get('text')
        posted_from = request.GET.get('posted_from')
        posted_to = request.GET.get('posted_to')

        # Create a dictionary to store filter parameters and filter
        filter_params = {}
        if id:
            filter_params['id'] = id
        if user_id:
            filter_params['user__id'] = user_id
        if text:
            filter_params['text'] = text
        if posted_from:
            filter_params['posted_on__gte'] = posted_from
        if posted_to:
            filter_params['posted_on__lte'] = posted_to

        serialized_posts = PostSerializer(Post.objects.filter(**filter_params), many=True)
        return JsonResponse(serialized_posts.data, safe=False)
    
    @method_decorator(csrf_exempt)
    #@method_decorator(login_required())
    def post(self, request):
        user = request.POST.get('user')
        text = request.POST.get('text')
        user_id = request.POST.get('user.id')
        posted_on = timezone.now()

        # Create post with or without image
        if 'image' in request.POST:
            img_base64 = request.POST['image']
            img_data = base64.b64decode(img_base64)
            img = Image.open(BytesIO(img_data))
            image_id = uuid.uuid4()

            # Create the folder if it doesn't exist
            folder_path = 'images'
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            image_link = f'{image_id}.{img.format}'
            img.save(f'images/{image_link}')

            post = Post.objects.create(
                user_id=user_id,
                text=text,
                posted_on=posted_on,
                image=image_link
            )
        else:
            post = Post.objects.create(
                user_id=user_id,
                text=text,
                posted_on=posted_on
            )

        post.save()

        # RabbitMQ connection and message publishing
        connection_params = pika.ConnectionParameters('localhost')
        connection = pika.BlockingConnection(connection_params)
        channel = connection.channel()

        # Message for resize queue only if image is present
        if 'image' in request.POST:
            queue_name = 'resize_queue'
            channel.queue_declare(queue=queue_name)
            message_object = {'image': img_base64, 'id': str(post.id)}
            message = json.dumps(message_object)
            channel.basic_publish(exchange='', routing_key=queue_name, body=message)

        # Message for AI queue
        queue_name = 'ai_queue'
        channel.queue_declare(queue=queue_name)
        message_object = {'message': text, 'id': str(post.id)}
        message = json.dumps(message_object)
        channel.basic_publish(exchange='', routing_key=queue_name, body=message)

        connection.close()
        return JsonResponse(PostSerializer(post).data, safe=False)
    

# /posts/<id> - get + patch + put + delete
class PostDetailView(View):
    #@method_decorator(login_required())
    def get(self, request, id):
        post = Post.objects.get(pk=id)
        return JsonResponse(PostSerializer(post).data, safe=False)

    @method_decorator(csrf_exempt)
    #@method_decorator(login_required())
    def patch(self, request, id):
        post = Post.objects.get(pk=id)
        data = json.loads(request.body)

        # does not make sense to update user or post id! -> image is handled in the image endpoint
        if "text" in data:
            post.text = data["text"]

        post.updated_on = timezone.now()
        post.save()
        return JsonResponse(PostSerializer(post).data, safe=False)

    @method_decorator(csrf_exempt)
    #@method_decorator(login_required())
    def put(self, request, id):
        post = Post.objects.get(pk=id)
        data = json.loads(request.body)

        # update all fields based on the incoming JSON data
        # does not make sense to update user or post id! -> image is handled in the image endpoint
        post.text = data.get("text", post.text)
        post.updated_on = timezone.now()

        post.save()
        return JsonResponse(PostSerializer(post).data, safe=False)

    #@method_decorator(login_required())
    def delete(self, request, id):
        post = Post.objects.get(pk=id)
        post.delete()
        return JsonResponse({"success": "Post deleted successfully"})
