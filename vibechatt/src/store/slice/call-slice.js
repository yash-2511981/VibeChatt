// src/store/slices/callSlice.js

const createCallSlice = (set, get) => ({
   callUIState: "hidden",//notification,fullscreen
   localstream: null,
   remotestream: null,
   from: null,
   to:null,
   type: null,
   micOnn: true,
   videoOnn: true,
   callTime: 0,
   accepted: false,
   callDuration: 0,
   callStatus:null,
   setLocalStream: (localstream) => set({ localstream }),
   setremotestream: (remotestream) => set({ remotestream }),
   setcallUIState: (callUIState) => set({ callUIState }),
   setCallType: (type) => set({ type }),
   setMicOnn: (micOnn) => set({ micOnn }),
   setVideoOnn: (videoOnn) => set({ videoOnn }),
   startCallDuration: (callTime) => set({}),
   setAccepted: (accepted) => set({ accepted }),
   setCallStatus: (callStatus) => set({ callStatus }),
   setFrom: (from) => set({ from }),
   setTo: (to) => set({ to }),
   endCall: () => set({
      callUIState: "hidden",//notification,fullscreen
      localstream: null,
      remotestream: null,
      from: null,
      to:null,
      type: null,
      micOnn: true,
      videoOnn: true,
      callTime: 0,
      accepted: false,
      callDuration: 0,
      callStatus: null,
   }),
   updateCallDuration: () => set(state => ({
      callDuration: state.callDuration + 1
   })),
});

export default createCallSlice;
