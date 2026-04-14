


import { useState, useEffect, useCallback } from 'react';

import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useDarkMode } from '../context/DarkModeContext';
import mePng from './pic/me.png';
import fbJpg from './pic/fb.jpg';
import igJpg from './pic/ig.jpg';
import tiktokJpg from './pic/tiktok.jpg';

const HomePage = () => {
  const [posts, setPosts] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const { isDark } = useDarkMode();


  const fetchPosts = useCallback(() => {

    setLoading(true);
    API.get('/posts')
      .then(res => {
        setPosts(Array.isArray(res.data) ? res.data : res.data.posts || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);



  const refreshPosts = useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);


  if (loading) return <p>Loading...</p>;

  return (
    <>
      {/* Hero Section */}
      <main className={'main ' + (isDark ? 'dark' : '')}>
        <div className="content">
          <h2>It's All About<br /><span>Jaslyn Kate G.</span></h2>
          <p className="tagline">Computer Science student with a growing<br />passion for software development</p>
        </div>

        <div className="profile">
          <img src={mePng} alt="Jaslyn Kate G." />

          <div className="social-links">
            <a href="https://facebook.com/katee.kateee9" target="_blank" rel="noopener noreferrer">
              <img src={fbJpg} alt="Facebook" />
            </a>
            <a href="https://instagram.com/cup_katee_" target="_blank" rel="noopener noreferrer">
              <img src={igJpg} alt="Instagram" />
            </a>
            <a href="https://tiktok.com/@candyk8_" target="_blank" rel="noopener noreferrer">
              <img src={tiktokJpg} alt="TikTok" />
            </a>

          </div>
        </div>
      </main>

      {/* Welcome */}
      <section className={'section hero-section ' + (isDark ? 'dark' : '')}>
        <h2>Welcome to My Portfolio</h2>
        <p>
          This portfolio showcases my skills, interests, and projects as I grow in the
          field of technology and digital creativity.
        </p>
      </section>

      {/* Key Highlights */}
      <section className={'section alt1 ' + (isDark ? 'dark' : '')}>
        <h2>Key Highlights</h2>
        <ul className="highlights">
          <li>Beginner-friendly web development projects</li>
          <li>Hands-on learning in HTML and basic design</li>
          <li>Creative and functional layouts</li>
          <li>Continuous improvement and skill growth</li>
        </ul>
      </section>

      {/* Explore More */}
      <section className={'section ' + (isDark ? 'dark' : '')}>
        <h2>Explore More</h2>
        <div className="cards">
          <div className="card">
            <h3>About Me</h3>
            <p>Learn more about my background, interests, and goals in technology.</p>
          </div>
          <div className="card">
            <h3>Projects &amp; Activities</h3>
            <p>Discover works that show my learning progress and creativity.</p>
          </div>
          <div className="card">
            <h3>Get in Touch</h3>
            <p>Visit the contact page to reach out or collaborate with me.</p>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <div className={'home-page ' + (isDark ? 'dark' : '')}>
        <h2>Latest Posts</h2>
        {posts.length === 0 && <p>No posts yet. Be the first to write one!</p>}
      <div className='posts-grid' id="posts-section">
{posts.map((post, index) => (
            <PostCard 
              key={post._id} 
              post={post} 
              refreshPosts={refreshPosts} 
              isLatest={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className={'footer ' + (isDark ? 'dark' : '')}>
        <p>Contact: jkgatchalian23109703@student.dmmmsu.edu.ph | 09668113017</p>
        <p>&amp;copy; 2026 Jaslyn Kate Portfolio | All Rights Reserved</p>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&amp;display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Arial');
        
        /* ================= GLOBAL ================= */
        body {
          margin: 0;
          background-color: #471b53;
          color: white;
          font-family: Arial, sans-serif;
        }
        body.dark {
          background-color: #2a0f38;
        }

        /* ================= HEADER ================= */
        header {
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .logo {
          font-size: 2.5rem;
          font-weight: 700;
        }
        nav a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
          font-size: 18px;
          font-weight: 500;
          position: relative;
          transition: color 0.3s ease;
        }
        nav a::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0;
          height: 2px;
          background-color: #FFD6FF;
          transition: width 0.3s ease;
        }
        nav a:hover {
          color: #FFD6FF;
        }
        nav a:hover::after {
          width: 100%;
        }
        nav a.active{
          padding: 12px 24px;
          background-color: #e2c8f0;
          color: #784B84;
          border-radius: 20px;
          font-weight: bold;
        }
        header.dark nav a {
          color: #e0c0ff;
        }
        header.dark nav a.active {
          background-color: #5a3a6a;
          color: #ffd6ff;
        }

        /* ================= MAIN ================= */
        main {
          background-color: #e5a8e2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 120px 130px;
          gap: 30px;
        }
        main.dark {
          background-color: #b57aa5;
        }
        .content h2 {
          margin-top: 5px;
          font-size: 70px;
          color: #66466b;
        }
        .content span {
          font-family: 'Dancing Script';
          font-style: italic;
          font-weight: bold;
          color: #330f41;
        }
        .tagline {
          margin-top: 15px;
          font-size: 20px;
          color: #555;
        }

        /* ================= PROFILE ================= */
        .profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 10%;
        }
        /* PROFILE PICTURE*/
        .profile img {
          margin-top: -50%;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          border: 6px solid #ece3e3;
          object-fit: cover;
        }
        .profile.dark img {
          border-color: #d4c4d4;
        }

        /* SOCIAL LINKS*/
        .social-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          gap: 50px;
          margin-top: 150px;
        }
        /* BILOG */
        .social-links a {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .social-links a:hover {
          background: #9b59b6;
          transform: scale(1.15);
        }
        /* LOGO IMAGE */
        .social-links a img {
          margin-bottom: -49%;
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
        }

        /*SECTIONS*/
        .section {
          padding: 60px 200px;
          text-align: center;
          background-color: #f7f4f8;
        }
        .section.alt1 {
          background-color: #ffffff;
          padding: 60px 200px;
        }
        .section h2 {
          color: #9b59b6;
          font-size: 36px;
          margin-bottom: 20px;
        }
        .section p {
          font-size: 18px;
          color: #444;
          max-width: 800px;
          margin: auto;
          line-height: 1.6;
        }
        .section.dark {
          background-color: #3a2f45;
        }
        .section.dark h2 {
          color: #d4a0e5;
        }
        .section.dark p {
          color: #ddd;
        }
        .hero-section.dark {
          background-color: #4a3a58;
        }

        /*HIGHLIGHTS */
        .highlights {
          list-style: none;
          margin-top: 30px;
        }
        .highlights li {
          font-size: 18px;
          margin: 10px 0;
          color: #333;
        }

        /*CARDS*/
        .cards {
          display: flex;
          gap: 30px;
          justify-content: center;
          margin-top: 40px;
        }
        .card {
          background-color: white;
          padding: 25px;
          width: 260px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .card h3 {
          color: #6a2c91;
          margin-bottom: 10px;
        }
        .card p {
          font-size: 16px;
          color: #555;
        }
        .card.dark, .highlights li.dark {
          background-color: #4a3a58;
          color: #e0d0ff;
        }
        .card.dark h3 {
          color: #b89cd4;
        }

        /* POSTS */
        .home-page {
          padding: 60px 200px;
          text-align: center;
          background-color: #f7f4f8;
        }
        .home-page h2 {
          color: #9b59b6;
          font-size: 42px;
          margin-bottom: 20px;
          text-align: center;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1400px;
          margin: 40px auto 0;
          padding: 0 20px;
          align-items: start;
          grid-auto-flow: dense;
        }
        .home-page.dark {
          background-color: #3a2f45;
        }
        .home-page.dark h2 {
          color: #d4a0e5;
          text-align: center;
        }

        /* POST CARDS */
        .posts-grid .post-card {
          background-color: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          overflow: hidden;
        }
.posts-grid .post-card:hover {
}
        .posts-grid .post-card.dark {
          background-color: #4a3a58;
          color: #e0d0ff;
        }
        .posts-grid .post-card .post-image-wrapper {
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }
.posts-grid .post-card .post-image-wrapper img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        .posts-grid .post-card .post-content h3 {
          margin: 0 0 12px 0;
          color: #6a2c91;
          font-size: 22px;
        }
        .posts-grid .post-card.dark .post-content h3 {
          color: #b89cd4;
        }
        .posts-grid .post-card .post-excerpt {
          color: #555;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .posts-grid .post-card.dark .post-excerpt {
          color: #ddd;
        }
        .posts-grid .post-card .post-meta {
          font-size: 14px;
          color: #888;
        }
        .posts-grid .post-card.dark .post-meta {
          color: #ccc;
        }

        /*FOOTER*/
        footer {
          text-align: center;
          background-color: #9b59b6;
          font-size: 0.9rem;
          padding: 20px;
          opacity: 0.9;
        }
        footer p {
          color: white;
          font-size: 14px;
          margin: 5px 0;
        }
        footer.dark {
          background-color: #7a3e9a;
        }

        @media (max-width: 1024px) {
          main {
            flex-direction: column-reverse;
            text-align: center;
            padding: 80px 40px;
            gap: 40px;
          }
          .social-links {
            position: static;
            transform: none;
            margin-top: 30px;
          }
          .section, .home-page {
            padding: 60px 40px;
          }
        }
        @media (max-width: 768px) {
          main {
            padding: 60px 20px;
          }
          .cards {
            flex-direction: column;
            align-items: center;
          }
          .section, .home-page {
            padding: 60px 20px;
          }
        }
      `}</style>
    </>
  );
};

export default HomePage;

