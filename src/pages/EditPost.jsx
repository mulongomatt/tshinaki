import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${id}`);
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPost = { title, content };

    try {
      const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        localStorage.removeItem('posts');
        alert('Post updated successfully!');
        navigate('/');
      } else {
        alert('Failed to update post.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post.');
    }
  };

  return (
    <div className="container">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn">Update</button>
      </form>
    </div>
  );
};

export default EditPost;