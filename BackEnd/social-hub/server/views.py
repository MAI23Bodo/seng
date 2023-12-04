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

from django.contrib.auth.models import User
from .models import Post

# TODO: image endpoint/view

# / - post
class LoginView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"success": "Logged in successfully"})
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
            username=request.POST.get('username'),
            email=request.POST.get('email'),
            first_name=request.POST.get('first_name'),
            last_name=request.POST.get('last_name')
        )
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
    @method_decorator(login_required())
    def patch(self, request, id):
        user = User.objects.get(pk=id)
        data = json.loads(request.body)

        # TODO: optionally update password
        # set new values
        if "username" in data:
            user.username = data["username"]
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        if "email" in data:
            user.email = data["email"]

        user.save()
        return JsonResponse({"message": "User updated successfully"})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def put(self, request, id):
        # TODO: check how to retrieve a User from django.contrib.auth.models import User
        user = get_object_or_404(User, pk=user_id)
        data = json.loads(request.body)

        # TODO: update password
        # update all fields based on the incoming JSON data
        user.username = data.get("username", user.username)
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)

        user.save()
        return JsonResponse({"message": "User updated successfully"})

    @method_decorator(login_required())
    def delete(self, request, id):
        # TODO: check how to retrieve and delete a User from django.contrib.auth.models import User
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return JsonResponse({"message": "User deleted successfully"})

# /posts - get + post


class PostsView(View):
    @method_decorator(login_required())
    def get(self, request):
        # Get filter parameters from the request
        post_id = request.GET.get('post_id')
        user_id = request.GET.get('user_id')
        text = request.GET.get('text')
        posted_from = request.GET.get('posted_from')
        posted_to = request.GET.get('posted_to')

        # Create a dictionary to store filter conditions and filter
        filter_conditions = {}
        if post_id:
            filter_conditions['post_id'] = post_id
        if user_id:
            filter_conditions['user_id'] = user_id
        if text:
            filter_conditions['text'] = text
        if posted_from:
            filter_conditions['posted_on__gte'] = posted_from
        if posted_to:
            filter_conditions['posted_on__lte'] = posted_to

        posts = get_list_or_404(Post, **filter_conditions)
        serialized_posts = serialize('json', posts)
        return JsonResponse({"posts": serialized_posts})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def post(self, request):
        post = Post.objects.create(
            user_id=request.POST.get('user_id'),
            text=request.POST.get('text'),
            posted_on=timezone.now()
        )
        post.save()
        return JsonResponse({"post_id": post.post_id})

# /posts/<id> - get + patch + put + delete
class PostDetailView(View):
    @method_decorator(login_required())
    def get(self, request, id):
        post = get_object_or_404(Post, pk=post_id)
        serialized_post = serialize('json', [post])
        return JsonResponse({"post": serialized_post})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def patch(self, request, id):
        post = get_object_or_404(Post, pk=post_id)
        data = json.loads(request.body)

        # does not make sense to update user or post id! -> image is handled in the image endpoint
        if "text" in data:
            post.text = data["text"]

        post.updated_on = timezone.now()
        post.save()
        return JsonResponse({"message": "Post updated successfully"})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def put(self, request, id):
        post = get_object_or_404(Post, pk=post_id)
        data = json.loads(request.body)

        # update all fields based on the incoming JSON data
        # does not make sense to update user or post id! -> image is handled in the image endpoint
        post.text = data.get("text", post.text)

        post.updated_on = timezone.now()
        post.save()
        return JsonResponse({"message": "Post updated successfully"})

    @method_decorator(login_required())
    def delete(self, request, id):
        post = get_object_or_404(Post, pk=post_id)
        post.delete()
        return JsonResponse({"message": "Post deleted successfully"})
