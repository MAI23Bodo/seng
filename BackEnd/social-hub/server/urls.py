from django.urls import path
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from .views import UsersView, UserDetailView, PostsView, PostDetailView, LoginView, LogoutView

from django.contrib import admin

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('users/', UsersView.as_view(), name='users'),
    path('users/<int:id>/', UserDetailView.as_view(), name='user_detail'),
    path('posts/', PostsView.as_view(), name='posts'),
    path('posts/<id>/', PostDetailView.as_view(), name='post_detail'),
    #for development only:
    path("admin/", admin.site.urls),
]
