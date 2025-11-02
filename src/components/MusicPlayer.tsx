"use client";

import { useEffect, useRef, useState } from "react";

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady: () => void;
            onStateChange: (event: { data: number }) => void;
          };
        }
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
      };
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicPlayerProps {
  shouldAutoPlay?: boolean;
}

export default function MusicPlayer({ shouldAutoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<{
    playVideo: () => void;
    pauseVideo: () => void;
  } | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: "G0WTFfZqjz0",
        playerVars: {
          autoplay: 0, // Set to 0, will be controlled by shouldAutoPlay prop
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          loop: 1,
          playlist: "G0WTFfZqjz0", // Required for loop to work
        },
        events: {
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };
  }, []);

  // Auto-play when shouldAutoPlay prop changes to true
  useEffect(() => {
    if (shouldAutoPlay && isReady && playerRef.current) {
      playerRef.current.playVideo();
    }
  }, [shouldAutoPlay, isReady]);

  const togglePlay = () => {
    if (!isReady || !playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="hidden">
        <div id="youtube-player"></div>
      </div>

      {/* Floating Music Control Button */}
      <button
        onClick={togglePlay}
        disabled={!isReady}
        className="fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 animate-fade-in delay-800 group disabled:opacity-50"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          // Pause Icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-7 md:h-7 text-gray-800"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          // Play Icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 md:w-7 md:h-7 text-gray-800 ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        
        {/* Animated ripple effect when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border-2 border-gray-800 animate-ping opacity-75"></span>
        )}
      </button>
    </>
  );
}
