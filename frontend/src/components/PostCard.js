import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { getImageUrl } from '../lib/imageUrl';
import './PostCard.css';
import '../pages/menu-buttons.css';


const PostCard = ({ post, refreshPosts, isLatest }) => {
  const navigate = useNavigate();
  const { isDark } = useDarkMode();
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [liked, setLiked] = useState(false);
  const [comments] = useState(post.commentCount || post.comments || 0);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (user && post.likes) {
      setLiked(post.likes.some(likeUser => likeUser._id === user._id));
    }
    setLikeCount(post.likeCount || post.likes?.length || 0);
  }, [post, user]);

  const handleCardClick = () => {
    navigate(`/posts/${post._id}`);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      console.log('Login to like');
      return;
    }
    if (loading) return;
    
    const newLiked = !liked;
    const newCount = liked ? likeCount - 1 : likeCount + 1;
    setLiked(newLiked);
    setLikeCount(newCount);
    setLoading(true);
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      console.log('Like toggled:', res.data);
    } catch (err) {
      setLiked(liked);
      setLikeCount(likeCount);
      console.error('Like error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    navigate(`/posts/${post._id}`);
  };

  return (
    <div 
className={`post-card ${liked ? 'liked' : ''} ${isDark ? 'dark' : ''} ${isLatest ? 'latest' : ''} ${isLatest && post.image ? 'latest-with-image' : ''} ${isLatest && !post.image ? 'latest-no-image' : ''} ${post.image ? 'has-image' : 'no-image'}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {post.image && (
        <div className="post-image-wrapper" onClick={(e) => e.stopPropagation()}>
            <img 
              src={getImageUrl(post.image)}

              alt={post.title}
              loading="lazy"
              onError={(e) => { 
                e.target.src = '/default-avatar.png'; 
                e.target.style.objectFit = 'cover';
              }}
            />


        </div>
      )}
      <div className="post-content">
        <div className="post-header-row">
          <h3 className="post-title">
            {post.title}
          </h3>
          {user && (post.author?._id === user._id || user.role === 'admin') && (
            <>
              <button 
                className="post-menu-dots"
                style={{
                  position: 'sticky',
                  top: '10px',
                  right: '10px',
                  zIndex: 10,
                  background: isDark ? '#4a3a58' : 'white',
                  borderRadius: '50%',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                title="Post options"
              >
                ⋮
              </button>
              {showMenu && (
                <div className="post-menu-dropdown" style={{
                  position: 'absolute',
                  top: '50px',
                  right: '0',
                  background: isDark ? '#4a3a58' : 'white',
                  borderRadius: '8px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  minWidth: '140px',
                  zIndex: 20,
                  color: isDark ? 'white' : 'black'
                }}>
                  <button 
className="menu-item edit-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${post._id}`);
                    }}
                  >
                    ✏️ Edit
                  
                  </button>
                  <button 
className="menu-item delete-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(true);
                    }}
                  >
                    🗑️ Delete
                  
                  </button>
                  {post.editedBy && (
                    <button 
                      className="menu-item history-item"
                      style={{width: '100%', padding: '12px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer'}}
                      onClick={(e) => {
                        e.stopPropagation();
                        const history = `Original by ${post.author?.name} (${new Date(post.createdAt).toLocaleDateString()})\\nEdited by ${post.editedBy.name} (${new Date(post.editedAt).toLocaleDateString()})`;
                        alert('Post History:\\n\\n' + history);
                      }}
                    >
                      📜 View History
                    </button>
                  )}
                </div>
              )}
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
                        onClick={async (e) => {
                          e.stopPropagation();
                          setDeleteConfirm(false);
                          try {
                            await API.delete(`/posts/${post._id}`);
                            if (refreshPosts) refreshPosts();
                            alert('Post deleted successfully');
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
            </>
          )}
        </div>
        <p className="post-excerpt">
          {post.body.substring(0, 120)}...
        </p>
        <div className="post-meta">
          <small>By {post.author?.name || 'Folio Admin'} · {new Date(post.createdAt).toLocaleDateString()}</small>
          {post.editedBy && <small className="edited-meta-small">✏️ Edited by {post.editedBy.name}</small>}
        </div>
        <div className={`post-actions ${isDark ? 'dark' : ''}`}>
          <button 
            className={`action-btn like-btn ${liked ? 'liked' : ''} ${loading ? 'loading' : ''}`} 
            onClick={handleLike}
            title="Like"
            disabled={loading}
          >

          <span className="heart-icon">❤︎</span>
            <span className="count">{likeCount}</span>
          </button>
          <button 
            className="action-btn comment-btn" 
            onClick={handleComment}
            title="Comment"
          >

            <span className="emoji">💬</span>
            <span className="count">{comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

PostCard.defaultProps = {
  post: {}
};

export default PostCard;
