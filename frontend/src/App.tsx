import './App.css';
import { CuisineMenu } from './components/CuisineMenu';
import { MenuManager } from './components/MenuManager';
import { CreateMenu } from './components/CreateMenu';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Recipe } from '@/services/apiHandler';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<'cuisines' | 'editor'>('cuisines');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuSelect = (recipes: Recipe[]) => {
    // Handle menu selection
    console.log('Selected recipes:', recipes);
  };

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
            <li><Link to="/create-menu">Create Menu</Link></li>
          </ul>
        </nav>

        <div className={`sideMenu ${isMenuOpen ? 'open' : ''}`}>
          <button onClick={() => setSelectedView('cuisines')}>Cuisines</button>
          <button onClick={() => setSelectedView('editor')}>Editor</button>
          {selectedView === 'cuisines' && (
            <CuisineMenu onMenuSelect={handleMenuSelect} />
          )}
          {selectedView === 'editor' && (
            <MenuManager />
          )}
        </div>

        <button className="toggleButton" onClick={toggleMenu}>
          {isMenuOpen ? 'Close' : 'Open'} Menu
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/create-menu" element={<CreateMenu />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Welcome to the Recipe App</h2>;
}

function Recipes() {
  return <h2>Recipes Page</h2>;
}

export default App;
