"use client";

import Dashboard from '@/components/dashboard';
import Header from '@/components/header'
import PostsProvider from '@/context/posts-provider';
import UserProvider from '@/context/user-provider';

export default function Home() {
 
  return (
    <div>
      <UserProvider>
        <PostsProvider>
          <Header></Header>
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Dashboard mode={'all_posts'}></Dashboard>      
          </main>
        </PostsProvider>
      </UserProvider>
    </div>
  )
}
