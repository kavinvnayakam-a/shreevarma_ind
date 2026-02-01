
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Loader2, AlertCircle } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { Button } from '../ui/button';

export function ZegoVideoCall({ consultationId }: { consultationId: string }) {
  const { user, isUserLoading } = useUser();
  const { firebaseApp } = useFirebase();
  const router = useRouter();
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<'initializing' | 'connecting' | 'error'>('initializing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMeeting = async () => {
      if (isUserLoading || !user || !firebaseApp || !videoContainerRef.current) {
        return;
      }
      
      if (status !== 'initializing') {
        return;
      }

      try {
        setStatus('connecting');

        const functions = getFunctions(firebaseApp);
        const getZegoToken = httpsCallable(functions, 'getZegoToken');
        
        const result: any = await getZegoToken({
          callId: consultationId,
          userId: user.uid,
        });

        const { token: serverToken, appID } = result.data;
        
        if (!serverToken || !appID) {
          throw new Error(result.data.error || 'Invalid token or AppID received from server.');
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          serverToken,
          consultationId,
          user.uid,
          user.displayName || 'User'
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
          container: videoContainerRef.current,
          sharedLinks: [
            {
              name: 'Copy meeting link',
              url: window.location.href,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: false,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showPreJoinView: true,
          onLeaveRoom: () => {
            router.push('/profile?tab=appointments');
          },
        });

      } catch (err: any) {
        console.error("Zego Initialization Error:", err);
        const errorMessage = err.message || 'An unknown error occurred while setting up the video call.';
        setError(errorMessage);
        setStatus('error');
      }
    };

    initMeeting();

  }, [user, isUserLoading, firebaseApp, consultationId, router, status]);

  if (isUserLoading || status === 'initializing') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Initializing Session</h2>
      </div>
    );
  }

  if (!user) {
     return (
       <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Authentication Error</h2>
        <p className="mb-6 max-w-md">You must be logged in to join a consultation.</p>
        <Button onClick={() => router.push('/login')} className="mt-4">
            Login
        </Button>
      </div>
    );
  }

  if (status === 'error') {
     return (
       <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
        <p className="mb-6 max-w-md">Could not initialize the video session.</p>
        <p className="text-xs text-gray-400 mb-6">Details: {error}</p>
        <Button onClick={() => router.push('/profile?tab=appointments')} className="mt-4">
            Go to My Appointments
        </Button>
      </div>
    );
  }

  return (
    <div
      className="w-screen h-screen"
      ref={videoContainerRef}
    />
  );
}
