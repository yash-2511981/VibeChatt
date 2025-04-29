// src/store/slices/callSlice.js
const createCallSlice = (set, get) => {
  return {
    callUIState: "hidden", //notification,fullscreen
    user: null,
    from: null,
    to: null,
    type: null,
    micOnn: true,
    videoOnn: true,
    callTime: 0,
    accepted: false,
    callDuration: 0,
    callStatus: null,
    candidate: null,
    remotetrack: null,
    setcallUIState: (callUIState) => set({ callUIState }),
    setCallType: (type) => set({ type }),
    setMicOnn: (micOnn) => set({ micOnn }),
    setVideoOnn: (videoOnn) => set({ videoOnn }),
    startCallDuration: (callTime) => set({callTime}),
    setAccepted: (accepted) => set({ accepted }),
    setCallStatus: (callStatus) => set({ callStatus }),
    setFrom: (from) => set({ from }),
    setTo: (to) => set({ to }),
    setUser: (user) => set({ user }),
    setCandidate: (candidate) => set({ candidate }),
    endCall: () => {
      // Reset all state
      set({
        callUIState: "hidden", //notification,fullscreen
        user: null,
        from: null,
        to: null,
        type: null,
        micOnn: true,
        videoOnn: true,
        callTime: 0,
        accepted: false,
        callDuration: 0,
        callStatus: null,
        candidate: null,
        remotetrack:null,
      });
    },
    setRemoteStream: (remotetrack) => set({ remotetrack }),
    updateCallDuration: () => set(state => ({
      callDuration: state.callDuration + 1
    }))
  };
};

export default createCallSlice;