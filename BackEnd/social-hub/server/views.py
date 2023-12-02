from django.http import JsonResponse
from django.views import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
import json

from django.shortcuts import get_object_or_404

from .models import User, Post

# TODO:
# error handling -> 404,... return JsonResponse(data, status=200, safe=False)
# image endpoint/view
# finish implementation of methods

class LoginView(View):
    def get(self, request):
        return JsonResponse("Login needs to be implemented.")

class UsersView(View):
    @method_decorator(login_required(login_url='login'))
    def get(self, request):
        users = User.objects.all()
        data = json.loads(serialize('json', users))
        return JsonResponse({"data": data})

    @method_decorator(csrf_exempt)
    def post(self, request):
        data = json.loads(request.body)
        user = User.objects.create(
            username=data["username"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"]
        )
        return JsonResponse({"id": user.id})

class UserDetailView(View):
    @method_decorator(login_required(login_url='login'))
    def get(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        data = json.loads(serialize('json', [user]))
        return JsonResponse({"data": data})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required(login_url='login'))
    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        data = json.loads(request.body)
        
        if "email" in data:
            user.email = data["email"]
        # Add other fields as needed
        
        user.save()
        return JsonResponse({"message": "User updated successfully"})
    
    @method_decorator(csrf_exempt)
    @method_decorator(login_required(login_url='login'))
    def put(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        data = json.loads(request.body)
        
        if "email" in data:
            user.email = data["email"]
        # Add other fields as needed
        
        user.save()
        return JsonResponse({"message": "User updated successfully"})

    @method_decorator(login_required(login_url='login'))
    def delete(self, request, user_id):
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return JsonResponse({"message": "User deleted successfully"})

class PostsView(View):
    @method_decorator(login_required(login_url='login'))
    def get(self, request):
        post_ids = request.GET.getlist('id')
        posts = Post.objects.filter(id__in=post_ids)
        data = json.loads(serialize('json', posts))
        return JsonResponse({"data": data})
    
    @method_decorator(csrf_exempt)
    @method_decorator(login_required(login_url='login'))
    def post(self, request):
        data = json.loads(request.body)
        user_id = data["user"]["id"]
        user = get_object_or_404(User, pk=user_id)
        post = Post.objects.create(user=user, text=data["text"], image=data.get("image"))
        return JsonResponse({"id": post.id})

class PostDetailView(View):
    @method_decorator(login_required(login_url='login'))
    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        data = json.loads(serialize('json', [post]))
        return JsonResponse({"data": data})

    @method_decorator(csrf_exempt)
    @method_decorator(login_required(login_url='login'))
    def patch(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        data = json.loads(request.body)
        
        if "user" in data:
            user_id = data["user"]["id"]
            user = get_object_or_404(User, pk=user_id)
            post.user = user
        # Add other fields as needed
        
        post.save()
        return JsonResponse({"message": "Post updated successfully"})
    
    @method_decorator(csrf_exempt)
    @method_decorator(login_required(login_url='login'))
    def put(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        data = json.loads(request.body)
        
        if "user" in data:
            user_id = data["user"]["id"]
            user = get_object_or_404(User, pk=user_id)
            post.user = user
        # Add other fields as needed
        
        post.save()
        return JsonResponse({"message": "Post updated successfully"})

    @method_decorator(login_required(login_url='login'))
    def delete(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        post.delete()
        return JsonResponse({"message": "Post deleted successfully"})