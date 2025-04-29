import { useEffect, useRef, useState } from 'react';
import { IoCall, IoMic, IoMicOff } from 'react-icons/io5';
import { useAppStore } from '@/store';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { HOST } from '@/utils/constants';
import { formatTime, getColor } from '@/lib/utils';
import { useSocket } from '@/context/SocketContext';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]
};

export const VoiceCallScreen = () => {
  const {
    userInfo,
    from,
    to,
    user,
    callStatus,
    endCall,
    setMicOnn,
    micOnn,
    setRemoteStream,
    callDuration
  } = useAppStore();

  const socket = useSocket();
  const remoteRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);

  // Initialize peer connection
  useEffect(() => {
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteRef.current) {
        remoteRef.current.srcObject = remoteStream;
        setRemoteStream(remoteStream);
        setHasRemoteStream(true);
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          to:user.id,
          candidate: event.candidate
        });
      }
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      // Connection state monitoring without console logs
    };

    // Setup socket event listeners 
    socket.on('offer', async (offer) => {
      if (!peerConnection.current) return;
      
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        
        socket.emit('answer', { 
          to: from.id,
          answer 
        });
      } catch (error) {
        // Handle error silently
      }
    });

    socket.on('ans', async (answer) => {
      if (!peerConnection.current) return;
      
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        // Handle error silently
      }
    });

    socket.on('ice-candidate', async (candidate) => {
      if (!peerConnection.current) return;
      
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        // Handle error silently
      }
    });

    return () => {
      socket.off('offer');
      socket.off('ans');
      socket.off('ice-candidate');
      
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [socket, to, from, setRemoteStream]);

  // Set up media streams
  useEffect(() => {
    const setupMediaStream = async () => {
      try {
        // Only request audio for voice call
        const constraints = { 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        };
        
        localStream.current = await navigator.mediaDevices.getUserMedia(constraints);

        // Add tracks to peer connection
        if (peerConnection.current && localStream.current) {
          localStream.current.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, localStream.current);
          });
        }

        // Initiate call if this is the caller
        if (userInfo.id === from.id) {
          try {
            const offer = await peerConnection.current.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: false // Not needed for voice call
            });
            await peerConnection.current.setLocalDescription(offer);
            
            socket.emit('offer', { 
              to:to.id, 
              offer 
            });
          } catch (error) {
            // Handle error silently
          }
        }
      } catch (error) {
        // Handle error silently
      }
    };

    if (peerConnection.current) {
      setupMediaStream();
    }

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [userInfo.id, from, to, socket]);

  // Handle audio feedback for remote media
  useEffect(() => {
    if (remoteRef.current && remoteRef.current.srcObject) {
      remoteRef.current.volume = 1.0; // Ensure volume is up
      remoteRef.current.play().catch(() => {
        // Silent catch for autoplay restrictions
      });
    }
  }, [hasRemoteStream]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callStatus === 'ongoing') {
      interval = setInterval(() => {
        useAppStore.getState().updateCallDuration();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [callStatus]);

  const toggleMic = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOnn(audioTrack.enabled);
    }
  };

  const callEnded = () => {
    socket.emit("call-rejected", {
      to: user.id
    });
    endCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <div className="h-full flex flex-col gap-5 items-center justify-center text-white">
          <Avatar className="h-40 w-40 rounded-full overflow-hidden">
            {user.image ? (
              <AvatarImage 
                src={`${HOST}/${user.image}`} 
                alt="profile" 
                className="object-cover w-full h-full bg-black" 
              />
            ) : (
              <div className={`uppercase h-40 w-40 text-6xl border-[1px] flex items-center justify-center text-center rounded-full ${getColor(user.theme)}`}>
                {user.firstName 
                  ? user.firstName.split("").shift() 
                  : user.email.split("").shift()}
              </div>
            )}
          </Avatar>

          <div>
            <p className="text-2xl text-white">{`${user.firstName} ${user.lastName}`}</p>
          </div>

          <div className="text-xl">
            {callStatus === "ongoing" ? formatTime(callDuration) : callStatus}
          </div>
          
          {/* Audio element - hidden but functional */}
          <audio 
            ref={remoteRef} 
            autoPlay 
            playsInline 
            className="hidden" 
          />
        </div>
      </div>
      <div className="bg-gray-800 text-white p-4 flex justify-center gap-8">
        {callStatus === 'ongoing' && (
          <button 
            className={`p-3 rounded-full h-12 w-12 flex items-center justify-center ${micOnn ? 'bg-gray-700' : 'bg-red-600'}`} 
            onClick={toggleMic}
          >
            {micOnn ? <IoMic className="text-2xl" /> : <IoMicOff className="text-2xl" />}
          </button>
        )}
        <button 
          className="p-3 bg-red-600 rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
          onClick={callEnded}
        >
          <IoCall className="text-2xl" />
        </button>
      </div>
    </div>
  );
};