from django.urls import path
from .views import UsersView, UserDetailView, PostsView, PostDetailView, LoginView

from django.contrib import admin

urlpatterns = [
    path('', LoginView.as_view(), name="login"),
    path('users/', UsersView.as_view(), name='users'),
    path('users/<int:user_id>/', UserDetailView.as_view(), name='user_detail'),
    path('posts/', PostsView.as_view(), name='posts'),
    path('posts/<int:post_id>/', PostDetailView.as_view(), name='post_detail'),
    #TODO: image endpoint

    #for development only:
    path("admin/", admin.site.urls),
]
