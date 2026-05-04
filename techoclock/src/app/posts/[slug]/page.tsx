import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PostClient from './PostClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) return { title: "Post Not Found | Tech O'clock" };

  return {
    title: `${post.title} | Tech O'clock`,
    description: post.summary?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.summary?.slice(0, 160),
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      siteName: "Tech O'clock",
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary?.slice(0, 160),
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

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