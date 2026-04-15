import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../pages/auth.css';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  /* eslint-disable-next-line no-unused-vars */
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    fd.append('status', 'published');
    if (image) fd.append('image', image);
    try {
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to publish post'); 
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <div className='auth-header'>
          <h2>Write a New Post</h2>
        </div>
        {error && <p className='error-msg'>{error}</p>}
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
            <label>Cover Image</label>
            <div className='file-input-wrapper' onClick={() => document.querySelector('#image-upload').click()}>
              <input id='image-upload' type='file' accept='image/*' onChange={e =>
                setImage(e.target.files[0])} style={{display: 'none'}} />
              <p>🖼️ Click to upload cover image (optional)</p>
              {image && <p>{image.name}</p>}
            </div>
          </div>
          <button type='submit' className='btn-primary'>Publish Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
