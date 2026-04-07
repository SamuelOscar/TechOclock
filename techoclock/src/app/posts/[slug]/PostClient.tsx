'use client';
import Image from 'next/image';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  cover_image_url: string;
  youtube_url: string;
  source_link: string;
  author: string;
  published_at: string;
};

export default function PostClient({ post }: { post: Post }) {
  const getYouTubeId = (url: string) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = post.youtube_url ? getYouTubeId(post.youtube_url) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techoclock.vercel.app';
  const shareUrl = `${siteUrl}/posts/${post.slug}`;

  return (
    <main style={{ backgroundColor: '#080e5e', minHeight: '100vh', color: '#fff' }}>

      {/* Navbar */}
      <nav style={{
        backgroundColor: '#c1f135',
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <Link href="/" style={{ height: '42px', width: '130px', position: 'relative', display: 'block' }}>
          <Image src="/logo.png" alt="Tech O'clock" fill sizes="130px"
            style={{ objectFit: 'contain', objectPosition: 'left center' }} priority />
        </Link>
        <Link href="/" style={{
          fontSize: '13px', color: '#080e5e', fontWeight: '700',
          textDecoration: 'none',
        }}>← Back to Home</Link>
      </nav>

      {/* Article */}
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em',
            textTransform: 'uppercase', backgroundColor: 'rgba(193,241,53,0.15)',
            color: '#c1f135', padding: '4px 12px', borderRadius: '4px',
          }}>{post.category}</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>By {post.author}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '32px', fontWeight: '700', lineHeight: '1.25', color: '#fff', marginBottom: '1.5rem' }}>
          {post.title}
        </h1>

        {/* Cover Image */}
        {post.cover_image_url && (
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
            <img src={post.cover_image_url} alt={post.title}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }} />
          </div>
        )}

        {/* YouTube Embed */}
        {youtubeId && (
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', aspectRatio: '16/9' }}>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen style={{ border: 'none', width: '100%', height: '100%' }}
            />
          </div>
        )}

        {/* Summary */}
        <div style={{
          fontSize: '16px', lineHeight: '1.8',
          color: 'rgba(255,255,255,0.75)',
          marginBottom: '2rem', whiteSpace: 'pre-wrap',
        }}>
          {post.summary}
        </div>

        {/* Source Link */}
        {post.source_link && (
          <a href={post.source_link} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: '#29c4f6', textDecoration: 'none',
            border: '1px solid rgba(41,196,246,0.3)', padding: '8px 16px',
            borderRadius: '6px', marginBottom: '2.5rem',
          }}>🔗 Read original source</a>
        )}

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '2rem' }} />

        {/* Share */}
        <div>
          <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
            Share this post
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied!');
              }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)', padding: '8px 16px',
                borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}>🔗 Copy Link</button>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer" style={{
                backgroundColor: '#0077b5', color: '#fff', textDecoration: 'none',
                padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
              }}>LinkedIn</a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank" rel="noopener noreferrer" style={{
                backgroundColor: '#000', color: '#fff', textDecoration: 'none',
                padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
              }}>X / Twitter</a>
            <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
              target="_blank" rel="noopener noreferrer" style={{
                backgroundColor: '#25d366', color: '#fff', textDecoration: 'none',
                padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600',
              }}>WhatsApp</a>
          </div>
        </div>

      </article>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#060b52', borderTop: '1px solid rgba(41,196,246,0.12)',
        padding: '1.5rem 2rem', textAlign: 'center', marginTop: '4rem',
      }}>
        <span style={{ fontSize: '11px', color: '#29c4f6' }}>
          © 2026 Tech O'clock. All rights reserved. · Tech · Media · Business
        </span>
      </footer>

    </main>
  );
}