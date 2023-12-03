from django.db import models

class User(models.Model):
    user_id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

class Post(models.Model):
    post_id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    image = models.URLField(null=True, blank=True)