'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const ADMIN_PASSWORD = 'techoclock2026';
const categories = ['AI Tools', 'Funding', 'Africa Tech', 'Startups', 'Cloud', 'Research', 'Enterprise', 'Newsletter'];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

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
  status: string;
  published_at: string;
  created_at: string;
};

type Volunteer = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
  created_at: string;
};

// ── LOGIN ──────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Wrong password. Try again.');
    }
  };

  return (
    <main style={{ backgroundColor: '#080e5e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#0d1580', padding: '3rem', borderRadius: '12px', border: '1px solid rgba(41,196,246,0.2)', width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ height: '50px', width: '160px', position: 'relative' }}>
            <Image src="/logo.png" alt="Tech O'clock" fill sizes="160px" style={{ objectFit: 'contain' }} />
          </div>
        </div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: '0.25rem' }}>Admin Panel</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '1.5rem' }}>Tech O'clock</p>
        <input type="password" placeholder="Enter admin password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(41,196,246,0.2)', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '0.75rem' }} />
        {error && <p style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '0.75rem' }}>{error}</p>}
        <button onClick={handleLogin} style={{ width: '100%', backgroundColor: '#c1f135', color: '#080e5e', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Sign In</button>
      </div>
    </main>
  );
}

// ── NEW POST FORM ──────────────────────────────────
function NewPostForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AI Tools');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [author, setAuthor] = useState("Tech O'clock");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (postStatus: 'published' | 'draft') => {
    if (!title || !summary || !category) {
      setMessage('Please fill in title, category and summary.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setMessage('');
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
      const baseSlug = slugify(title);
      const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;
      const { error } = await supabase.from('posts').insert({
        title, slug, category, summary,
        content,
        youtube_url: youtubeUrl, source_link: sourceLink, author,
        cover_image_url: coverImageUrl, status: postStatus,
        published_at: postStatus === 'published' ? new Date().toISOString() : null,
      });
      if (error) throw error;
      setStatus('success');
      setMessage(postStatus === 'published' ? `✓ Published! /posts/${slug}` : '✓ Saved as draft!');
      setTitle(''); setSummary(''); setYoutubeUrl(''); setSourceLink('');
      setImageFile(null); setImagePreview('');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(41,196,246,0.2)', color: '#fff', fontSize: '14px', outline: 'none' } as React.CSSProperties;
  const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={labelStyle}>Title *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..." style={inputStyle} />
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
          <label style={labelStyle}>Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Summary *</label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)}
          placeholder="Write your summary or paste your content here..." rows={5}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
      </div>

      {/* Rich Content Editor */}
      <div>
        <label style={labelStyle}>Full Content (Markdown supported)</label>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
          Supports **bold**, ## headings, - bullet points, [links](url), and more
        </p>
        <div data-color-mode="dark">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            height={400}
            preview="live"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Cover Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange}
          style={{ ...inputStyle, color: 'rgba(255,255,255,0.6)' }} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
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

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: status === 'success' ? 'rgba(193,241,53,0.1)' : 'rgba(255,100,100,0.1)', border: `1px solid ${status === 'success' ? 'rgba(193,241,53,0.3)' : 'rgba(255,100,100,0.3)'}`, fontSize: '13px', color: status === 'success' ? '#c1f135' : '#ff6b6b' }}>{message}</div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => handleSubmit('draft')} disabled={status === 'loading'}
          style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          {status === 'loading' ? 'Saving...' : 'Save as Draft'}
        </button>
        <button onClick={() => handleSubmit('published')} disabled={status === 'loading'}
          style={{ flex: 2, backgroundColor: '#c1f135', color: '#080e5e', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
          {status === 'loading' ? 'Publishing...' : '🚀 Publish Post'}
        </button>
      </div>
    </div>
  );
}

