import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cachedPosts = localStorage.getItem('posts');
        if (cachedPosts) {
          setPosts(JSON.parse(cachedPosts));
        } else {
          const response = await fetch('http://localhost:3001/api/posts');
          const data = await response.json();
          setPosts(data);
          localStorage.setItem('posts', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== id));
        localStorage.removeItem('posts');
      } else {
        alert('Failed to delete post.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post.');
    }
  };

  return (
    <div className="container">
      <h1>Blog Posts</h1>
      <Link to="/create-post" className="btn" style={{ marginBottom: '2rem', display: 'inline-block' }}>
        Create Post
      </Link>
      <div className="post-list">
        {posts.map((post) => (
          <div key={post._id} className="post-item">
            <Link to={`/post/${post._id}`}>
              <h2>{post.title}</h2>
            </Link>
            {post.picture && <img src={`http://localhost:3001${post.picture}`} alt={post.title} style={{ maxWidth: '200px', borderRadius: '4px', marginBottom: '1rem' }} />}
            <p className="post-content">{post.content.substring(0, 200)}...</p>
            <div style={{ marginTop: '1rem' }}>
                <Link to={`/post/${post._id}`} className="btn" style={{ marginRight: '10px' }}>View</Link>
                <Link to={`/edit-post/${post._id}`} className="btn" style={{ marginRight: '10px' }}>Edit</Link>
                <button onClick={() => handleDelete(post._id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;