import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useDarkMode } from '../context/DarkModeContext';
import './post-page.css';
import './menu-buttons.css';

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useDarkMode();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [tempEditBody, setTempEditBody] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    if (post) {
      console.log('Post data:', post);
      console.log('EditedBy:', post.editedBy);
    }
  }, [post]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data.comments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    setIsLiked(
      user &&
      post?.likes?.some(
        (like) =>
          (like._id || like)?.toString() === user._id.toString()
      )
    );
  }, [post, user]);

  const handleLike = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!user) return;
    const newIsLiked = !isLiked;
    const newCount = isLiked ? (post.likeCount || 0) - 1 : (post.likeCount || 0) + 1;
    setIsLiked(newIsLiked);
    setPost((prev) => ({ ...prev, likeCount: newCount }));
    setLikeLoading(true);
    try {
      await API.post(`/posts/${id}/like`);
      const postRes = await API.get(`/posts/${id}`);
      setPost(postRes.data);
    } catch (err) {
      setIsLiked(isLiked);
      console.error('Like error:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');
    if (!user || !commentBody.trim()) return;
    setCommentLoading(true);
    try {
      const res = await API.post(`/comments/${id}`, { body: commentBody });
      setComments([res.data, ...comments]);
      setCommentBody('');
      const postRes = await API.get(`/posts/${id}`);
      setPost(postRes.data);
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      const errorMsg = Array.isArray(apiMsg)
        ? apiMsg.map((e) => e.msg || e.message || 'Validation error').join(', ')
        : apiMsg || 'Failed to post comment. Try again.';
      setCommentError(errorMsg);
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const canEditComment = (comment) => {
    if (!user) return false;
    return comment.author?._id?.toString() === user._id.toString();
  };

  const canDeleteComment = (comment) => {
    if (!user) return false;
    const isCommentOwner = comment.author?._id?.toString() === user._id.toString();
    const isPostOwner = post?.author?._id?.toString() === user._id.toString();
    return isCommentOwner || isPostOwner;
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setTempEditBody(comment.body || '');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!tempEditBody.trim()) return;
    setCommentLoading(true);
    try {
      const res = await API.put(`/comments/${editingCommentId}`, { body: tempEditBody });
      const updatedComment = res.data.comment || res.data;
      setComments(comments.map((c) => (c._id === editingCommentId ? updatedComment : c)));
      setEditingCommentId(null);
      setTempEditBody('');
    } catch (err) {
      alert(err.response?.data?.message || 'Edit failed');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setTempEditBody('');
  };

  const handleDeleteClick = (commentId) => {
    setDeletingCommentId(commentId);
  };

  const handleConfirmDelete = async () => {
    setCommentLoading(true);
    try {
      await API.delete(`/comments/${deletingCommentId}`);
      setComments(comments.filter((c) => c._id !== deletingCommentId));
      const postRes = await API.get(`/posts/${id}`);
      setPost(postRes.data);
      setDeletingCommentId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletingCommentId(null);
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (!post) return <div className="not-found">Post not found.</div>;

  const likeCount = post.likes?.length || 0;

  return (
    <div className={`post-page-container ${isDark ? 'dark' : ''}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
      <button
className="back-btn"

        onClick={() => {
          navigate('/home');
          setTimeout(() => {
            document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }}
        title="Back to Homepage"
      >
        ← Back Home
      </button>

      <div style={{ flex: 1 }}>
        <article className={`post-full-card ${isDark ? 'dark' : ''} ${isLiked ? 'liked' : ''}`}>
          <header className="post-header-full">
            {user && (post.author?._id === user._id || user.role === 'admin') && (
              <>
                <button
                  className="post-menu-dots"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    background: isDark ? '#4a3a58' : 'white',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu((prev) => !prev);
                  }}
                  title="Post options"
                >
                  ⋮
                </button>

                {showMenu && (
                  <div
                    className="post-menu-dropdown"
                    style={{
                      position: 'absolute',
                      top: '50px',
                      right: '0',
                      background: isDark ? '#4a3a58' : 'white',
                      borderRadius: '8px',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      minWidth: '140px',
                      zIndex: 20,
                      color: isDark ? 'white' : 'black'
                    }}
                  >
                    <Link to={`/edit/${post._id}`} className="menu-item edit-item">
                      ✏️ Edit
                    </Link>
                    <button
                      type="button"
                      className="menu-item delete-item"
                      onClick={() => {
                        setDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                    >
                      🗑️ Delete
                    </button>
                    {post.editedBy && (
                      <button
                        type="button"
                        className="menu-item history-item"
                        style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
                        onClick={() => {
                          const history = `Original by ${post.author?.name} (${new Date(post.createdAt).toLocaleDateString()})\nEdited by ${post.editedBy.name} (${new Date(post.editedAt).toLocaleDateString()})`;
                          alert('Post History:\n\n' + history);
                        }}
                      >
                        📜 View History
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {post.image && (
              <div className="post-hero-image">
                <img src={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`} alt={post.title} onError={(e) => { e.target.style.display = 'none'; }} />


              </div>
            )}

            <h1>{post.title || 'Untitled'}</h1>

            <div className="post-meta-full">
              <small>By {post.author?.name || 'Folio Admin'} · {new Date(post.createdAt).toLocaleDateString()}</small>
              {post.editedBy ? (
                <small className="edited-meta">
                  ✏️ Edited by {post.editedBy.name} on {new Date(post.editedAt).toLocaleDateString()}
                </small>
              ) : null}
            </div>
          </header>

          <div className="post-content-full" onClick={(e) => user && handleLike(e)} style={{ cursor: user ? 'pointer' : 'default' }}>
            <div className="post-body-full" onClick={(e) => e.stopPropagation()}>
              {post.body && <p>{post.body}</p>}
            </div>

            <div className="post-actions-section">
              <div className="like-section">
                <button
                  className={`action-btn like-btn ${isLiked ? 'liked' : ''} ${likeLoading ? 'loading' : ''}`}
                  onClick={handleLike}
                  title="Like"
                  disabled={!user || likeLoading}
                >
                  <span className="heart-icon">❤︎</span>
                  <span className="count">{post.likeCount || likeCount}</span>
                </button>
                <div className="likers-list">
                  {(post.likeCount || post.likes?.length || 0) > 0 && post.likes && post.likes.slice(0, 10).map((likeUser, index) => (
                    <span key={index} className="liker-badge">
                      <img
                        src={likeUser.profilePic ? (likeUser.profilePic.startsWith('http') ? likeUser.profilePic : `/uploads/${likeUser.profilePic}`) : '/default-avatar.png'}
                        alt={likeUser.name}


                        style={{
                          width: '28px',
                          height: '28px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          border: '2px solid #e5e7eb',
                          backgroundColor: '#e5e7eb'
                        }}
                        onError={(e) => { e.target.src = '/default-avatar.png'; }}
                      />
                    </span>
                  ))}
                  {post.likes && post.likes.length > 10 && (
                    <span className="more-likers">+{post.likes.length - 10} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {deleteConfirm && (
            <div className="delete-confirm-overlay">
              <div className="delete-confirm-box">
                <h4>Delete Post?</h4>
                <p>This can't be undone.</p>
                <div className="confirm-buttons">
                  <button
                    className="confirm-btn cancel"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm-btn danger"
                    onClick={async () => {
                      setDeleteConfirm(false);
                      try {
                        await API.delete(`/posts/${id}`);
                        alert('Post deleted successfully');
                        navigate('/home');
                      } catch (err) {
                        alert('Delete failed: ' + (err.response?.data?.message || err.message));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </article>

        {deletingCommentId && (
          <div className="delete-confirm-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="delete-confirm-box" style={{ background: isDark ? '#1f2937' : 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '1rem' }}>Delete Comment?</h4>
              <p style={{ marginBottom: '1.5rem', color: isDark ? '#9ca3af' : '#6b7280' }}>This can't be undone.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  className="confirm-btn cancel"
                  onClick={handleCancelDelete}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: isDark ? '#4a3a58' : '#8b5cf6', color: 'white' }}
                >
                  Cancel
                </button>
                <button
                  className="confirm-btn danger"
                  onClick={handleConfirmDelete}
                  disabled={commentLoading}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#ef4444', color: 'white' }}
                >
                  {commentLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        <section className={`comments-container ${isDark ? 'dark' : ''}`}>
          <h3>Comments ({comments.length})</h3>
          <div className="comments-feed">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className={`comment-item ${isDark ? 'dark' : ''}`}
                onMouseEnter={(e) => {
                  const actions = e.currentTarget.querySelector('.comment-actions');
                  if (actions) actions.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const actions = e.currentTarget.querySelector('.comment-actions');
                  if (actions && editingCommentId !== comment._id) actions.style.opacity = '0';
                }}
              >
                <div className="comment-avatar">
                  {comment.author?.profilePic ? (
                    <img
                      src={comment.author.profilePic ? (comment.author.profilePic.startsWith('http') ? comment.author.profilePic : `/uploads/${comment.author.profilePic}`) : '/default-avatar.png'}
                      alt={comment.author.name}
                      className="comment-avatar-img"
                      style={{ width: '24px', height: '24px', objectFit: 'cover', borderRadius: '50%' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />


                  ) : (
                    <div className="avatar-placeholder" style={{ width: '24px', height: '24px', lineHeight: '24px', fontSize: '12px' }}>
                      {comment.author?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="comment-content" style={{ flex: 1 }}>
                  <div className="comment-author">
                    <strong>{comment.author?.name || 'Anonymous'}</strong>
                    <span className="comment-time">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  {editingCommentId === comment._id ? (
                    <form onSubmit={handleSaveEdit} style={{ marginTop: '0.5rem' }}>
                      <textarea
                        value={tempEditBody}
                        onChange={(e) => setTempEditBody(e.target.value)}
                        style={{
                          width: '100%',
                          minHeight: '60px',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: isDark ? '2px solid #6b7280' : '2px solid #ddd',
                          fontSize: '0.95rem',
                          resize: 'vertical',
                          background: isDark ? '#374151' : 'white',
                          color: isDark ? '#f9fafb' : '#111827'
                        }}
                        autoFocus
                      />
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="submit"
                          className="comment-btn"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                          disabled={commentLoading || !tempEditBody.trim()}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="comment-btn"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: isDark ? '#4b5563' : '#f0f0f0' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="comment-text">{comment.body}</p>
                      {(() => {
                        const canEdit = canEditComment(comment);
                        const canDel = canDeleteComment(comment);
                        if (!canEdit && !canDel) return null;
                        return (
                          <div className="comment-actions" style={{ marginTop: '0.5rem', opacity: 0, transition: 'opacity 0.2s ease' }}>
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => handleEditClick(comment)}
                                className="comment-btn"
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                                title="Edit comment"
                              >
                                ✏️ Edit
                              </button>
                            )}
                            {canDel && (
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(comment._id)}
                                className="comment-btn"
                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: isDark ? '#7f1d1d' : '#fee' }}
                                title="Delete comment"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {user ? (
            <>
              {commentError && <p className="error-msg" style={{ color: 'red', marginBottom: '10px' }}>{commentError}</p>}
              <form onSubmit={handleCommentSubmit} className="new-comment-form">
                <div className="comment-input-wrapper">
                  <textarea
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Write your comment..."
                    rows={3}
                    disabled={commentLoading}
                  />
                  <button
                    type="submit"
                    className="comment-submit-btn"
                    disabled={commentLoading || !commentBody.trim()}
                  >
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="login-to-comment">
              <p>Login to add comments <Link to="/login">Login</Link></p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PostPage;