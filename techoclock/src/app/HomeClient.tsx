'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const categories = ['All', 'AI Tools', 'Funding', 'Africa Tech', 'Startups', 'Cloud', 'Research', 'Enterprise', 'Newsletter'];
const pages = ['Home', 'AI Tools', 'Startups', 'Funding', 'Newsletter', 'About'];

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
  status: string;
};

const socials = [
  { href: 'https://www.linkedin.com/company/tech-o-clock/', label: 'LinkedIn', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="#080e5e"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg> },
  { href: 'https://x.com/TechOclockOff', label: 'X', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="#080e5e"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { href: 'https://www.instagram.com/techoclockofficial/', label: 'Instagram', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#080e5e" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#080e5e" stroke="none"/></svg> },
  { href: 'https://www.tiktok.com/@techoclockofficial', label: 'TikTok', svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="#080e5e"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg> },
  { href: 'https://www.facebook.com/techoclockofficial', label: 'Facebook', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="#080e5e"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { href: 'https://www.threads.com/@techoclockofficial', label: 'Threads', svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="#080e5e"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.516.85-6.37 2.495-8.423C5.845 1.341 8.598.16 12.18.136h.014c3.58.024 6.334 1.205 8.184 3.509C22.022 5.697 22.5 8.55 22.5 12.068c0 3.516-.85 6.37-2.495 8.423C18.358 22.659 15.605 23.84 12.186 24z"/></svg> },
  { href: 'https://bsky.app/profile/techoclockofficial.bsky.social', label: 'Bluesky', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="#080e5e"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg> },
  { href: 'https://truthsocial.com/@TechOclock', label: 'Truth', svg: <svg width="15" height="15" viewBox="0 0 24 24" fill="#080e5e"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 7h-3v8h-3V9h-3V6h9v3z"/></svg> },
];

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage("You're in! Welcome to Tech O'clock.");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  };

  if (status === 'success') return (
    <div style={{ backgroundColor: 'rgba(8,14,94,0.15)', borderRadius: '8px', padding: '14px 24px', fontSize: '14px', color: '#080e5e', fontWeight: '700', display: 'inline-block' }}>
      ✓ {message}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', maxWidth: '420px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input type="email" placeholder="your@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          style={{ flex: 1, minWidth: '200px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', color: '#080e5e', outline: 'none' }} />
        <button onClick={handleSubmit} disabled={status === 'loading'}
          style={{ backgroundColor: '#080e5e', color: '#c1f135', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? 'Subscribing...' : 'Subscribe free'}
        </button>
      </div>
      {status === 'error' && <p style={{ fontSize: '12px', color: '#080e5e', marginTop: '8px', fontWeight: '600' }}>{message}</p>}
    </div>
  );
}

export default function HomeClient({ posts }: { posts: Post[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePage, setActivePage] = useState('Home');

  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1, 5);
  const gridPosts = posts.slice(5);

  const filteredGrid = activeCategory === 'All'
    ? gridPosts
    : gridPosts.filter(p => p.category === activeCategory);

  return (
    <main style={{ backgroundColor: '#080e5e', minHeight: '100vh', color: '#fff' }}>

      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#c1f135', borderBottom: '1px solid rgba(0,0,0,0.1)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ height: '42px', width: '130px', position: 'relative', flexShrink: 0 }}>
          <Image src="/logo.png" alt="Tech O'clock" fill sizes="130px" style={{ objectFit: 'contain', objectPosition: 'left center' }} priority />
        </div>
        <div style={{ display: 'flex', gap: '2rem' }} className="nav-links">
          {pages.map(p => (
            <a key={p} href="#" onClick={(e) => { e.preventDefault(); setActivePage(p); setMenuOpen(false); }}
              style={{ fontSize: '13px', color: activePage === p ? '#fff' : '#080e5e', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '700', borderBottom: activePage === p ? '2px solid #080e5e' : '2px solid transparent', paddingBottom: '2px' }}>{p}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => { setActivePage('Home'); setTimeout(() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            style={{ backgroundColor: '#080e5e', color: '#c1f135', border: 'none', padding: '9px 22px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>Subscribe</button>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <span style={{ width: '22px', height: '2px', backgroundColor: '#080e5e', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ width: '22px', height: '2px', backgroundColor: '#080e5e', display: 'block', opacity: menuOpen ? 0 : 1 }}></span>
            <span style={{ width: '22px', height: '2px', backgroundColor: '#080e5e', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ backgroundColor: '#c1f135', padding: '0.5rem 2rem 1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
          {pages.map(p => (
            <a key={p} href="#" onClick={(e) => { e.preventDefault(); setActivePage(p); setMenuOpen(false); }}
              style={{ fontSize: '14px', color: activePage === p ? '#fff' : '#080e5e', textDecoration: 'none', fontWeight: '700', textTransform: 'uppercase', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>{p}</a>
          ))}
        </div>
      )}

      {/* INNER PAGES */}
      {activePage !== 'Home' && (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ height: '60px', width: '180px', position: 'relative' }}>
              <Image src="/logo.png" alt="Tech O'clock" fill sizes="180px" style={{ objectFit: 'contain' }} />
            </div>
          </div>
          <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: 'rgba(193,241,53,0.15)', color: '#c1f135', padding: '4px 12px', borderRadius: '4px', marginBottom: '1.5rem' }}>{activePage}</div>
          <h1 style={{ fontSize: '36px', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>
            {activePage === 'About' ? "About Tech O'clock" : activePage === 'Newsletter' ? "Tech O'clock Weekly" : `${activePage} News`}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.7' }}>
            {activePage === 'About'
              ? "Tech O'clock is a Tech Media Platform educating businesses on AI and emerging technologies. Based in Kigali, Rwanda."
              : activePage === 'Newsletter'
              ? "Your weekly digest of the most important AI and tech news."
              : `The latest ${activePage} stories, curated for professionals and businesses. Coming soon.`}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {activePage === 'Newsletter' && (
              <a href="/newsletter" style={{ backgroundColor: '#c1f135', color: '#080e5e', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>View All Editions →</a>
            )}
            <button onClick={() => setActivePage('Home')} style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '10px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>← Back to Home</button>
          </div>
        </div>
      )}

      {/* HOMEPAGE */}
      {activePage === 'Home' && <>

        {/* Category Bar */}
        <div style={{ backgroundColor: '#080e5e', borderBottom: '1px solid rgba(41,196,246,0.1)', padding: '0 2rem', display: 'flex', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <div key={cat} onClick={() => setActiveCategory(cat)} style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: activeCategory === cat ? '#c1f135' : 'rgba(255,255,255,0.4)', padding: '12px 16px', cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: activeCategory === cat ? '2px solid #c1f135' : '2px solid transparent' }}>{cat}</div>
          ))}
        </div>

        {/* Hero — Featured Post */}
        {featuredPost ? (
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', borderBottom: '1px solid rgba(41,196,246,0.1)' }}>
            <Link href={`/posts/${featuredPost.slug}`} style={{ textDecoration: 'none', borderRight: '1px solid rgba(41,196,246,0.1)', display: 'flex', flexDirection: 'column' }}>
              {/* Image or YouTube thumbnail */}
              <div style={{ width: '100%', height: '320px', overflow: 'hidden', backgroundColor: 'rgba(41,196,246,0.08)' }}>
                {featuredPost.cover_image_url ? (
                  <img src={featuredPost.cover_image_url} alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }} />
                ) : featuredPost.youtube_url ? (
                  <img src={`https://img.youtube.com/vi/${featuredPost.youtube_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]}/maxresdefault.jpg`}
                    alt={featuredPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(41,196,246,0.4)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span style={{ fontSize: '12px', color: 'rgba(41,196,246,0.4)' }}>Featured image</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '1.5rem 2rem' }}>
                <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: 'rgba(193,241,53,0.15)', color: '#c1f135', padding: '4px 12px', borderRadius: '4px', marginBottom: '0.75rem' }}>Featured</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>
                  {new Date(featuredPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h1 className="hero-title" style={{ fontSize: '26px', fontWeight: '700', lineHeight: '1.25', color: '#fff', marginBottom: '0.75rem' }}>{featuredPost.title}</h1>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.7' }}>{featuredPost.summary?.slice(0, 180)}...</p>
              </div>
            </Link>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sidebarPosts.length > 0 ? sidebarPosts.map((item) => (
                <Link key={item.id} href={`/posts/${item.slug}`} style={{ textDecoration: 'none', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(41,196,246,0.07)' }}>
                  <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#29c4f6', marginBottom: '6px' }}>{item.category}</div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </Link>
              )) : (
                <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>More posts coming soon...</div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
            <p style={{ fontSize: '16px' }}>No posts yet. <Link href="/admin" style={{ color: '#c1f135' }}>Go to Admin</Link> to publish your first post!</p>
          </div>
        )}

        {/* Latest Stories */}
        {filteredGrid.length > 0 && <>
          <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '1.5rem 2rem 0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#c1f135', display: 'inline-block' }}></span>
            Latest Stories
            <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
          </div>
          <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(41,196,246,0.08)' }}>
            {filteredGrid.map((item, i) => (
              <Link key={item.id} href={`/posts/${item.slug}`} style={{ textDecoration: 'none', padding: '1.25rem 1.5rem', borderRight: i % 3 !== 2 ? '1px solid rgba(41,196,246,0.06)' : 'none', borderBottom: '1px solid rgba(41,196,246,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#29c4f6' }}>{item.category}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                    {new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.8)', lineHeight: '1.45' }}>{item.title}</div>
              </Link>
            ))}
          </div>
        </>}

        {/* Newsletter */}
        <div id="newsletter" style={{ backgroundColor: '#c1f135', padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#080e5e', fontWeight: '700', marginBottom: '0.75rem' }}>Newsletter</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#080e5e', marginBottom: '0.5rem' }}>Stay ahead of the clock</h2>
          <p style={{ fontSize: '14px', color: 'rgba(8,14,94,0.7)', marginBottom: '1.5rem' }}>AI and tech stories for professionals and businesses, delivered weekly.</p>
          <NewsletterForm />
        </div>

      </>}

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#060b52', borderTop: '1px solid rgba(41,196,246,0.12)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          <div style={{ height: '42px', width: '130px', position: 'relative' }}>
            <Image src="/logo.png" alt="Tech O'clock" fill sizes="130px" style={{ objectFit: 'contain' }} />
          </div>
        </div>
        <p style={{ fontSize: '13px', color: '#29c4f6', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Educating businesses on AI and emerging technologies. Based in Kigali, Rwanda.
        </p>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.75rem' }}>Follow us</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#c1f135', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', flexShrink: 0 }}>{s.svg}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
          <span style={{ fontSize: '11px', color: '#29c4f6' }}>© 2026 Tech O'clock. All rights reserved. · Tech · Media · Business</span>
        </div>
      </footer>

    </main>
  );
}