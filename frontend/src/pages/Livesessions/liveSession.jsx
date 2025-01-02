import React, { useState, useRef, useEffect } from 'react';
import VideoStream from '../../chat/Videostream/VideoStream.jsx';
import ChatBox from '../../chat/Chat/ChatBox.jsx';
import './liveSession.css';
import toast from 'react-hot-toast';
import { Play, StopCircle } from 'lucide-react';

const LiveSession = () => {
  const [isLive, setIsLive] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      
      setStream(mediaStream);
      setIsLive(true);
      toast.success('Stream started successfully');
    } catch (error) {
      console.error('Error starting stream:', error);
      toast.error('Failed to start stream');
    }
  };

  const stopStream = () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setIsLive(false);
      toast.success('Stream ended successfully');
    } catch (error) {
      console.error('Error stopping stream:', error);
      toast.error('Failed to stop stream');
    }
  };

  return (
    <div className="live-session-page">
      <h1 className="session-title">Live Streaming Session</h1>
      <p className="session-description">
        Join the live session and interact with the instructor and other participants.
      </p>
      
      <div className="content-container">
        <div className="video-stream">
          {isLive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="live-video"
              />
              <div className="stream-controls">
                <button className="stop-stream-btn" onClick={stopStream}>
                  <StopCircle size={24} />
                  End Stream
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="video-placeholder">
                <h3>Click Start Stream to begin broadcasting</h3>
              </div>
              <div className="stream-controls">
                <button className="start-stream-btn" onClick={startStream}>
                  <Play size={24} />
                  Start Stream
                </button>
              </div>
            </>
          )}
        </div>
        
        <div className="chat-box">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default LiveSession;
