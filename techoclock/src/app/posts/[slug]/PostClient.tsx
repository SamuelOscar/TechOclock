'use client';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Post = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
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

        {/* Content — renders markdown if available, falls back to summary */}
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({children}) => <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', margin: '2rem 0 1rem' }}>{children}</h1>,
              h2: ({children}) => <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '1.75rem 0 0.75rem', borderBottom: '1px solid rgba(41,196,246,0.2)', paddingBottom: '0.5rem' }}>{children}</h2>,
              h3: ({children}) => <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#29c4f6', margin: '1.5rem 0 0.5rem' }}>{children}</h3>,
              p: ({children}) => <p style={{ marginBottom: '1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.75)' }}>{children}</p>,
              strong: ({children}) => <strong style={{ color: '#fff', fontWeight: '700' }}>{children}</strong>,
              a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#29c4f6', textDecoration: 'underline' }}>{children}</a>,
              ul: ({children}) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>{children}</ul>,
              ol: ({children}) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>{children}</ol>,
              li: ({children}) => <li style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.75)' }}>{children}</li>,
              hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '2rem 0' }} />,
              blockquote: ({children}) => <blockquote style={{ borderLeft: '3px solid #29c4f6', paddingLeft: '1rem', margin: '1.5rem 0', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>{children}</blockquote>,
              code: ({children}) => <code style={{ backgroundColor: 'rgba(41,196,246,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '14px', color: '#29c4f6' }}>{children}</code>,
            }}
          >
            {post.content || post.summary}
          </ReactMarkdown>
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