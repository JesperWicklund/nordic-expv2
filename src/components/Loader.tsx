// components/Loader.tsx
import React from 'react';

const Loader: React.FC = () => (
  <div className="flex justify-center items-center h-48">
    {/* Apply the loader class here */}
    <div className="loader"></div>
  </div>
);

export default Loader;