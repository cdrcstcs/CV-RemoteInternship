'use client';

import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useUserStore } from '@/stores/userStore'; // Adjust the import to match your file structure

import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';

// Use `process.env` for environment variables in JavaScript
const API_KEY = process.env.VITE_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }) => {
  const { user, checkingAuth } = useUserStore((state) => ({
    user: state.user,
    checkingAuth: state.checkingAuth,
  }));

  const [videoClient, setVideoClient] = useState(null);

  useEffect(() => {
    if (checkingAuth || !user) return; // Wait for auth check or user data

    if (!API_KEY) throw new Error('Stream API key is missing');

    const client = new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
      tokenProvider,
    });

    setVideoClient(client);
  }, [user, checkingAuth]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
