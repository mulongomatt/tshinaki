import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        localStorage.removeItem('posts');
        navigate('/');
      } else {
        alert('Failed to delete post.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post.');
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{post.title}</h1>
      {post.picture && <img src={`http://localhost:3001${post.picture}`} alt={post.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem' }} />}
      <div className="post-content">{post.content}</div>
      <div style={{ marginTop: '2rem' }}>
        <Link to={`/edit-post/${post._id}`} className="btn" style={{ marginRight: '10px' }}>
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default Post;