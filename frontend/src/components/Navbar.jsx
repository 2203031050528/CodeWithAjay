import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenuAlt3, HiX, HiAcademicCap, HiLogout, HiUser, HiChartBar, HiCog } from 'react-icons/hi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40" style={{
      background: 'rgba(10, 10, 18, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            }}>
              <HiAcademicCap className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold gradient-text">CodeWithAjay</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors no-underline text-sm font-medium">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors no-underline text-sm font-medium">Dashboard</Link>
                <Link to="/progress" className="text-slate-300 hover:text-white transition-colors no-underline text-sm font-medium">Progress</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-cyan-400 hover:text-cyan-300 transition-colors no-underline text-sm font-medium flex items-center gap-1">
                <HiCog className="text-base" /> Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-200 font-medium">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors text-sm cursor-pointer bg-transparent border-none font-medium">
                  <HiLogout /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors no-underline text-sm font-medium px-4 py-2">Login</Link>
                <Link to="/register" className="gradient-btn text-sm !py-2 !px-5 no-underline">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white text-2xl bg-transparent border-none cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            id="navbar-mobile-toggle"
          >
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-slide-up" style={{
          background: 'rgba(15, 13, 26, 0.98)',
          borderTop: '1px solid rgba(99, 102, 241, 0.1)',
          padding: '16px 20px 24px',
        }}>
          <div className="flex flex-col gap-3">
            <Link to="/" className="text-slate-300 hover:text-white no-underline py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-slate-300 hover:text-white no-underline py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/progress" className="text-slate-300 hover:text-white no-underline py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>Progress</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-cyan-400 hover:text-cyan-300 no-underline py-2 text-sm font-medium flex items-center gap-1" onClick={() => setIsOpen(false)}>
                <HiCog /> Admin Panel
              </Link>
            )}
            <div className="border-t border-slate-800 my-2"></div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-rose-400 text-left bg-transparent border-none cursor-pointer text-sm font-medium py-2">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white no-underline py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="gradient-btn text-sm text-center no-underline !py-2" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
