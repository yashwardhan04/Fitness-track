import React from 'react';
import tutorials from '../utils/tutorialsData';
import { lightTheme } from '../utils/Themes';

// Group tutorials by muscleGroup
const groupByMuscle = tutorials.reduce((acc, tutorial) => {
  const group = tutorial.muscleGroup || 'Other';
  if (!acc[group]) acc[group] = [];
  acc[group].push(tutorial);
  return acc;
}, {});

const orderedGroups = [
  { key: 'Recommended', label: 'Recommended' },
  { key: 'Chest', label: 'Chest Exercises' },
  { key: 'Back', label: 'Back Exercises' },
  { key: 'Arms', label: 'Arms Exercises' },
  { key: 'Shoulders', label: 'Shoulder Exercises' },
  { key: 'Abs', label: 'Abs Exercises' },
  { key: 'Legs', label: 'Legs Exercises' },
  { key: 'Neck', label: 'Neck Exercises' },
];

// Recommended: first tutorial, or all with muscleGroup === 'Recommended'
const recommendedTutorials = tutorials.filter(t => t.muscleGroup === 'Recommended');
const fallbackRecommended = tutorials.length > 0 ? [tutorials[0]] : [];

const containerStyle = {
  maxHeight: '80vh',
  overflowY: 'auto',
  padding: '2rem',
  background: lightTheme.bgLight,
  borderRadius: '12px',
  boxShadow: `0 2px 8px ${lightTheme.shadow}`,
  scrollBehavior: 'smooth',
};

const sectionTitleStyle = {
  margin: '2rem 0 1rem 0',
  fontSize: '1.5rem',
  color: lightTheme.primary,
  fontWeight: 700,
};

const rowContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1.5rem',
  overflowX: 'auto',
  paddingBottom: '1rem',
  marginBottom: '2rem',
  scrollbarWidth: 'thin',
  scrollbarColor: `${lightTheme.primary} ${lightTheme.bgLight}`,
};

const cardStyle = {
  background: lightTheme.card,
  borderRadius: '16px',
  boxShadow: `0 2px 8px ${lightTheme.shadow}`,
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '320px',
  maxWidth: '340px',
  margin: '0',
  flex: '0 0 auto',
};

const iframeStyle = {
  borderRadius: '12px',
  marginBottom: '1rem',
  width: '280px',
  height: '158px',
  background: lightTheme.bg,
  border: 'none',
  boxShadow: `0 1px 4px ${lightTheme.shadow}`,
  display: 'block',
};

const titleStyle = {
  margin: '0.5rem 0',
  color: lightTheme.text_primary,
};

const descStyle = {
  color: lightTheme.text_secondary,
  textAlign: 'center',
};

const Tutorials = () => (
  <div style={containerStyle}>
    <h1 style={{...sectionTitleStyle, marginTop: 0}}>Workout Tutorials</h1>
    {orderedGroups.map(({ key, label }, idx) => {
      let group = [];
      if (key === 'Recommended') {
        group = recommendedTutorials.length > 0 ? recommendedTutorials : fallbackRecommended;
      } else {
        group = groupByMuscle[key] || [];
      }
      if (!group.length) return null;
      return (
        <div key={key}>
          <div style={sectionTitleStyle}>{label}</div>
          <div style={rowContainerStyle}>
            {group.map(tutorial => (
              <div key={tutorial.id} style={cardStyle}>
                <iframe
                  style={iframeStyle}
                  src={tutorial.videoUrl}
                  title={tutorial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <h2 style={titleStyle}>{tutorial.title}</h2>
                <p style={descStyle}>{tutorial.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default Tutorials;
