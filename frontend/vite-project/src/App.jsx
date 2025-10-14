import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Load bookmarks when app starts
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookmarks');
      const data = await response.json();
      setBookmarks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const addBookmark = async (e) => {
    e.preventDefault();
    
    if (!name || !url) {
      alert('Please fill both fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url })
      });

      const newBookmark = await response.json();
      setBookmarks([...bookmarks, newBookmark]);
      setName('');
      setUrl('');
    } catch (error) {
      alert('Error adding bookmark');
    }
  };

  const deleteBookmark = async (id) => {
    if (!window.confirm('Delete this bookmark?')) return;

    try {
      await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
        method: 'DELETE'
      });
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (error) {
      alert('Error deleting bookmark');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <div className="container">
        <h1>📚 My Bookmarks</h1>

        <form onSubmit={addBookmark} className="add-form">
          <input
            type="text"
            placeholder="Bookmark Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="url"
            placeholder="URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit">Add Bookmark</button>
        </form>

        <div className="bookmarks">
          {bookmarks.length === 0 ? (
            <p className="empty">No bookmarks yet. Add your first one!</p>
          ) : (
            bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bookmark-card">
                <div className="bookmark-info">
                  <a 
                    href={bookmark.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bookmark-name"
                  >
                    {bookmark.name}
                  </a>
                  <p className="bookmark-url">{bookmark.url}</p>
                  <p className="bookmark-time">{formatDate(bookmark.createdAt)}</p>
                </div>
                <button 
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;