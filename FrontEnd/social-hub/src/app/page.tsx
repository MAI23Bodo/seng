import Dashboard from '@/components/dashboard'
import Header from '@/components/header'
import { Post } from '@/models/post'
import { User } from '@/models/user'
import { UserContext } from '@/models/user-context';

export default function Home() {
  let img1 = "https://plus.unsplash.com/premium_photo-1668376545856-ad0314a8479e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBhcnR5fGVufDB8fDB8fHww";
  let img2 = "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  let img3 = "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  
  let userContext: UserContext = {
    userId: 0
  }
  let currentUser: User = {
    userIconUrl: '',
    username: 'Clemens',
    id: 0,
    first_name: 'Clemens',
    last_name: 'Wondrak',
    email: 'ai23m032@fh-technikum.at'
  }
  let otherUser = {
    userIconUrl: '',
    username: 'Max',
    id: 1,
    first_name: 'Max',
    last_name: 'Mustermann',
    email: 'max@mustermail.at'
  };
  let posts: Post[] = [
    {id: 0, image: img1, text: 'My New Post', timestamp: new Date().toDateString(), user: currentUser},
    {id: 1, image: img2, text: 'My Second Post', timestamp: new Date().toDateString(), user: otherUser},
    {id: 2, image: img3, text: 'My New Post', timestamp: new Date().toDateString(), user: otherUser},
    {id: 3, image: null, text: 'Only Text Post', timestamp: new Date().toDateString(), user: currentUser},
  ];

  return (
    <div>
      <Header {...currentUser}></Header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Dashboard posts={posts} userContext={userContext}></Dashboard>
    </main>
    </div>
  )
}
