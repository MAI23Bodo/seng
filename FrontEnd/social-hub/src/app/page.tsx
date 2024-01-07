"use client";

import Dashboard from '@/components/dashboard';
import PostsProvider from '@/context/posts-provider';
import UserProvider from '@/context/user-provider';

export default function Home() {
 
  return (
    <div>
      <UserProvider>
        <PostsProvider>
          <Dashboard></Dashboard>
        </PostsProvider>
      </UserProvider>
    </div>
  )
}
