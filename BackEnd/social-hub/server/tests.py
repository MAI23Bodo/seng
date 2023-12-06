from django.test import TestCase, RequestFactory, Client
from server.models import Post
from server.views import UserDetailView, User, UsersView
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from server.urls import *
from django.contrib.auth.models import User


class UserTest(TestCase):
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


class UserDetailTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_post_get_patch(self):

        self.client = Client()
        response = self.client.post("/users/", {"username": "abracadaniel",
                                                "password": "1234",
                                                "email": "testuser@social_hub.at",
                                                "first_name": "test",
                                                "last_name": "user"})
        # Post new user
        print(f"POST-RESPONSE: {response.content}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, b'{"username": "abracadaniel"}')
        # Query user
        '''
        response = self.client.get("/users?username=abracadaniel")
        print(f"GET-RESPONSE: {response.content}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        '''
        # Update user
        response = self.client.patch(
            "/users?username=abracadaniel", {"first_name": "john", "last_name": "doe"})
        print(f"PATCH-RESPONSE: {response}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, b'{"username": "abracadaniel"}')
