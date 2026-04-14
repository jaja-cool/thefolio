import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './auth.css';
import './edit-post-page.css';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then(res => {
        const post = res.data;
        if (user && !(post.author._id === user._id || user.role === 'admin')) {
          navigate('/');
          return;
        }
        setTitle(post.title || '');
        setBody(post.body || '');
        // Set current image for preview
        if (post.image) {
          setCurrentImage(`http://localhost:5000/uploads/${post.image}`);
        }
      })
      .catch(err => {
        console.error('Failed to load post:', err);
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);
    setSubmitting(true);
    try {
      await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-post-loading" style={{textAlign: 'center', padding: '4rem'}}>
        Loading post...
      </div>
    );
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <div className='auth-header'>
          <h2>✏️ Edit Post</h2>
          <p>Update your post content</p>
        </div>
        {error && <p className='error-msg'>{error}</p>}
{currentImage && (
  <div className="current-image-preview">
    <p>Current image:</p>
    <img src={currentImage} alt="Current" className="profile-pic-preview" />
    <button 
      type="button" 
      onClick={async () => {
        if (window.confirm('Delete this cover image?')) {
          try {
            const fd = new FormData();
            fd.append('image', '');
            await API.put(`/posts/${id}`, fd);
            setCurrentImage('');
            window.alert('Cover image removed');
          } catch (err) {
            window.alert('Failed to delete image');
          }
        }
      }}
      className="btn-danger"
      style={{marginTop: '10px'}}
    >
      Delete Cover Image
    </button>
    <small style={{display: 'block', textAlign: 'center'}}>New image will replace this</small>
  </div>
)}

        <form onSubmit={handleSubmit} className='styled-form'>
          <div className='form-group'>
            <label>Post Title</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder='Enter title (optional)...' 
            />
          </div>
          <div className='form-group'>
            <label>Post Content</label>
            <textarea 
              value={body} 
              onChange={e => setBody(e.target.value)}
              placeholder='Write post content (optional)...'
              rows={15} 
            />
          </div>
          <div className='form-group'>
            <label>Cover Image (optional)</label>
            <div className='file-input-wrapper'>
              <input 
                id='image-upload' 
                type='file' 
                accept='image/*' 
                onChange={e => setImage(e.target.files[0])} 
                style={{display: 'none'}} 
              />
              <p>🖼️ Click to upload new cover image</p>
              {image && <p>{image.name}</p>}
            </div>
          </div>
          <div className="form-actions">
            <button 
              type='button' 
              className='btn-primary'
              onClick={() => navigate(`/posts/${id}`)}
              style={{background: 'linear-gradient(135deg, #6b7280, #4b5563)'}}
            >
              Cancel
            </button>
            <button 
              type='submit' 
              className='btn-primary' 
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
