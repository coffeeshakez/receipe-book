import { CuisineMenu } from './components/CuisineMenu';
import { Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          {/* ... existing navigation ... */}
          <Link to="/cuisine-menu">Cuisine Menu</Link>
        </nav>

        <Routes>
          {/* ... existing routes ... */}
          <Route path="/cuisine-menu" element={<CuisineMenu />} />
        </Routes>
      </div>
    </Router>
  );
}
