import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('smartshop_token');
  if (token?.value) {
    redirect('/dashboard');
  }
  redirect('/login');
}
