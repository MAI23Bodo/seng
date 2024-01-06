import React, { useState, ReactNode, useEffect } from 'react';
import PostsContext, { PostsContextType } from './posts-context';
import { Post } from '@/models/post';
import { useRequests } from '@/requests/requests';

interface PostsProviderProps {
  children: ReactNode;
}

const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {

  // let img1 = "https://plus.unsplash.com/premium_photo-1668376545856-ad0314a8479e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBhcnR5fGVufDB8fDB8fHww";
  // let img2 = "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  // let img3 = "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
// 
  // let currentUser: User = {
  //   userIconUrl: '',
  //   username: 'Clemens',
  //   id: 1,
  //   first_name: 'Clemens',
  //   last_name: 'Wondrak',
  //   email: 'ai23m032@fh-technikum.at'
  // }
// 
// 
  // let otherUser = {
  //   userIconUrl: '',
  //   username: 'Max',
  //   id: 2,
  //   first_name: 'Max',
  //   last_name: 'Mustermann',
  //   email: 'max@mustermail.at'
  // };

  let initial_posts: Post[] = [
    // { id: 0, image: img1, text: 'My New Post', timestamp: new Date().toDateString(), user: currentUser },
    // { id: 1, image: img2, text: 'My Second Post', timestamp: new Date().toDateString(), user: otherUser },
    // { id: 2, image: img3, text: 'My New Post', timestamp: new Date().toDateString(), user: otherUser },
    // { id: 3, image: null, text: 'Only Text Post', timestamp: new Date().toDateString(), user: currentUser },
  ];

  const [posts, setPosts] = useState<PostsContextType['posts']>(initial_posts);
  const [loaded, setLoaded] = useState(false);
  const {getPosts, createPost, deletePost, updatePost} = useRequests();

  const removePost = (id: number) => {
    deletePost(id).then(() => {
      getPosts().then(res => {
        setPosts(res)
      })
    })
  };

  const submitPost = (post: Post) => {
    createPost(post).then(res => {
      setPosts(posts => posts.concat(res));
    })
  };
 
  const changePost = (id: string, text: string) => {
    updatePost(id, text).then(res => {
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
    <PostsContext.Provider value={{ posts, removePost, submitPost , changePost}}>
      {children}
    </PostsContext.Provider>
  );

};

export default PostsProvider