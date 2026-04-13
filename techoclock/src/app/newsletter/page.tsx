import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default async function NewsletterPage() {
  const { data: newsletters } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', 'Newsletter')
    .order('published_at', { ascending: false });

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
        <Link href="/" style={{ fontSize: '13px', color: '#080e5e', fontWeight: '700', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: 'rgba(193,241,53,0.15)', color: '#c1f135', padding: '4px 12px', borderRadius: '4px', marginBottom: '1rem' }}>
            Newsletter
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#fff', marginBottom: '0.75rem' }}>
            Tech O'clock Weekly
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: '1.7' }}>
            Your weekly digest of the most important AI and tech stories for professionals and businesses.
          </p>

          {/* Subscribe CTA */}
          <Link href="/#newsletter" style={{
            display: 'inline-block', backgroundColor: '#c1f135', color: '#080e5e',
            padding: '10px 24px', borderRadius: '6px', fontSize: '13px',
            fontWeight: '700', textDecoration: 'none',
          }}>
            Subscribe Free →
          </Link>
        </div>

        {/* Newsletter List */}
        {!newsletters || newsletters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
            <p style={{ fontSize: '16px', marginBottom: '1rem' }}>No newsletters published yet.</p>
            <p style={{ fontSize: '13px' }}>First edition coming soon! Subscribe to get notified.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {newsletters.map((edition, i) => (
              <Link key={edition.id} href={`/posts/${edition.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#0d1580', borderRadius: '12px', padding: '1.5rem',
                  border: i === 0 ? '1px solid rgba(193,241,53,0.3)' : '1px solid rgba(41,196,246,0.1)',
                  display: 'flex', alignItems: 'center', gap: '1.5rem',
                  transition: 'border-color 0.2s',
                }}>
                  {/* Edition number */}
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '10px',
                    backgroundColor: i === 0 ? 'rgba(193,241,53,0.15)' : 'rgba(41,196,246,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, flexDirection: 'column',
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: i === 0 ? '#c1f135' : '#29c4f6' }}>
                      #{newsletters.length - i}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      {i === 0 && (
                        <span style={{ fontSize: '10px', fontWeight: '600', backgroundColor: 'rgba(193,241,53,0.15)', color: '#c1f135', padding: '2px 8px', borderRadius: '20px' }}>
                          Latest
                        </span>
                      )}
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(edition.published_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '6px', lineHeight: '1.3' }}>
                      {edition.title}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                      {edition.summary?.slice(0, 120)}...
                    </p>
                  </div>

                  {/* Arrow */}
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px', flexShrink: 0 }}>→</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#060b52', borderTop: '1px solid rgba(41,196,246,0.12)', padding: '1.5rem 2rem', textAlign: 'center', marginTop: '4rem' }}>
        <span style={{ fontSize: '11px', color: '#29c4f6' }}>
          © 2026 Tech O'clock. All rights reserved. · Tech · Media · Business
        </span>
      </footer>

    </main>
  );
}