// ── MANAGE POSTS ───────────────────────────────────
function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const toggleStatus = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await supabase.from('posts').update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    }).eq('id', post.id);
    setMessage(`Post ${newStatus === 'published' ? 'published' : 'unpublished'}!`);
    fetchPosts();
    setTimeout(() => setMessage(''), 3000);
  };

  const deletePost = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    setDeleteConfirm(null);
    setMessage('Post deleted.');
    fetchPosts();
    setTimeout(() => setMessage(''), 3000);
  };

  const saveEdit = async () => {
    if (!editingPost) return;
    await supabase.from('posts').update({
      title: editingPost.title,
      category: editingPost.category,
      summary: editingPost.summary,
      content: editingPost.content,
      youtube_url: editingPost.youtube_url,
      source_link: editingPost.source_link,
      author: editingPost.author,
    }).eq('id', editingPost.id);
    setEditingPost(null);
    setMessage('Post updated!');
    fetchPosts();
    setTimeout(() => setMessage(''), 3000);
  };

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(41,196,246,0.2)', color: '#fff', fontSize: '13px', outline: 'none' } as React.CSSProperties;

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem', textAlign: 'center' }}>Loading posts...</div>;

  return (
    <div>
      {message && (
        <div style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: 'rgba(193,241,53,0.1)', border: '1px solid rgba(193,241,53,0.3)', fontSize: '13px', color: '#c1f135', marginBottom: '1rem' }}>{message}</div>
      )}

      {posts.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>No posts yet. Create your first post!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.map(post => (
            <div key={post.id}>
              {/* Edit Mode */}
              {editingPost?.id === post.id ? (
                <div style={{ backgroundColor: '#0d1580', borderRadius: '10px', padding: '1.5rem', border: '1px solid rgba(193,241,53,0.3)' }}>
                  <p style={{ fontSize: '12px', color: '#c1f135', fontWeight: '600', marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Editing Post</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} style={inputStyle} placeholder="Title" />
                    <select value={editingPost.category} onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      style={{ ...inputStyle, backgroundColor: '#080e5e' }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea value={editingPost.summary} onChange={(e) => setEditingPost({ ...editingPost, summary: e.target.value })}
                      rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} placeholder="Summary" />
                    <input value={editingPost.youtube_url || ''} onChange={(e) => setEditingPost({ ...editingPost, youtube_url: e.target.value })} style={inputStyle} placeholder="YouTube URL" />
                    <input value={editingPost.source_link || ''} onChange={(e) => setEditingPost({ ...editingPost, source_link: e.target.value })} style={inputStyle} placeholder="Source link" />
                    <input value={editingPost.author} onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })} style={inputStyle} placeholder="Author" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                    <button onClick={saveEdit} style={{ flex: 1, backgroundColor: '#c1f135', color: '#080e5e', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Save Changes</button>
                    <button onClick={() => setEditingPost(null)} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div style={{ backgroundColor: '#0d1580', borderRadius: '10px', padding: '1.25rem 1.5rem', border: '1px solid rgba(41,196,246,0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase', color: '#29c4f6' }}>{post.category}</span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', backgroundColor: post.status === 'published' ? 'rgba(193,241,53,0.15)' : 'rgba(255,255,255,0.08)', color: post.status === 'published' ? '#c1f135' : 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
                        {post.status === 'published' ? '● Published' : '○ Draft'}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '4px', lineHeight: '1.3' }}>{post.title}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>By {post.author}</p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* View */}
                    <a href={`/posts/${post.slug}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(41,196,246,0.1)', color: '#29c4f6', textDecoration: 'none', fontWeight: '600' }}>View</a>
                    {/* Edit */}
                    <button onClick={() => setEditingPost(post)}
                      style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                    {/* Publish/Unpublish toggle */}
                    <button onClick={() => toggleStatus(post)}
                      style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: post.status === 'published' ? 'rgba(255,165,0,0.15)' : 'rgba(193,241,53,0.15)', color: post.status === 'published' ? '#ffa500' : '#c1f135', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    {/* Delete */}
                    {deleteConfirm === post.id ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => deletePost(post.id)}
                          style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,80,80,0.2)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.3)', cursor: 'pointer', fontWeight: '600' }}>Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)}
                          style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(post.id)}
                        style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,80,80,0.1)', color: '#ff5050', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── VOLUNTEERS ─────────────────────────────────────
function VolunteersTab() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('contributor');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    const { data } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
    setVolunteers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchVolunteers(); }, []);

  const addVolunteer = async () => {
    if (!name || !email || !password) {
      setMessage('Please fill in all fields.'); setStatus('error'); return;
    }
    setStatus('loading');
    const { error } = await supabase.from('volunteers').insert({ name, email, password, role });
    if (error) {
      setStatus('error');
      setMessage(error.message.includes('unique') ? 'Email already exists.' : error.message);
    } else {
      setStatus('success');
      setMessage(`✓ ${name} added as ${role}!`);
      setName(''); setEmail(''); setPassword('');
      fetchVolunteers();
    }
    setTimeout(() => { setMessage(''); setStatus('idle'); }, 4000);
  };

  const toggleActive = async (v: Volunteer) => {
    await supabase.from('volunteers').update({ active: !v.active }).eq('id', v.id);
    fetchVolunteers();
  };

  const deleteVolunteer = async (id: string) => {
    await supabase.from('volunteers').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchVolunteers();
  };

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(41,196,246,0.2)', color: '#fff', fontSize: '13px', outline: 'none' } as React.CSSProperties;

  return (
    <div>
      {/* Add Volunteer Form */}
      <div style={{ backgroundColor: '#0d1580', borderRadius: '10px', padding: '1.5rem', border: '1px solid rgba(41,196,246,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '1rem' }}>Add New Volunteer</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" style={inputStyle} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" style={inputStyle} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="text" style={inputStyle} />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...inputStyle, backgroundColor: '#080e5e' }}>
            <option value="contributor">Contributor — needs approval</option>
            <option value="editor">Editor — can publish directly</option>
          </select>
        </div>
        {message && (
          <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: status === 'success' ? 'rgba(193,241,53,0.1)' : 'rgba(255,100,100,0.1)', fontSize: '13px', color: status === 'success' ? '#c1f135' : '#ff6b6b', marginBottom: '0.75rem' }}>{message}</div>
        )}
        <button onClick={addVolunteer} disabled={status === 'loading'}
          style={{ backgroundColor: '#c1f135', color: '#080e5e', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
          {status === 'loading' ? 'Adding...' : '+ Add Volunteer'}
        </button>
      </div>

      {/* Role explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(41,196,246,0.05)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(41,196,246,0.1)' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#29c4f6', marginBottom: '4px' }}>CONTRIBUTOR</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>Can write and save posts as drafts. You review and publish them.</p>
        </div>
        <div style={{ backgroundColor: 'rgba(193,241,53,0.05)', borderRadius: '8px', padding: '1rem', border: '1px solid rgba(193,241,53,0.1)' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#c1f135', marginBottom: '4px' }}>EDITOR</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>Can write AND publish posts directly without your approval.</p>
        </div>
      </div>

      {/* Volunteers List */}
      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : volunteers.length === 0 ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>No volunteers yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {volunteers.map(v => (
            <div key={v.id} style={{ backgroundColor: '#0d1580', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid rgba(41,196,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', opacity: v.active ? 1 : 0.5 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{v.name}</p>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', backgroundColor: v.role === 'editor' ? 'rgba(193,241,53,0.15)' : 'rgba(41,196,246,0.15)', color: v.role === 'editor' ? '#c1f135' : '#29c4f6', fontWeight: '600' }}>
                    {v.role.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', backgroundColor: v.active ? 'rgba(34,197,94,0.15)' : 'rgba(255,100,100,0.15)', color: v.active ? '#22c55e' : '#ff6b6b', fontWeight: '600' }}>
                    {v.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{v.email} · Password: {v.password}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => toggleActive(v)}
                  style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                  {v.active ? 'Deactivate' : 'Activate'}
                </button>
                {deleteConfirm === v.id ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => deleteVolunteer(v.id)}
                      style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,80,80,0.2)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.3)', cursor: 'pointer', fontWeight: '600' }}>Confirm</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(v.id)}
                    style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255,80,80,0.1)', color: '#ff5050', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN ADMIN PAGE ────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'manage' | 'volunteers'>('new');

  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;

  const tabs = [
    { id: 'new', label: '+ New Post' },
    { id: 'manage', label: 'Manage Posts' },
    { id: 'volunteers', label: 'Volunteers' },
  ] as const;

  return (
    <main style={{ backgroundColor: '#080e5e', minHeight: '100vh', color: '#fff' }}>

      {/* Header */}
      <nav style={{ backgroundColor: '#c1f135', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ height: '36px', width: '110px', position: 'relative' }}>
            <Image src="/logo.png" alt="Tech O'clock" fill sizes="110px" style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#080e5e', backgroundColor: 'rgba(8,14,94,0.15)', padding: '3px 10px', borderRadius: '20px' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/" style={{ fontSize: '13px', color: '#080e5e', fontWeight: '600', textDecoration: 'none' }}>← View Site</a>
          <button onClick={() => setAuthenticated(false)} style={{ backgroundColor: '#080e5e', color: '#c1f135', border: 'none', padding: '7px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>

      {/* Tabs */}
      <div style={{ backgroundColor: '#0a0f6e', borderBottom: '1px solid rgba(41,196,246,0.1)', padding: '0 2rem', display: 'flex', gap: '0' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ fontSize: '13px', fontWeight: '600', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab.id ? '#c1f135' : 'rgba(255,255,255,0.4)', borderBottom: activeTab === tab.id ? '2px solid #c1f135' : '2px solid transparent' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'new' && (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '0.25rem' }}>New Post</h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>Create and publish content to Tech O'clock</p>
            <NewPostForm />
          </>
        )}
        {activeTab === 'manage' && (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '0.25rem' }}>Manage Posts</h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>Edit, publish, unpublish or delete your posts</p>
            <ManagePosts />
          </>
        )}
        {activeTab === 'volunteers' && (
          <>
            <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '0.25rem' }}>Volunteers</h1>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>Manage your team of contributors and editors</p>
            <VolunteersTab />
          </>
        )}
      </div>
    </main>
  );
}