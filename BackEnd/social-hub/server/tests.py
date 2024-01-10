from django.test import TestCase, Client
from rest_framework import status
from django.utils import timezone
import json
from unittest import skip


class TestUser(TestCase):

    def setUp(self):
        self.client = Client()

        # Create test user
        self.test_user = self.client.post("/users/",
                                          {"username": "abracadaniel",
                                           "password": "1234",
                                           "email": "testuser@social_hub.at",
                                           "first_name": "test",
                                           "last_name": "user"})
        user_response = json.loads(self.test_user.content)
        self.user_id = user_response["id"]
        self.username = user_response["username"]
        self.first_name = user_response["first_name"]
        self.last_name = user_response["last_name"]
        self.email = user_response["email"]

    def test_users_post(self):
        self.assertEqual(self.test_user.status_code, status.HTTP_200_OK)
        self.assertEqual(self.username, "abracadaniel")
        self.assertEqual(self.first_name, "test")
        self.assertEqual(self.last_name, "user")
        self.assertEqual(self.email, "testuser@social_hub.at")

    def test_users_get(self):
        # Get users
        response = self.client.get("/users/")
        response_json = json.loads(response.content)
        username = response_json[0]["username"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(username, "abracadaniel")

    def test_login_success(self):
        # Login User
        response = self.client.post(
            "/login/", {"username": self.username, "password": "1234"})
        response_json = json.loads(response.content)
        userId = response_json["userId"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(userId, self.user_id)

    def test_login_error(self):
        # Login User
        response = self.client.post(
            "/login/", {"username": self.username, "password": "foo"})
        response_json = json.loads(response.content)
        error = response_json["error"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(error, "Invalid credentials")

    @skip
    def test_logout(self):
        # Logout user
        response = self.client.post(
            "/logout/")
        response_json = json.loads(response.content)
        success = response_json["success"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(success, {"success": "Logged out successfully"})

    def test_user_detail_get(self):
        # Get user detail
        response = self.client.get(f"/users/{self.user_id}/")
        response_json = json.loads(response.content)
        username = response_json["username"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(username, "abracadaniel")

    def test_user_patch(self):
        # Patch user
        response = self.client.patch(
            f"/users/{self.user_id}/",
            {"first_name": "john"}, content_type="application/json")
        response_json = json.loads(response.content)
        first_name = response_json["first_name"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(first_name, "john")

    def test_user_put(self):
        # Patch user
        data = {"username": "johndoe",
                "password": "4321",
                "email": "johndoe@social_hub.at",
                "first_name": "john",
                "last_name": "doe"}
        response = self.client.patch(
            f"/users/{self.user_id}/",
            data, content_type="application/json")
        response_json = json.loads(response.content)
        first_name = response_json["first_name"]
        email = response_json["email"]
        last_name = response_json["last_name"]
        username = response_json["username"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(username, "johndoe")
        self.assertEqual(email, "johndoe@social_hub.at")
        self.assertEqual(last_name, "doe")
        self.assertEqual(first_name, "john")

    def test_user_delete(self):
        # Delete User
        response = self.client.delete(f"/users/{self.user_id}/",
                                      content_type="application/json")
        response_json = json.loads(response.content)
        success = response_json["success"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(success, "User deleted successfully")


class TestPost(TestCase):
    def setUp(self):
        self.client = Client()
        self.test_time = timezone.now()

        # Create test user
        self.test_user = self.client.post("/users/",
                                          {"username": "abracadaniel",
                                           "password": "1234",
                                           "email": "testuser@social_hub.at",
                                           "first_name": "test",
                                           "last_name": "user"})
        user_response = json.loads(self.test_user.content)
        self.user_id = user_response["id"]
        self.username = user_response["username"]
        self.first_name = user_response["first_name"]
        self.last_name = user_response["last_name"]
        self.email = user_response["email"]
        # Create test post
        self.test_post = self.client.post("/posts/",
                                          {"user.id": f"{self.user_id}",
                                           "text": "feefifofum"})
        post_response = json.loads(self.test_post.content)
        self.text = post_response["text"]
        self.get_response = self.client.get(f"/posts/?user={self.user_id}")
        get_json = json.loads(self.get_response.content)
        self.post_id = get_json[0]["id"]
        self.get_user_id = get_json[0]["user"]

    #def test_post_post(self):
    #    self.assertEqual(self.test_post.status_code, status.HTTP_200_OK)
    #    self.assertEqual(self.text, "feefifofum")

    def test_post_get(self):
        # Get posts
        self.assertEqual(self.get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.get_user_id, {'id': 1,
                                            'username': 'abracadaniel'})

    def test_post_detail_get(self):
        response = self.client.get(f"/posts/{self.post_id}/",
                                   content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_json = json.loads(response.content)
        self.assertEqual(response_json["id"], self.post_id)

    def test_post_detail_patch(self):
        # Patch post
        response = self.client.patch(f"/posts/{self.post_id}/",
                                     {"text": "beanstalk"},
                                     content_type="application/json")
        response_json = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_json["text"], "beanstalk")

    def test_put_detail_patch(self):
        # Patch post
        response = self.client.put(f"/posts/{self.post_id}/",
                                   {"text": "giant"},
                                   content_type="application/json")
        response_json = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_json["text"], "giant")

    def test_delete_post(self):
        # Delete post
        response = self.client.delete(f"/posts/{self.post_id}/")
        response_json = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_json["success"], "Post deleted successfully")
