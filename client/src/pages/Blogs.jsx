import React, { useEffect, useState } from 'react';
import { lightTheme } from '../utils/Themes';
import { getBlogs, createBlog, updateBlog } from '../api/blogs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';  // Updated import
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
// Box unused


const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '2rem',
  maxWidth: '1600px',
  margin: '2rem auto',
  background: lightTheme.bgLight,
  borderRadius: '12px',
  boxShadow: `0 2px 8px ${lightTheme.shadow}`,
  padding: '2rem',
  overflowY: 'auto',

  // Mobile styles
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    padding: '1rem',
  },
};

const leftStyle = {
  flex: '1 1 auto',
  padding: '2rem 1.5rem',
  borderRight: `1px solid ${lightTheme.primary}22`,
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
};
const rightStyle = {
  flex: '0 0 360px',
  maxWidth: '360px',
  padding: '1.5rem 1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  backgroundColor: lightTheme.bgLight,
};


// Add new styles
const recentEntriesStyle = {
  background: lightTheme.card,
  borderRadius: '10px',
  padding: '1.0rem',
  width: '100%',
  // maxWidth: '450px', // Increased max width
  boxShadow: `0 1px 4px ${lightTheme.shadow}`,
};

const blogListStyle = {
  listStyle: 'none',
  margin: 0,
  maxHeight: 400,
  overflowY: 'auto',
  background: lightTheme.card,
  borderRadius: '10px',
  padding: '1rem',
};
const blogItemStyle = isActive => ({
  background: isActive ? `${lightTheme.primary}22` : 'transparent',
  color: lightTheme.text_primary,
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  cursor: 'pointer',
  boxShadow: isActive ? `0 2px 8px ${lightTheme.shadow}` : 'none',
  transition: 'all 0.2s',
  border: `1px solid ${isActive ? lightTheme.primary : lightTheme.primary}22`,
  '&:hover': {
    background: `${lightTheme.primary}11`,
  },
});
const sectionTitleStyle = {
  fontSize: '1.3rem',
  color: lightTheme.primary,
  fontWeight: 700,
  marginBottom: '1rem',
};
const blogContentStyle = {
  background: lightTheme.card,
  borderRadius: '10px',
  boxShadow: `0 1px 4px ${lightTheme.shadow}`,
  padding: '1rem',
  color: lightTheme.text_primary,
  width: '100%',
  marginTop: '1.5rem',
};
const formStyle = {
  background: lightTheme.card,
  borderRadius: '10px',
  boxShadow: `0 1px 4px ${lightTheme.shadow}`,
  padding: '1.5rem',
  marginBottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};
