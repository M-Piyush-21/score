import React, { useEffect, useRef, useState } from 'react';

const VideoStream = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError('');
      }
    } catch (err) {
      setError('Failed to access camera and microphone');
      console.error('Error accessing media devices:', err);
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
      <div className="controls">
        {!isStreaming ? (
          <button onClick={startStream}>Start Stream</button>
        ) : (
          <button onClick={stopStream}>Stop Stream</button>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VideoStream;