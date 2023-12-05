from django.http import JsonResponse, HttpResponse
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
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
            return JsonResponse({"message": "Logged in successfully"})
        else:
            return JsonResponse({"error": "Invalid credentials"})

# /logout - post


class LogoutView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def post(self, request):
        logout(request)
        return JsonResponse({"message": "Logged out successfully"})


# /users - get + post
class UsersView(View):
    # @method_decorator(login_required())
    def get(self, request):

        # Get filter parameters from the request
        user_id = request.GET.get('user_id')
        username = request.GET.get('username')
        first_name = request.GET.get('first_name')
        last_name = request.GET.get('last_name')
        email = request.GET.get('email')

        # Create a dictionary to store filter conditions and filter
        filter_conditions = {}
        if user_id:
            filter_conditions['user_id'] = user_id
        if username:
            filter_conditions['username'] = username
        if first_name:
            filter_conditions['first_name'] = first_name
        if last_name:
            filter_conditions['last_name'] = last_name
        if email:
            filter_conditions['email'] = email

        # TODO: check how to retrieve a list of Users from django.contrib.auth.models import User
        # users = User.objects.get(**filter_conditions) ?
        # users = get_list_or_404(User, **filter_conditions)
        serialized_users = serialize(
            'json', User.objects.filter(**filter_conditions))
        return JsonResponse({"users": serialized_users})

    @method_decorator(csrf_exempt)
    def post(self, request):
        user = User.objects.create_user(
            username=request.POST.get('username'),
            email=request.POST.get('email'),
            password=request.POST.get('password'),
            first_name=request.POST.get('first_name'),
            last_name=request.POST.get('last_name')
        )
        user.save()
        return JsonResponse({"username": user.username})

# /users/<user_id> - get + patch + put + delete


class UserDetailView(View):
    # @method_decorator(login_required())
    def get(self, request, user_id):

        # TODO: check how to retrieve a User from django.contrib.auth.models import User
        user = get_object_or_404(User, pk=user_id)
        serialized_user = serialize('json', [user])
        return JsonResponse({"user": serialized_user})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def patch(self, request, user_id):
        # TODO: check how to retrieve a User from django.contrib.auth.models import User
        user = get_object_or_404(User, pk=user_id)
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
    def put(self, request, user_id):
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
    def delete(self, request, user_id):
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

# /posts/<post_id> - get + patch + put + delete


class PostDetailView(View):
    @method_decorator(login_required())
    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        serialized_post = serialize('json', [post])
        return JsonResponse({"post": serialized_post})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required())
    def patch(self, request, post_id):
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
    def put(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        data = json.loads(request.body)

        # update all fields based on the incoming JSON data
        # does not make sense to update user or post id! -> image is handled in the image endpoint
        post.text = data.get("text", post.text)

        post.updated_on = timezone.now()
        post.save()
        return JsonResponse({"message": "Post updated successfully"})

    @method_decorator(login_required())
    def delete(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        post.delete()
        return JsonResponse({"message": "Post deleted successfully"})
