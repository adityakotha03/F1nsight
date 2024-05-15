import React from 'react';
import { FaGithub, FaInstagram } from 'react-icons/fa';

function SupportPopup({ onClose }) {
  return (
    <div style={{ 
        position: 'fixed',
        bottom: '20px', 
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000 
      }}>
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg rounded-lg max-w-lg w-full"
           style={{
            position: 'relative',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)'
          }}>
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg text-white font-bold flex-grow text-center">Enjoy our work? Follow us here:</h2>
          <button onClick={onClose} className="text-white">x</button>
        </div>
        <div className="flex flex-col md:flex-row justify-around items-center p-4">
          <a href="https://www.instagram.com/f1nsight1/" target="_blank" rel="noopener noreferrer"
             className="transition duration-300 ease-in-out hover:scale-110 text-white py-2 px-4 flex items-center gap-2">
            <FaInstagram size={24} /> @f1nsight1
          </a>
          <a href="https://github.com/adityakotha03/F1nsight" target="_blank" rel="noopener noreferrer"
             className="transition duration-300 ease-in-out hover:scale-110 text-white py-2 px-4 flex items-center gap-2 mt-4 md:mt-0">
            <FaGithub size={24} /> F1nsight
          </a>
        </div>
      </div>
    </div>
  );
}

export default SupportPopup;