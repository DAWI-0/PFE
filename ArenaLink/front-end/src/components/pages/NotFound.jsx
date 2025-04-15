import React from 'react';
import vid from '../../assets/notf/b95680a1-b199-4c91-a508-4cd14eb6f039.mp4'; // Ensure the correct file extension

const NotFound = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-page video */}
      <video
        autoPlay
        loop
        muted
        playsInline // Ensures smooth playback on mobile devices
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with "Page Not Found" text */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
        <p className="mt-2 text-lg text-gray-300">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;