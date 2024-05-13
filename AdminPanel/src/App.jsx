import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/SideBar';

function App() {
  const { pathname } = useLocation();
  
  // Scroll to the top of the page when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex flex-col w-full'>
        <Header />
        <div className='flex-grow'>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
