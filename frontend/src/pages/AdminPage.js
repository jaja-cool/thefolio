import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useDarkMode } from '../context/DarkModeContext';
import '../pages/auth.css';

const AdminPage = () => {
  const { isDark } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('users');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const refetchPosts = async () => {
    try {
      const r = await API.get('/admin/posts');
      setPosts(r.data);
    } catch (err) {
      console.error('Failed to refetch posts', err);
    }
  };

  const refetchUsers = async () => {
    try {
      const r = await API.get('/admin/users');
      setUsers(r.data);
    } catch (err) {
      console.error('Failed to refetch users', err);
    }
  };

  const refetchMessages = async () => {
    try {
      const r = await API.get('/admin/messages');
      setMessages(r.data);
    } catch (err) {
      console.error('Failed to refetch messages', err);
    }
  };

  useEffect(() => {
    refetchUsers();
    refetchPosts();
    refetchMessages();
  }, []);

  const toggleStatus = async (id) => {
    try {
      await API.put(`/admin/users/${id}/status`);
      refetchUsers();
    } catch (err) {
      alert(`Failed to toggle user status: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const removePost = async (id) => {
    try {
      await API.put(`/admin/posts/${id}/remove`);
      refetchPosts();
    } catch (err) {
      alert(`Failed to remove post: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const restorePost = async (id) => {
    try {
      await API.put(`/admin/posts/${id}/restore`);
      refetchPosts();
    } catch (err) {
      alert(`Failed to restore post: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const markRead = async (id) => {
    try {
      await API.put(`/admin/messages/${id}/read`);
      setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, read: true } : msg));
      setSelectedMessage(prev => prev && prev._id === id ? { ...prev, read: true } : prev);
    } catch (err) {
      alert(`Failed to mark message as read: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const markUnread = async (id) => {
    try {
      await API.put(`/admin/messages/${id}/unread`);
      setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, read: false } : msg));
      setSelectedMessage(prev => prev && prev._id === id ? { ...prev, read: false } : prev);
    } catch (err) {
      alert(`Failed to mark message as unread: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    }
  };

  const viewMessage = async (m) => {
    setSelectedMessage(m);
    if (!m.read) {
      await markRead(m._id);
    }
  };

  const closeMessage = () => setSelectedMessage(null);

  return (
    <>
      <div className='auth-wrapper'>
        <div className='auth-card' style={{ maxWidth: '900px', width: '100%' }}>
          <div className='auth-header'>
            <h2>Admin Dashboard</h2>
          </div>
          <div className='admin-tabs'>
          <button 
            onClick={() => setTab('users')} 
            className={tab === 'users' ? 'active' : ''}
          >
            Members ({users.length})
          </button>
          <button 
            onClick={() => setTab('posts')} 
            className={tab === 'posts' ? 'active' : ''}
          >
            All Posts ({posts.length})
          </button>
          <button 
            onClick={() => setTab('messages')} 
            className={tab === 'messages' ? 'active' : ''}
          >
            Messages ({messages.length})
          </button>
        </div>

        {tab === 'users' && (
          <div style={{padding: '20px'}}>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                    <td>
                      <button 
                        onClick={() => toggleStatus(u._id)}
                        className={u.status === 'active' ? 'btn-danger' : 'btn-success'}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'posts' && (
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.author?.name || 'Unknown'}</td>
                  <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                  <td>
                    {p.status === 'published' && (
                      <button className='btn-danger' onClick={() => removePost(p._id)}>
                        Remove
                      </button>
                    )}
                    {p.status === 'removed' && (
                      <button className='btn-success' onClick={() => restorePost(p._id)}>
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'messages' && (
          <div style={{padding: '20px'}}>
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m._id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td><span className={`status-badge ${m.read ? 'read' : 'unread'}`}>{m.read ? 'Read' : 'Unread'}</span></td>
                    <td>
                      <button
                        className='btn-success'
                        onClick={() => m.read ? markUnread(m._id) : markRead(m._id)}
                        style={{
                          borderRadius: '8px',
                          padding: '10px 20px',
                          minWidth: '120px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit'
                        }}
                      >
                        {m.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        className='btn-info'
                        onClick={() => viewMessage(m)}
                        style={{
                          background: '#8e44ad',
                          color: 'white',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          minWidth: '120px',
                          border: 'none',
                          cursor: 'pointer',
                          marginLeft: '12px',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit'
                        }}
                      >
                        View Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {selectedMessage && (
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: isDark ? '#1f182a' : 'white',
        color: isDark ? 'white' : 'black',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: 1000,
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3 style={{marginTop: 0}}>Message Details</h3>
        <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
        <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
        <div style={{
          whiteSpace: 'pre-wrap',
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '5px',
          background: '#f9f9f9',
          marginTop: '15px',
          minHeight: '150px'
        }}>
          {selectedMessage.message}
        </div>
        <button 
          onClick={closeMessage} 
          className='btn-primary'
          style={{marginTop: '15px'}}
        >
          Close
        </button>
      </div>
    )}
    </>
  );
};

export default AdminPage;

