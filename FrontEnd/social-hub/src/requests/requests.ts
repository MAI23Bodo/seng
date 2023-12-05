import { Post } from "@/models/post";
import axios from "axios";

export const useRequests = () => {
  const host = 'http://localhost:8000';
  const instance = axios.create({
    baseURL: host,
    timeout: 1000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': '*',
    },
  });

  const getPosts = async () => {
    let response = await instance.get('/posts')
    if (response.status !== 200)  {
      return [];
    }
    console.debug(response.data.posts)
    return JSON.parse(response.data.posts);
  }

  return [getPosts]
}
