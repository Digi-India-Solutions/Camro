import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50'>
      <div className='loader'></div>
    </div>
  );
}

export default Loader;
