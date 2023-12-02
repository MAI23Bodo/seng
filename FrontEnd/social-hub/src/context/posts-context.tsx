import { Post } from '@/models/post';
import React from 'react';

const PostsContext = React.createContext<PostsContextType>({posts: []});

export default PostsContext;

export interface PostsContextType {
    posts: Post[];
    deletePost: (id: number) => void;
    createPost: (post: Post) => void;
}