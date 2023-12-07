import { Post } from '@/models/post';
import React from 'react';

const PostsContext = React.createContext<PostsContextType | null>(null);

export default PostsContext;

export interface PostsContextType {
    posts: Post[];
    removePost: (id: number) => void;
    submitPost: (post: Post) => void;
}