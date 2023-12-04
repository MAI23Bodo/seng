from django.db import models
from django.contrib.auth import get_user_model
import uuid #helps us generate unique IDs for the posts

User = get_user_model()

class Post(models.Model):
    post_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    image = models.URLField(null=True)
    posted_on = models.DateTimeField(null=True)
    updated_on = models.DateTimeField(null=True)