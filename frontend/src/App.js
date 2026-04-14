import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/Homepage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GamePage from './pages/GamePage';

import './pages/styles.css';
import './App.css';	

function App() {
  return (
    <DarkModeProvider>
      <Navbar />
      <Routes>
        {/* Public routes — anyone can visit */}
        <Route path='/' element={<SplashPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/posts/:id' element={<PostPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        {/* Protected routes — must be logged in */}
        <Route path='/profile'
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/create-post'
          element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path='/edit/:id'
          element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        {/* Admin only — redirects members/guests to home */}
        <Route path='/admin'
          element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} />
      </Routes>
    </DarkModeProvider>
  );
}

export default App;

