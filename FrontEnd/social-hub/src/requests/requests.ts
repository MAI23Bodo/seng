import { Credentials } from "@/models/credentials";
import { Post } from "@/models/post";
import axios from "axios";

export const useRequests = () => {
  const host = 'http://localhost:8000';
  const instance = axios.create({
    baseURL: host,
    timeout: 1000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': '*/*',
    },
  });

  const postLogin = async (credentials: Credentials) => {
    console.debug(credentials)
    let response = await instance.postForm('/login/', credentials)
    if (response.status !== 200) {
      console.warn('login failded')
    }
    return response.data
  }

  const createUser = async (credentials: Credentials) => {
    let response = await instance.postForm('/users/', credentials)
    if (response.status !== 200) {
      console.warn('could not create user')
    }
    return response.data
  }

  const createPost = async (post: Post) => {
    let dto = {
      'text': post.text,
      'user.id': post.user.id,
      'image': post.image
    }
    let response = await instance.postForm('/posts/', dto)
    if (response.status !== 200) {
      console.warn('could not create post')
    }
    return response.data
  }

  const getPosts = async () => {
    let response = await instance.get('/posts/')
    if (response.status !== 200)  {
      return [];
    }
    return response.data
  }

  const deletePost = async (postId: number) => {
    let response = await instance.delete(`/posts/${postId}/`)
    if (response.status !== 200)  {
      console.warn("delete did not work")
    }
  }

  const updatePost = async (postId: string, text: string) => {
    let dto = {
      'text': text
    }
    let response = await instance.put(`/posts/${postId}/`, dto)
    if (response.status !== 200)  {
      console.warn("update post did not work")
    }
    return response.data
  }

  return {postLogin, getPosts, createUser, createPost, deletePost, updatePost}
}
