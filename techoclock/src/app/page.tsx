import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import HomeClient from './HomeClient';

export const revalidate = 60;

export default async function Home() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10);

  return <HomeClient posts={posts || []} />;
}
