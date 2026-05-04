import { supabase } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://tech-oclock.vercel.app';

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const postUrls = (posts || []).map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/newsletter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    ...postUrls,
  ];
}