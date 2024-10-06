// App.js
import React from 'react';
import Weather from './components/Weather';

function App() {
  const appStyles = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fa', // Soft background color for contrast
    padding: '20px', // Add some padding for mobile responsiveness
  };
  
  return (
    <div className="App" style={appStyles}>
      <Weather />
    </div>
  );
}

export default App;
