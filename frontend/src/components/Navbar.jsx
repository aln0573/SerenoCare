import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import logo from '../assets/pro.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const profileRef = useRef();

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6 relative">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img className="w-10 h-10 rounded-full object-cover" src={logo} alt="SerenoCare Logo" />
          <span className="text-2xl font-bold text-red-700">SerenoCare</span>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-base font-medium text-gray-800">
          {['/', '/doctors', '/about', '/contact'].map((path, idx) => (
            <NavLink key={idx} to={path} className={({ isActive }) => isActive ? 'border-b-2 border-red-700 pb-1 text-red-700' : 'hover:text-red-700 transition-colors duration-200'}>
              {['HOME', 'ALL DOCTORS', 'ABOUT', 'CONTACT'][idx]}
            </NavLink>
          ))}
        </ul>

        {/* Profile & Auth */}
        <div className="flex items-center gap-6 relative">
          {token ? (
            <div className="relative" ref={profileRef}>
              <img className="w-9 h-9 rounded-full object-cover border border-gray-300 cursor-pointer" src={userData.image} alt="Profile" onClick={() => setProfileMenu(!profileMenu)}/>
              {profileMenu && (
                <div className="absolute right-0 top-12 w-52 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <button onClick={() => {navigate('/my-profile');setProfileMenu(false);}} className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700">My Profile</button>
                  <button onClick={() => {navigate('/my-appointment');setProfileMenu(false);}}className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700">My Appointments</button>
                  <button onClick={() => {logout();setProfileMenu(false);}}className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 font-semibold">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="hidden md:inline-block bg-red-700 text-white px-6 py-2 rounded-full hover:bg-red-800 transition-colors duration-300">Create account</button>
          )}

          <button onClick={() => setShowMenu(!showMenu)}className="md:hidden focus:outline-none">
            <img className="w-6" src={assets.menu_icon} alt="Menu" />
          </button>
        </div>

        {showMenu && (
          <div className="fixed inset-0 bg-white flex flex-col items-center gap-8 py-10 z-40 text-lg font-medium">
            <button onClick={() => setShowMenu(false)} className="absolute top-5 right-5">
              <img className="w-6" src={assets.cross_icon} alt="Close" />
            </button>
            {['/', '/doctors', '/about', '/contact'].map((path, idx) => (
              <NavLink key={idx} onClick={() => setShowMenu(false)} to={path} className="hover:text-red-700 transition-colors duration-200">
                {['HOME', 'ALL DOCTORS', 'ABOUT', 'CONTACT'][idx]}
              </NavLink>
            ))}
            {!token && (
              <button onClick={() => {navigate('/login');setShowMenu(false);}}className="bg-red-700 text-white px-8 py-3 rounded-full hover:bg-red-800 transition-colors duration-300">
                Create account
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
