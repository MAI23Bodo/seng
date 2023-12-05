from django.test import TestCase, Client, RequestFactory
from rest_framework import status
from django.utils import timezone
import json
from django.contrib.auth.models import User


class testWorkflow(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_post_get(self):

        self.client = Client()
        response = self.client.post("/users/", {"username": "abracadaniel",
                                                "password": "1234",
                                                "email": "testuser@social_hub.at",
                                                "first_name": "test",
                                                "last_name": "user"})

        print(f"POST-RESPONSE: {response.content}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, b'{"username": "abracadaniel"}')
        response = self.client.get("/users/")
        print(f"GET-RESPONSE: {response.content}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

'''
class TestSocialHub(TestCase):

    client = Client()
    test_time = timezone.now()
    try:
        u = User.objects.get(username='abracadaniel')
        u.delete()
    except Exception:
        pass

    # Post user
    test_user = client.post("/users/", {"username": "abracadaniel",
                                        "password": "1234",
                                        "email": "testuser@social_hub.at",
                                        "first_name": "test",
                                        "last_name": "user"})
    user_response = json.loads(test_user.content)
    user_id = user_response['id']
    username = user_response['username']
    password = user_response['password']

    # Create test post
    test_post = client.get("/posts/", {"user_id": user_id,
                                       "text": "feefifofum",
                                       "posted_from": test_time,
                                       "posted_to": test_time})
    post_response = json.loads(test_post.content)
    post_id = post_response['post_id']

    def test_user_creation(self):

        self.assertEqual(self.test_user.status_code, status.HTTP_200_OK)
        self.assertEqual(self.test_user.content, "foo")

    def test_login(self):
        # Login User
        response = self.client.post(
            "/login/", {"username": self.username, "password": self.password})
        self.assertEqual(response.content, {
                         "message": "Logged in successfully"})

    def test_logout(self):
        # Logout user
        response = self.client.post(
            "/logout/", {"username": self.username})
        self.assertEqual(response.content, {
                         "message": "Logged out successfully"})

    def test_get_users(self):
        # Get users
        response = self.client.get("/users/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_detail(self):
        # Get user detail
        response = self.client.get(f"/users/?id={self.username}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_user(self):
        # Patch user
        response = self.client.patch(
            "/users?username=abracadaniel", {"first_name": "john", "last_name": "doe"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_user(self):
        # Put user
        response = self.client.put(f"/users/?id={self.user_id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_post(self):
        self.assertEqual(self.test_post.status_code, status.HTTP_200_OK)

    def test_post_get(self):
        # Get posts
        response = self.client.get("/posts/", {"user_id": self.user_id,
                                               "text": "feefifofum",
                                               "posted_from": self.test_time,
                                               "posted_to": self.test_time})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_post(self):
        # Patch post
        response = self.client.patch(f"/posts/?post_id={self.post_id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_post(self):
        # Put post
        response = self.client.put(f"/posts/?post_id={self.post_id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_post(self):
        # Delete post
        response = self.client.delete(f"/posts/?post_id={self.post_id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user(self):
        # Delete User
        response = self.client.delete(f"/users/?id={self.user_id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
'''