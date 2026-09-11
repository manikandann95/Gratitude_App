// ============================================================
//  COSMOS COMMUNITY — Shared Post/Comment System
// ============================================================
window.Community = (function() {
  const MY_USER_KEY = 'cosmos-my-username';
  const MY_COLOR_KEY = 'cosmos-my-color';
  const SAVED_KEY = 'cosmos-saved-posts';
  const AVATAR_COLORS = ['#9b7dea','#ec4899','#4ade80','#60a5fa','#fbbf24','#f472b6','#34d399','#fb923c'];

  // --- Utilities ---
  function getMyName() { return localStorage.getItem(MY_USER_KEY) || 'Anonymous'; }
  function getMyColor() {
    let c = localStorage.getItem(MY_COLOR_KEY);
    if (!c) { c = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]; localStorage.setItem(MY_COLOR_KEY, c); }
    return c;
  }
  function hashColor(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
  }
  function timeAgo(ts) {
    const sec = Math.floor((Date.now() - ts) / 1000);
    if (sec < 60) return 'just now';
    const min = Math.floor(sec/60); if (min < 60) return min+'m ago';
    const hr = Math.floor(min/60); if (hr < 24) return hr+'h ago';
    const d = Math.floor(hr/24); if (d < 30) return d+'d ago';
    return new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric'});
  }
  function getPosts(spaceId) { return JSON.parse(localStorage.getItem('cosmos-posts-'+spaceId) || '[]'); }
  function savePosts(spaceId, posts) { localStorage.setItem('cosmos-posts-'+spaceId, JSON.stringify(posts)); }
  function getSaved() { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); }
  function setSaved(arr) { localStorage.setItem(SAVED_KEY, JSON.stringify(arr)); }

  // --- Create post ---
  function addPost(spaceId, message, tags, extra) {
    if (!message.trim()) return null;
    const name = getMyName();
    const post = {
      id: Date.now(),
      authorName: name,
      authorColor: hashColor(name),
      message: message.trim(),
      tags: tags || [],
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      comments: [],
      pinned: false,
      extra: extra || {}
    };
    const posts = getPosts(spaceId);
    posts.unshift(post);
    savePosts(spaceId, posts);
    if (window.awardCoins) awardCoins(2, 'Community Post');
    return post;
  }

  // --- Add comment ---
  function addComment(spaceId, postId, message) {
    if (!message.trim()) return;
    const name = getMyName();
    const comment = { id: Date.now(), authorName: name, authorColor: hashColor(name), message: message.trim(), timestamp: Date.now() };
    const posts = getPosts(spaceId);
    const post = posts.find(p => p.id === postId);
    if (post) { post.comments.push(comment); savePosts(spaceId, posts); }
    if (window.awardCoins) awardCoins(1, 'Community Comment');
    return comment;
  }

  // --- Toggle like ---
  function toggleLike(spaceId, postId) {
    const posts = getPosts(spaceId);
    const post = posts.find(p => p.id === postId);
    if (!post) return 0;
    const me = getMyName();
    if (post.likedBy.includes(me)) {
      post.likedBy = post.likedBy.filter(n => n !== me);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(me);
      post.likes++;
    }
    savePosts(spaceId, posts);
    return { likes: post.likes, liked: post.likedBy.includes(me) };
  }

  // --- Toggle save ---
  function toggleSave(spaceId, postId) {
    const saved = getSaved();
    const key = spaceId + ':' + postId;
    if (saved.includes(key)) { setSaved(saved.filter(k => k !== key)); return false; }
    saved.push(key); setSaved(saved); return true;
  }
  function isSaved(spaceId, postId) { return getSaved().includes(spaceId+':'+postId); }

  // --- Delete post ---
  function deletePost(spaceId, postId) {
    const posts = getPosts(spaceId).filter(p => p.id !== postId);
    savePosts(spaceId, posts);
  }

  // --- Pin post ---
  function pinPost(spaceId, postId) {
    const posts = getPosts(spaceId);
    const post = posts.find(p => p.id === postId);
    if (post) { post.pinned = !post.pinned; savePosts(spaceId, posts); }
  }

  // --- Render a single post ---
  function renderPost(post, spaceId, cfg) {
    cfg = cfg || {};
    const saved = isSaved(spaceId, post.id);
    const me = getMyName();
    const liked = (post.likedBy||[]).includes(me);
    const initial = (post.authorName||'?')[0].toUpperCase();
    const isAdmin = cfg.isAdmin || false;
    const tagsHtml = (post.tags||[]).map(t => `<span class="tag-chip">${t}</span>`).join('');
    const extraHtml = cfg.extraHtml ? cfg.extraHtml(post) : '';
    const pinnedBadge = post.pinned ? '<span class="badge-pinned">&#128204; Pinned</span> ' : '';
    const adminBadge = (post.authorName === localStorage.getItem('cosmos-admin-name') || isAdmin) ? '<span class="badge-admin">Admin</span> ' : '';

    const commentsHtml = (post.comments||[]).map(c => `
      <div class="comment-item">
        <div class="avatar-circle" style="background:${c.authorColor||'#9b7dea'};width:28px;height:28px;font-size:0.7rem">${(c.authorName||'?')[0].toUpperCase()}</div>
        <div class="comment-body">
          <div class="comment-author">${escHtml(c.authorName)} <span class="comment-time">${timeAgo(c.timestamp)}</span></div>
          <div class="comment-text">${escHtml(c.message)}</div>
        </div>
      </div>`).join('');

    return `
    <div class="post-card" id="post-${post.id}" data-postid="${post.id}">
      <div class="post-header">
        <div class="avatar-circle" style="background:${post.authorColor||'#9b7dea'}">${initial}</div>
        <div class="post-meta">
          <span class="author">${escHtml(post.authorName)}</span>
          ${adminBadge}${pinnedBadge}
          <span class="time">${timeAgo(post.timestamp)}</span>
        </div>
        ${post.authorName === me ? `<button onclick="Community.deletePost('${spaceId}',${post.id})" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:0.8rem;padding:4px 8px" title="Delete">&#215;</button>` : ''}
      </div>
      ${extraHtml}
      <div class="post-body">${escHtml(post.message)}</div>
      <div class="post-tags">${tagsHtml}</div>
      <div class="post-actions">
        <button class="post-action-btn${liked?' liked':''}" onclick="Community.handleLike('${spaceId}',${post.id},this)">
          ${liked?'&#10084;&#65039;':'&#129293;'} <span class="like-count">${post.likes||0}</span>
        </button>
        <button class="post-action-btn" onclick="Community.toggleComments(${post.id})">
          &#128172; <span>${(post.comments||[]).length}</span>
        </button>
        <button class="post-action-btn${saved?' saved':''}" onclick="Community.handleSave('${spaceId}',${post.id},this)">
          ${saved?'&#128204;':'&#128278;'} ${saved?'Saved':'Save'}
        </button>
        <button class="post-action-btn" onclick="Community.copyLink(${post.id})">&#128279; Share</button>
        ${cfg.canPin ? `<button class="post-action-btn" onclick="Community.handlePin('${spaceId}',${post.id})">&#128204; Pin</button>` : ''}
      </div>
      <div class="comments-section" id="comments-${post.id}">
        <div id="comment-list-${post.id}">${commentsHtml}</div>
        <div class="comment-input-row">
          <input class="comment-input" placeholder="Write a comment..." id="ci-${post.id}" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();Community.submitComment('${spaceId}',${post.id})}" />
          <button class="btn btn-primary btn-sm" onclick="Community.submitComment('${spaceId}',${post.id})">Post</button>
        </div>
      </div>
    </div>`;
  }

  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // --- Render post list ---
  function renderPosts(spaceId, containerId, cfg) {
    const posts = getPosts(spaceId);
    const sorted = [...posts].sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0) || b.timestamp-a.timestamp);
    const container = document.getElementById(containerId);
    if (!container) return;
    if (posts.length === 0) {
      container.innerHTML = '<div class="empty-state" style="padding:40px;text-align:center;color:var(--text-muted)">&#127775; No posts yet. Be the first to share!</div>';
      return;
    }
    container.innerHTML = sorted.map(p => renderPost(p, spaceId, cfg)).join('');
  }

  // --- Public handlers (called from inline onclick) ---
  window.Community = {
    getMyName, getMyColor, hashColor, timeAgo, getPosts, addPost, addComment,
    toggleLike, toggleSave, isSaved, deletePost, pinPost, renderPost, renderPosts, escHtml,

    handleLike(spaceId, postId, btn) {
      const res = toggleLike(spaceId, postId);
      btn.className = 'post-action-btn' + (res.liked ? ' liked' : '');
      btn.innerHTML = (res.liked ? '&#10084;&#65039;' : '&#129293;') + ' <span class="like-count">' + res.likes + '</span>';
    },

    handleSave(spaceId, postId, btn) {
      const saved = toggleSave(spaceId, postId);
      btn.className = 'post-action-btn' + (saved ? ' saved' : '');
      btn.innerHTML = (saved ? '&#128204;' : '&#128278;') + ' ' + (saved ? 'Saved' : 'Save');
      if (saved && window.showToast) showToast('Post saved!');
    },

    handlePin(spaceId, postId) {
      pinPost(spaceId, postId);
      if (window.currentSpaceRender) window.currentSpaceRender();
      if (window.showToast) showToast('Post pinned!');
    },

    toggleComments(postId) {
      const el = document.getElementById('comments-' + postId);
      if (el) { el.style.display = el.style.display === 'block' ? 'none' : 'block'; }
    },

    submitComment(spaceId, postId) {
      const input = document.getElementById('ci-' + postId);
      if (!input || !input.value.trim()) return;
      const comment = addComment(spaceId, postId, input.value);
      input.value = '';
      const list = document.getElementById('comment-list-' + postId);
      if (list && comment) {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `<div class="avatar-circle" style="background:${comment.authorColor};width:28px;height:28px;font-size:0.7rem">${comment.authorName[0].toUpperCase()}</div>
          <div class="comment-body"><div class="comment-author">${escHtml(comment.authorName)} <span class="comment-time">just now</span></div>
          <div class="comment-text">${escHtml(comment.message)}</div></div>`;
        list.appendChild(div);
      }
      // Update comment count
      const btn = document.querySelector(`#post-${postId} .post-action-btn:nth-child(2) span`);
      if (btn) btn.textContent = parseInt(btn.textContent||'0') + 1;
    },

    deletePost(spaceId, postId) {
      if (!confirm('Delete this post?')) return;
      const posts = getPosts(spaceId).filter(p => p.id !== postId);
      savePosts(spaceId, posts);
      const el = document.getElementById('post-' + postId);
      if (el) el.remove();
      if (window.showToast) showToast('Post deleted.');
    },

    copyLink(postId) {
      navigator.clipboard.writeText(window.location.href + '#post-' + postId)
        .then(() => { if(window.showToast) showToast('Link copied!'); });
    },

    // Set/save username
    setName(name) { if(name) localStorage.setItem(MY_USER_KEY, name); },

    // Get all saved posts across spaces
    getAllSavedPosts() {
      const saved = getSaved();
      const SPACES = ['introduce','intentions','announcements','gratitude-wall','the-circle'];
      const results = [];
      SPACES.forEach(sid => {
        const posts = getPosts(sid);
        posts.forEach(p => {
          if (saved.includes(sid+':'+p.id)) results.push({...p, spaceId: sid});
        });
      });
      return results.sort((a,b) => b.timestamp - a.timestamp);
    }
  };

  return window.Community;
})();
