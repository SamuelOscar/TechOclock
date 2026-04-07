import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PostClient from './PostClient';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) return notFound();

  return <PostClient post={post} />;
}