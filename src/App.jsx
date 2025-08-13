import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Hero from './components/hero';
import Explore from './components/Explore';
import Comingsoon from './components/comingsoon';
import ExamVault from './components/ExamVault';
import Login from './components/Login';
import bg from './assets/bg.png';

// Layout wrapper component to handle conditional styling
const Layout = ({ children, user, showLogin, handleLogout, handleLoginClick, onLogin, setShowLogin }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div
      className={`bg-brand-background min-h-screen font-inter ${
        isHomePage ? 'bg-right-top bg-no-repeat' : ''
      }`}
      style={isHomePage ? { backgroundImage: `url(${bg})` } : undefined}
    >
      <Navbar 
        userInitials={user?.initials}
        userName={user?.name}
        isLoggedIn={!!user}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
      />
      
      {children}
      
      {showLogin && (
        <Login 
          onLogin={onLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // ✅ localStorage useEffect removed

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  // ✅ localStorage.removeItem removed
  const handleLogout = () => {
    setUser(null);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const HomePage = () => (
    <>
      <main className="container mx-auto py-8 md:px-10 px-4">
        <div className="space-y-4">
          <Hero />
          <Explore />
        </div>
      </main>
      <div className="mx-12 mt-10">
        <Comingsoon />
      </div>
    </>
  );

  return (
    <Router>
      <Layout
        user={user}
        showLogin={showLogin}
        handleLogout={handleLogout}
        handleLoginClick={handleLoginClick}
        onLogin={handleLogin}
        setShowLogin={setShowLogin}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exam-vault" element={<ExamVault />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
