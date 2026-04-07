'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const categories = ['AI Tools', 'Funding', 'Africa Tech', 'Startups', 'Cloud', 'Research', 'Enterprise'];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

type Volunteer = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
};

export default function ContributePage() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Post form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI Tools');
  const [summary, setSummary] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // My submitted posts
  const [myPosts, setMyPosts] = useState<{id: string; title: string; status: string; created_at: string}[]>([]);

  const handleLogin = async () => {
    if (!email || !password) { setLoginError('Please enter email and password.'); return; }
    setLoginLoading(true);
    setLoginError('');

    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('password', password)
      .eq('active', true)
      .single();

    setLoginLoading(false);

    if (error || !data) {
      setLoginError('Invalid credentials or account is inactive. Contact the admin.');
    } else {
      setVolunteer(data);
      fetchMyPosts(data.id);
    }
  };

  const fetchMyPosts = async (volunteerId: string) => {
    const { data } = await supabase
      .from('posts')
      .select('id, title, status, created_at')
      .eq('volunteer_id', volunteerId)
      .order('created_at', { ascending: false });
    setMyPosts(data || []);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async () => {
    if (!title || !summary) {
      setSubmitMessage('Please fill in title and summary.');
      setSubmitStatus('error');
      return;
    }
    setSubmitStatus('loading');

    try {
      let coverImageUrl = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('post-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('post-images').getPublicUrl(fileName);
        coverImageUrl = urlData.publicUrl;
      }

      const slug = slugify(title);

      // Editors can publish directly, contributors save as draft
      const postStatus = volunteer?.role === 'editor' ? 'published' : 'draft';

      const { error } = await supabase.from('posts').insert({
        title, slug, category, summary,
        youtube_url: youtubeUrl,
        source_link: sourceLink,
        author: volunteer?.name,
        cover_image_url: coverImageUrl,
        volunteer_id: volunteer?.id,
        status: postStatus,
        published_at: postStatus === 'published' ? new Date().toISOString() : null,
      });

      if (error) throw error;

      setSubmitStatus('success');
      setSubmitMessage(
        volunteer?.role === 'editor'
          ? '🚀 Post published successfully!'
          : '✓ Post submitted! The admin will review and publish it.'
      );

      // Reset form
      setTitle(''); setSummary(''); setYoutubeUrl('');
      setSourceLink(''); setImageFile(null); setImagePreview('');

      // Refresh my posts
      if (volunteer) fetchMyPosts(volunteer.id);

    } catch (err: unknown) {
      setSubmitStatus('error');
      setSubmitMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(41,196,246,0.2)',
    color: '#fff', fontSize: '14px', outline: 'none',
  } as React.CSSProperties;

  const labelStyle = {
    fontSize: '12px', fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em', display: 'block', marginBottom: '6px',
  };

  // ── LOGIN SCREEN ──
  if (!volunteer) {
    return (
      <main style={{ backgroundColor: '#080e5e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#0d1580', padding: '3rem', borderRadius: '12px', border: '1px solid rgba(41,196,246,0.2)', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ height: '50px', width: '160px', position: 'relative' }}>
              <Image src="/logo.png" alt="Tech O'clock" fill sizes="160px" style={{ objectFit: 'contain' }} />
            </div>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: '0.25rem' }}>Contributor Portal</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '1.5rem' }}>Tech O'clock Team</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input type="email" placeholder="Your email address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={inputStyle} />
            <input type="password" placeholder="Your password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              style={inputStyle} />
          </div>

          {loginError && (
            <p style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '0.75rem' }}>{loginError}</p>
          )}

          <button onClick={handleLogin} disabled={loginLoading}
            style={{ width: '100%', backgroundColor: '#c1f135', color: '#080e5e', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '1rem', opacity: loginLoading ? 0.7 : 1 }}>
            {loginLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '1rem' }}>
            Don't have access? Contact the Tech O'clock admin.
          </p>
        </div>
      </main>
    );
  }

  // ── CONTRIBUTOR DASHBOARD ──
  return (
    <main style={{ backgroundColor: '#080e5e', minHeight: '100vh', color: '#fff' }}>

      {/* Header */}
      <nav style={{ backgroundColor: '#c1f135', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ height: '36px', width: '110px', position: 'relative' }}>
            <Image src="/logo.png" alt="Tech O'clock" fill sizes="110px" style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#080e5e', backgroundColor: 'rgba(8,14,94,0.15)', padding: '3px 10px', borderRadius: '20px' }}>
            {volunteer.role === 'editor' ? 'Editor' : 'Contributor'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#080e5e', fontWeight: '600' }}>👋 {volunteer.name}</span>
          <button onClick={() => setVolunteer(null)}
            style={{ backgroundColor: '#080e5e', color: '#c1f135', border: 'none', padding: '7px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

        {/* Welcome banner */}
        <div style={{ backgroundColor: '#0d1580', borderRadius: '10px', padding: '1.25rem 1.5rem', border: '1px solid rgba(41,196,246,0.1)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Welcome back, {volunteer.name}!</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              {volunteer.role === 'editor'
                ? 'You can write and publish posts directly.'
                : 'Write posts and submit them for admin review before they go live.'}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#c1f135' }}>{myPosts.length}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>posts submitted</p>
          </div>
        </div>

        {/* Post Form */}
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '0.25rem' }}>
          {volunteer.role === 'editor' ? 'Publish New Post' : 'Submit New Post'}
        </h2>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
          {volunteer.role === 'editor'
            ? 'Your posts publish immediately.'
            : 'Your post will be saved as a draft and reviewed by the admin before going live.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Google Launches New AI Tool for Businesses"
              style={inputStyle} />
            {title && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Slug: /posts/{slugify(title)}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, backgroundColor: '#0d1580' }}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Your Name</label>
              <input type="text" value={volunteer.name} disabled
                style={{ ...inputStyle, opacity: 0.5 }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Summary *</label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)}
              placeholder="Write your summary here..." rows={5}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          <div>
            <label style={labelStyle}>Cover Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange}
              style={{ ...inputStyle, color: 'rgba(255,255,255,0.6)' }} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview"
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
            )}
          </div>

          <div>
            <label style={labelStyle}>YouTube Video URL</label>
            <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
            {youtubeUrl && getYouTubeId(youtubeUrl) && (
              <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9' }}>
                <iframe width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${getYouTubeId(youtubeUrl)}`}
                  allowFullScreen style={{ border: 'none' }} />
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Source Link</label>
            <input type="text" value={sourceLink} onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://original-article.com" style={inputStyle} />
          </div>

          {submitMessage && (
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: submitStatus === 'success' ? 'rgba(193,241,53,0.1)' : 'rgba(255,100,100,0.1)', border: `1px solid ${submitStatus === 'success' ? 'rgba(193,241,53,0.3)' : 'rgba(255,100,100,0.3)'}`, fontSize: '13px', color: submitStatus === 'success' ? '#c1f135' : '#ff6b6b' }}>
              {submitMessage}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitStatus === 'loading'}
            style={{ backgroundColor: '#c1f135', color: '#080e5e', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: submitStatus === 'loading' ? 0.7 : 1 }}>
            {submitStatus === 'loading' ? 'Submitting...' : volunteer.role === 'editor' ? '🚀 Publish Post' : '📤 Submit for Review'}
          </button>
        </div>

        {/* My Posts */}
        {myPosts.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '1rem' }}>My Submitted Posts</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myPosts.map(post => (
                <div key={post.id} style={{ backgroundColor: '#0d1580', borderRadius: '8px', padding: '1rem 1.25rem', border: '1px solid rgba(41,196,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.85)' }}>{post.title}</p>
                  <span style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '20px', backgroundColor: post.status === 'published' ? 'rgba(193,241,53,0.15)' : 'rgba(255,165,0,0.15)', color: post.status === 'published' ? '#c1f135' : '#ffa500', fontWeight: '600', flexShrink: 0 }}>
                    {post.status === 'published' ? '✓ Published' : '⏳ Pending Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}