import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Hero from './components/hero';
import { Meteors } from './components/magicui/meteors';
import Comingsoon from './components/ComingSoon';
import ExamVault from './components/ExamVault';
import Login from './components/Login';
import Test from './components/test.jsx';
// Layout wrapper component to handle conditional styling
const Layout = ({ children, user, showLogin, handleLogout, handleLoginClick, onLogin, setShowLogin }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="relative">
      {/* Page background layer */}
      <div className="absolute inset-0 z-0 bg-brand-background" />

      {/* Meteors layer (visible above background, behind content) */}
      {isHomePage && (
        // keep meteors visually contained to avoid horizontal scroll on small screens
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <Meteors />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-20">
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
        </div>
      </main>
      <div className="m-10">
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
          <Route path="/test" element={<Test />}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
