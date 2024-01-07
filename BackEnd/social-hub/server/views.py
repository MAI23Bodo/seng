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
            login(request, user)
            return JsonResponse({"userId": user.id})
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
    #@method_decorator(login_required())
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
        img_base64 = request.POST['image']

        print(img_base64)
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
            user_id=request.POST.get('user.id'),
            text=request.POST.get('text'),
            posted_on=timezone.now(),
            image=image_link
        )
        post.save()
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
