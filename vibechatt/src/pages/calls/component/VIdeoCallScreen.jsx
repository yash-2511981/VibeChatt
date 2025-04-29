import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store';
import { useSocket } from '@/context/SocketContext';
import { IoCall, IoMic, IoMicOff, IoVideocam, IoVideocamOff } from 'react-icons/io5';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Add a TURN server for better connectivity through firewalls
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ]
};

export const VideoCallScreen = () => {
  const {
    userInfo,
    from,
    to,
    user,
    callStatus,
    endCall,
    setMicOnn,
    setVideoOnn,
    micOnn,
    videoOnn,
    setRemoteStream,
  } = useAppStore();

  const socket = useSocket();
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);

  // Initialize peer connection first, separate from media setup
  useEffect(() => {
    console.log("Initializing peer connection");
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.ontrack = (event) => {
      console.log("Remote track received", event.streams);
      const remoteStream = event.streams[0];
      
      if (remoteRef.current) {
        console.log("Setting remote stream to video element");
        remoteRef.current.srcObject = remoteStream;
        setRemoteStream(remoteStream);
        setHasRemoteStream(true);
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate");
        socket.emit('ice-candidate', {
          to:user.id,
          candidate: event.candidate
        });
      }
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", peerConnection.current.iceConnectionState);
    };

    peerConnection.current.onconnectionstatechange = () => {
      console.log("Connection state:", peerConnection.current.connectionState);
    };

    // Setup socket event listeners 
    socket.on('offer', async (offer) => {
      console.log("Received offer", offer);
      if (!peerConnection.current) {
        console.error("PeerConnection not initialized when receiving offer");
        return;
      }
      
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        console.log("Remote description set");
        
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        console.log("Created and set local answer");
        
        socket.emit('answer', { 
          to: from.id, // This should be the ID of the caller
          answer 
        });
        console.log("Answer sent to caller");
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    // Changed from 'answer' to 'ans' to match the server emit event
    socket.on('ans', async (answer) => {
      console.log("Received answer", answer);
      if (!peerConnection.current) {
        console.error("PeerConnection not initialized when receiving answer");
        return;
      }
      
      try {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Remote answer description set");
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    });

    socket.on('ice-candidate', async (candidate) => {
      console.log("Received ICE candidate");
      if (!peerConnection.current) {
        console.error("PeerConnection not initialized when receiving ICE candidate");
        return;
      }
      
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Added ICE candidate successfully");
      } catch (error) {
        console.error('Error adding received ice candidate', error);
      }
    });

    return () => {
      console.log("Cleaning up peer connection and socket listeners");
      socket.off('offer');
      socket.off('ans'); // Changed from 'answer' to 'ans'
      socket.off('ice-candidate');
      
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [socket, to, from, setRemoteStream]);

  // Set up media streams after peer connection is initialized
  useEffect(() => {
    const setupMediaStream = async () => {
      try {
        console.log("Setting up local media stream");
        // Request wider range of constraints for better compatibility
        const constraints = { 
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        };
        
        localStream.current = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (localRef.current) {
          localRef.current.srcObject = localStream.current;
          localRef.current.play().catch(err => console.error("Error playing local video:", err));
        }
        console.log("Local stream added to video element");

        // Add tracks to peer connection
        if (peerConnection.current && localStream.current) {
          localStream.current.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, localStream.current);
            console.log(`Added ${track.kind} track to peer connection`);
          });
        }

        // Initiate call if this is the caller
        if (userInfo.id === from.id) {
          console.log("I am the caller, creating offer");
          try {
            const offer = await peerConnection.current.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true
            });
            await peerConnection.current.setLocalDescription(offer);
            console.log("Offer created and set as local description");
            
            socket.emit('offer', { 
              to:to.id, 
              offer 
            });
            console.log("Offer sent to callee");
          } catch (error) {
            console.error("Error creating or sending offer:", error);
          }
        } else {
          console.log("I am the callee, waiting for offer");
        }
      } catch (error) {
        console.error("Error setting up media devices:", error);
      }
    };

    if (peerConnection.current) {
      setupMediaStream();
    }

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped ${track.kind} track`);
        });
      }
    };
  }, [userInfo.id, from, to, socket]);

  // Handle audio-visual feedback for remote media
  useEffect(() => {
    if (remoteRef.current && remoteRef.current.srcObject) {
      console.log("Setting up remote video volume");
      remoteRef.current.volume = 1.0; // Ensure volume is up
      
      // Force play the video to handle autoplay restrictions
      remoteRef.current.play().catch(err => {
        console.error("Error auto-playing remote video:", err);
        // Add a play button if autoplay is blocked
        if (err.name === 'NotAllowedError') {
          console.log("Autoplay blocked - user needs to interact");
        }
      });
    }
  }, [hasRemoteStream]);

  const toggleMic = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOnn(audioTrack.enabled);
      console.log(`Microphone ${audioTrack.enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOnn(videoTrack.enabled);
      console.log(`Camera ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const callEnded = () => {
    console.log("Ending call");
    socket.emit("call-rejected", {
      to: user.id
    });
    endCall();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <video 
          ref={remoteRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover ${hasRemoteStream ? 'block' : 'hidden'}`} 
        />
        
        {!hasRemoteStream && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
            Connecting... Waiting for remote video
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 w-32 h-48 z-10">
          <video 
            ref={localRef} 
            autoPlay 
            playsInline 
            muted // Important: Mute local video to prevent audio feedback
            className="w-full h-full object-cover rounded shadow-lg" 
          />
        </div>
      </div>
      <div className="bg-gray-800 text-white p-4 flex justify-center gap-8">
        {callStatus === 'ongoing' && (
          <>
            <button 
              className={`p-3 rounded-full h-12 w-12 flex items-center justify-center ${micOnn ? 'bg-gray-700' : 'bg-red-600'}`} 
              onClick={toggleMic}
            >
              {micOnn ? <IoMic className='text-2xl' /> : <IoMicOff className='text-2xl' />}
            </button>

            <button 
              className={`p-3 rounded-full h-12 w-12 flex items-center justify-center ${videoOnn ? 'bg-gray-700' : 'bg-red-600'}`} 
              onClick={toggleVideo}
            >
              {videoOnn ? <IoVideocam className='text-2xl' /> : <IoVideocamOff className='text-2xl' />}
            </button>
          </>
        )}
        <button 
          className="p-3 bg-red-600 rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
          onClick={callEnded}
        >
          <IoCall className='text-2xl' />
        </button>
      </div>
    </div>
  );
};