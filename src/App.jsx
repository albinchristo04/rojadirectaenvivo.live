import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import Article from './pages/Article';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { autoSubmitCurrentPage } from './services/indexnow';

// IndexNow auto-submit wrapper
const IndexNowWrapper = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Submit to IndexNow on every route change (production only)
    autoSubmitCurrentPage();
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <Router>
      <IndexNowWrapper>
        <div className="min-h-screen bg-background text-white font-sans flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/event/:id" element={<Player />} />
              <Route path="/articulo/:slug" element={<Article />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </IndexNowWrapper>
    </Router>
  );
}

export default App;
