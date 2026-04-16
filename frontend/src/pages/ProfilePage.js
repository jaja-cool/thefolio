import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { getImageUrl } from '../lib/imageUrl';
import '../pages/auth.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setBio(user?.bio || '');
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user');
      }
    };
    if (!user) {
      fetchUser();
    }
  }, [setUser, user]);


  const handleProfile = async (e) => {
    e.preventDefault(); setMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
    } catch (err) { 
      console.error('Profile upload error:', err.response || err);
      setMsg(err.response?.data?.message || 'Upload failed. Check console for details.');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault(); setMsg('');
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setMsg('Password changed successfully!');
      setCurPw(''); setNewPw('');
    } catch (err) { setMsg(err.response?.data?.message || 'Error'); }
  };

  const picSrc = getImageUrl(user?.profilePic);

return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <div className='auth-header'>
          <h2>My Profile</h2>
        </div>
        <img src={picSrc} alt='Profile' className='profile-pic-preview' />
        {msg && <p className={`msg ${msg.includes('success') ? 'success-msg' : 'error-msg'}`}>{msg}</p>}
        <form onSubmit={handleProfile} className='styled-form'>
          <h3>Edit Profile</h3>
          <div className='form-group'>
            <label>Display Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder='Enter your display name' />
          </div>
          <div className='form-group'>
            <label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder='Tell us about yourself...' rows={4} />
          </div>
          <div className='form-group'>
            <label>Profile Picture</label>
            <div className='file-input-wrapper' onClick={() => document.querySelector('#pic-upload').click()}>
              <input id='pic-upload' type='file' accept='image/*' onChange={e =>
                setPic(e.target.files[0])} style={{display: 'none'}} />
              <p>📁 Click to upload new photo</p>
              {pic && <p>{pic.name}</p>}
            </div>
          </div>
          <button type='submit' className='btn-primary'>Save Profile</button>
        </form>
        <form onSubmit={handlePassword} className='styled-form'>
          <h3>Change Password</h3>
          <div className='form-group'>
            <label>Current Password</label>
            <input type='password' placeholder='Current password'
              value={curPw} onChange={e => setCurPw(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>New Password (min 8 chars)</label>
            <input type='password' placeholder='New password (8+ chars, complex)'
              value={newPw} onChange={e => setNewPw(e.target.value)} required minLength={8} />
          </div>
          <button type='submit' className='btn-primary'>Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

