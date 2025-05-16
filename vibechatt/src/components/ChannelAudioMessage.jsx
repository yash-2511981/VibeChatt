import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { BiCheck } from 'react-icons/bi';
import { IoPause, IoPlay } from 'react-icons/io5';

const ChannelAudioMessage = ({ message, userInfo }) => {
    const audioRef = useRef();
    const progressBarRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Update progress bar width directly based on current time
    const updateProgressBar = () => {
        if (progressBarRef.current && duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            progressBarRef.current.style.width = `${progressPercent}%`;
        }
    };

    // Call this whenever currentTime or duration changes
    useEffect(() => {
        updateProgressBar();
    }, [currentTime, duration]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            if (isFinite(audio.duration)) {
                setDuration(audio.duration);
                setIsLoaded(true);
            }
        };

        const handleDurationChange = () => {
            if (isFinite(audio.duration)) {
                setDuration(audio.duration);
                setIsLoaded(true);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        const handleCanPlayThrough = () => {
            if (isFinite(audio.duration)) {
                setDuration(audio.duration);
                setIsLoaded(true);
            }
        };

        // Force load audio metadata
        const loadAudioData = () => {
            const setAudioDuration = () => {
                if (isFinite(audio.duration)) {
                    setDuration(audio.duration);
                    setIsLoaded(true);
                    audio.removeEventListener('loadeddata', setAudioDuration);
                }
            };

            audio.addEventListener('loadeddata', setAudioDuration);

            // Force load by setting currentTime to a small value
            audio.currentTime = 0.1;
            setTimeout(() => {
                audio.currentTime = 0;
            }, 200);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("durationchange", handleDurationChange);
        audio.addEventListener("canplaythrough", handleCanPlayThrough);
        audio.addEventListener("ended", handleEnded);

        // Try to force load the audio data
        loadAudioData();

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("durationchange", handleDurationChange);
            audio.removeEventListener("canplaythrough", handleCanPlayThrough);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        }
        setIsPlaying(!isPlaying);
    }

    const handleSeek = (e) => {
        const clickX = e.nativeEvent.offsetX;
        const barWidth = e.currentTarget.clientWidth;
        const seekTime = (clickX / barWidth) * duration;

        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    }

    const formatTime = (time) => {
        const mins = String(Math.floor(time / 60)).padStart(2, "0");
        const secs = String(Math.floor(time % 60)).padStart(2, "0");
        return `${mins}:${secs}`;
    }

    return (
        <div className={`${message.sender._id === userInfo.id
            ? "bg-[#8417ff]/5 text-[#8427ff]/90 border-[#8417ff]/50"
            : "bg-[#2a2b33]/5 text-white/90 border-[#ffffff]/20"} border inline-block p-2 rounded my-1 ml-10 max-w-[50%] break-words`}>
            <audio
                ref={audioRef}
                preload='metadata'
                src={`${HOST}/${message.fileUrl}`}
                className="hidden"
            >
                Your browser does not support the audio element.
            </audio>
            <div className="flex flex-col">
                <div className="flex items-center gap-2 p-1">
                    <button
                        onClick={togglePlay}
                        type="button"
                        className="flex-shrink-0">
                        {isPlaying ? <IoPause className='text-2xl' /> : <IoPlay className='text-2xl' />}
                    </button>
                    {/* Custom Progress Bar Start */}
                    <div className="flex flex-col w-[100px] lg:w-[250px]">
                        <div
                            className="relative w-full h-1 bg-gray-200 rounded cursor-pointer"
                            onClick={handleSeek}
                        >
                            <div
                                ref={progressBarRef}
                                className="absolute top-0 left-0 h-full bg-[#8427ff] rounded"
                                style={{ width: '0%', transition: 'width 0.1s linear' }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        {isPlaying ?
                            <span>{formatTime(currentTime || 0)}</span> :
                            <span>{formatTime(isLoaded ? duration : 0)}</span>
                        }
                    </div>
                    {/* Custom Progress Bar End */}
                </div>
                <div className={`text-[10px] text-gray-600 flex items-center justify-end h-[15px] mt-1`}>
                    <span>
                        {moment(message.timestamp).format("LT")}
                    </span>
                    {message.sender._id === userInfo.id &&
                        <span className="ml-1">
                            {message.status === "sent" && <BiCheck className="text-[13px]" />}
                        </span>
                    }
                </div>
            </div>
        </div>
    );
}

export default ChannelAudioMessage;