import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [picture, setPicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('picture', picture);

    try {
      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        localStorage.removeItem('posts');
        alert('Post created successfully!');
        navigate('/');
      } else {
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  return (
    <div className="container">
      <h1>Create Post</h1>
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
        <div className="form-group">
          <label htmlFor="picture">Picture</label>
          <input
            type="file"
            id="picture"
            onChange={(e) => setPicture(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn">Create</button>
      </form>
    </div>
  );
};

export default CreatePost;