// App.js
import React from 'react';
import Weather from './components/Weather';
import backgroundImage from './images/bg.jpg';

function App() {
  const appStyles = {
    backgroundImage: `url(${backgroundImage})`, // Set the background image
    backgroundSize: 'cover', // Cover the entire container
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  return (
    <div className="App" style={appStyles}>
      <Weather />
    </div>
  );
}

export default App;
