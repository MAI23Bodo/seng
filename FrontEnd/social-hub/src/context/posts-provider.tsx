import React, { useState, ReactNode, useEffect, useContext } from 'react';
import PostsContext, { PostsContextType } from './posts-context';
import { Post } from '@/models/post';
import { useRequests } from '@/requests/requests';
import UserContext from './user-context';

interface PostsProviderProps {
  children: ReactNode;
}

const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {

  let initial_posts: Post[] = [
  ];

  const [posts, setPosts] = useState<PostsContextType['posts']>(initial_posts);
  const [loaded, setLoaded] = useState(false);
  const {getPosts, createPost, deletePost, updatePost} = useRequests();

  const userContext = useContext(UserContext);

  if (!userContext) return <p>No user context available</p>;

  const { token } = userContext;

  const removePost = (id: number) => {
    if (token == null) {
      console.debug('not authenicated')
      return
    }
    deletePost(id, token).then(() => {
      getPosts().then(res => {
        setPosts(res)
      })
    })
  };

  const submitPost = (post: Post) => {
    if (token == null) {
      console.debug('not authenicated')
      return
    }
    createPost(post, token).then(res => {
      setPosts(posts => posts.concat(res));
    })
  };
 
  const changePost = (id: string, text: string) => {
    if (token == null) {
      console.debug('not authenicated')
      return
    }
    updatePost(id, text, token).then(res => {
      setPosts(posts => posts.map(post => {
        if (post.id === res.id) {
          return {
            ...post,
            ...res
          };
        }
        return post;
      }));
    })
  }

  const collectPosts = () => {
    getPosts().then(res => {
      initial_posts = res;
      setPosts(res);
    })
  }

  useEffect(() => {
    if(!loaded) {
      setLoaded(true)
      getPosts().then(res => {
        initial_posts = res;
        setPosts(initial_posts)
    
      });
    }
    
  })

  return (
    <PostsContext.Provider value={{ posts, removePost, submitPost , changePost, collectPosts}}>
      {children}
    </PostsContext.Provider>
  );

};

export default PostsProvider