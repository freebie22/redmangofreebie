import React from 'react'
import { useState, useEffect } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(() => {
    return 0;
  })

  useEffect(() => {
    setCurrentYear((new Date(Date.now())).getFullYear());
  },[]);
  
  return (
    <div className="footer fixed-bottom text-center p-3 bg-dark text-white">
        Made by <i className="bi bi-heart-fill"></i> Artem Boikov &copy; {currentYear}
    </div>
  )
}

export default Footer