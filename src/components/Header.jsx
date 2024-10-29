import React from 'react';

const Header = ({ onNavigate }) => {
  return (
    <header className="header">
      <h1 style={{cursor: 'pointer'}} onClick={() => onNavigate('home')}>Email Manager</h1>
      {/* <p>Create and manage your email campaigns with ease.</p> */}
      <nav>
        <button onClick={() => onNavigate('emailList')}>Email List</button>
        <button onClick={() => onNavigate('templateList')}>Template List</button>
        <button onClick={() => onNavigate('campaignCreation')}>Create Campaign</button>
      </nav>
    </header>
  );
};

export default Header;
