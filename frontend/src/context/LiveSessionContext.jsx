import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../main';
import toast from 'react-hot-toast';

const LiveSessionContext = createContext();

export const LiveSessionProvider = ({ children }) => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveSessions = async () => {
    try {
      const { data } = await axios.get(`${server}/api/live-sessions`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLiveSessions(data.sessions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch live sessions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const startNewSession = async (sessionData) => {
    try {
      const { data } = await axios.post(
        `${server}/api/live-sessions`,
        sessionData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setLiveSessions([...liveSessions, data.session]);
      toast.success('Live session started successfully');
      return data.session;
    } catch (error) {
      console.error('Error creating live session:', error);
      toast.error(error.response?.data?.message || 'Failed to start live session');
      throw error;
    }
  };

  const endSession = async (sessionId) => {
    try {
      const { data } = await axios.put(
        `${server}/api/live-sessions/${sessionId}`,
        { status: 'ended' },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setLiveSessions(liveSessions.map(session => 
        session._id === sessionId ? { ...session, status: 'ended' } : session
      ));
      toast.success('Live session ended successfully');
      return data.session;
    } catch (error) {
      console.error('Error ending live session:', error);
      toast.error(error.response?.data?.message || 'Failed to end live session');
      throw error;
    }
  };

  const joinSession = async (sessionId) => {
    try {
      const { data } = await axios.post(
        `${server}/api/live-sessions/${sessionId}/join`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success('Joined live session successfully');
      return data.session;
    } catch (error) {
      console.error('Error joining live session:', error);
      toast.error(error.response?.data?.message || 'Failed to join live session');
      throw error;
    }
  };

  return (
    <LiveSessionContext.Provider
      value={{
        liveSessions,
        loading,
        startNewSession,
        endSession,
        joinSession,
        fetchLiveSessions,
      }}
    >
      {children}
    </LiveSessionContext.Provider>
  );
};

export const LiveSessionData = () => {
  const context = useContext(LiveSessionContext);
  if (!context) {
    throw new Error('LiveSessionData must be used within LiveSessionProvider');
  }
  return context;
};