const inputStyle = {
  padding: '0.8rem',
  borderRadius: '8px',
  border: `1px solid ${lightTheme.primary}44`,
  fontSize: '1rem',
  background: `${lightTheme.bgLight}99`,
  color: lightTheme.text_primary,
  transition: 'all 0.2s',
  '&:focus': {
    outline: 'none',
    borderColor: lightTheme.primary,
    boxShadow: `0 0 0 2px ${lightTheme.primary}33`,
  },
};
const buttonStyle = {
  background: lightTheme.primary,
  color: lightTheme.menu_primary_text,
  border: 'none',
  borderRadius: '6px',
  padding: '0.7rem 1.0rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const calendarContainerStyle = {
  background: lightTheme.card,
  borderRadius: '10px',
  padding: '0.75rem',
  width: '100%',
  boxShadow: `0 1px 4px ${lightTheme.shadow}`,
  minHeight: '320px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};


const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch blogs for the selected date
  const fetchBlogs = async (date) => {
    setLoading(true);
    try {
      const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : undefined;
      console.log('Fetching blogs for date:', formattedDate);
      const res = await getBlogs(formattedDate);
      console.log('Fetched blogs:', res);
      setBlogs(res);
      
      if (res.length > 0) {
        // If there's no blog currently selected, or if the selected blog is not in the new list,
        // or if we are not editing, then set the first blog as selected.
        if (!selectedBlog || !res.some(blog => blog._id === selectedBlog._id) || !isEditing) {
          setSelectedBlog(res[0]);
        }
      } else {
        setSelectedBlog(null);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
      setSelectedBlog(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Date changed:', selectedDate.format('YYYY-MM-DD'));
    fetchBlogs(selectedDate);
  }, [selectedDate]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new blog
  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fittrack-app-token');
    
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const blog = await createBlog({
        title: form.title,
        content: form.content,
        date: selectedDate.format('YYYY-MM-DD'),
        token: token
      });
      
      console.log('Blog created:', blog);
      setForm({ title: '', content: '' });
      fetchBlogs(selectedDate);
    } catch (err) {
      console.error('Error creating blog:', err);
      alert(err.message || 'Failed to create blog');
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setIsEditing(true);
    setEditId(blog._id);
    setForm({ title: blog.title, content: blog.content });
    setSelectedBlog(blog); // Ensure the edited blog is also the selected one
  };

  // Update blog
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fittrack-app-token');
    try {
      await updateBlog({ id: editId, ...form, date: selectedDate.format('YYYY-MM-DD'), token });
      setForm({ title: '', content: '' });
      setIsEditing(false);
      setEditId(null);
      fetchBlogs(selectedDate);
    } catch (err) {
      alert('Failed to update blog');
    }
  };

  // Select blog from list
  const handleSelectBlog = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(false);
    setEditId(null);
    setForm({ title: '', content: '' });
  };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <div style={sectionTitleStyle}>
          <span role="img" aria-label="pencil">✏️</span> Blogs by Day
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: lightTheme.text_secondary }}>
            No blogs found for this date. Start writing! ✨
          </div>
        ) : (
          <ul style={blogListStyle}>
            {blogs.map((blog) => (
              <li
                key={blog._id}
                style={blogItemStyle(selectedBlog && selectedBlog._id === blog._id)}
                onClick={() => handleSelectBlog(blog)}
              >
                <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>
                  {blog.title}
                </strong>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: lightTheme.text_secondary,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{dayjs(blog.date).format('MMM D, YYYY')}</span>
                  <button
                    style={{ 
                      ...buttonStyle, 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.8rem',
                      background: 'transparent',
                      border: `1px solid ${lightTheme.primary}`,
                      color: lightTheme.primary,
                    }}
                    onClick={(e) => { e.stopPropagation(); handleEdit(blog); }}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <form style={formStyle} onSubmit={isEditing ? handleUpdate : handleAdd}>
          <div style={sectionTitleStyle}>
            {isEditing ? '✏️ Edit Blog' : '✨ Share Your Journey'}
          </div>
          <input
            style={inputStyle}
            name="title"
            placeholder="What's on your mind today?"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            style={{ ...inputStyle, minHeight: 120 }}
            name="content"
            placeholder="Write about your fitness journey, goals, or achievements..."
            value={form.content}
            onChange={handleChange}
            required
          />
          <button style={{...buttonStyle, marginTop: '1rem'}} type="submit" disabled={loading}>
            {isEditing ? '✨ Update Blog' : '✨ Share Blog'}
          </button>
          {isEditing && (
            <button
              style={{ ...buttonStyle, background: lightTheme.red, marginTop: '0.5rem' }}
              type="button"
              onClick={() => { setIsEditing(false); setEditId(null); setForm({ title: '', content: '' }); }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      
      <div style={rightStyle}>
        <div style={sectionTitleStyle}>
          <span role="img" aria-label="calendar">📅</span> Select Date
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={calendarContainerStyle}>
            <DateCalendar
              sx={{ width: '100%', maxWidth: 340, minWidth: 280 }}
              value={selectedDate}
              onChange={date => setSelectedDate(date)}
            />
          </div>
        </LocalizationProvider>

        <div style={recentEntriesStyle}>
          <div style={sectionTitleStyle}>
            <span role="img" aria-label="recent">🎯</span> Recent Entries
          </div>
          {blogs.length === 0 ? (
            <div style={{
              color: lightTheme.text_secondary,
              textAlign: 'center',
              padding: '1rem'
            }}>
              No entries yet. Start writing! ✨
            </div>
          ) : (
            blogs.slice(0, 5).map(blog => (
              <div
                key={blog._id}
                style={{
                  padding: '0.8rem',
                  borderBottom: `1px solid ${lightTheme.primary}22`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: `${lightTheme.primary}11`,
                  },
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
                onClick={() => handleSelectBlog(blog)}
              >
                <div style={{ fontWeight: 500 }}>{blog.title}</div>
                <div style={{
                  fontSize: '0.8rem',
                  color: lightTheme.text_secondary,
                  marginTop: '0.3rem'
                }}>
                  {dayjs(blog.date).format('MMM D, YYYY')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;