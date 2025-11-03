"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

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
        mute: () => void;
        unMute: () => void;
        isMuted: () => boolean;
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

export interface MusicPlayerRef {
  play: () => void;
  pause: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(({ shouldAutoPlay = false }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const playerRef = useRef<{
    playVideo: () => void;
    pauseVideo: () => void;
    mute: () => void;
    unMute: () => void;
    isMuted: () => boolean;
  } | null>(null);
  const autoplayAttemptedRef = useRef(false);
  const pendingPlayRef = useRef(false); // Track if play was requested before ready

  // Expose play/pause methods to parent via ref
  useImperativeHandle(ref, () => ({
    play: () => {
      if (playerRef.current && isReady) {
        // Player is ready, play immediately
        setHasUserInteracted(true);
        playerRef.current.unMute();
        playerRef.current.playVideo();
      } else {
        // Player not ready yet, queue the play action
        pendingPlayRef.current = true;
        setHasUserInteracted(true);
      }
    },
    pause: () => {
      if (playerRef.current && isReady) {
        playerRef.current.pauseVideo();
      }
      pendingPlayRef.current = false; // Cancel pending play
    },
  }), [isReady]);

  const initializePlayer = () => {
    if (playerRef.current) return; // Prevent duplicate initialization

    playerRef.current = new window.YT.Player("youtube-player", {
      videoId: "G0WTFfZqjz0",
      playerVars: {
        autoplay: 0,
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
          
          // If play was requested before player was ready, play now
          if (pendingPlayRef.current && playerRef.current) {
            pendingPlayRef.current = false;
            playerRef.current.unMute();
            playerRef.current.playVideo();
          }
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

  useEffect(() => {
    // Check if YouTube API script is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (existingScript) {
      window.onYouTubeIframeAPIReady = initializePlayer;
      return;
    }

    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;
  }, []);

  // Auto-play when shouldAutoPlay prop changes to true
  useEffect(() => {
    if (shouldAutoPlay && isReady && playerRef.current && !autoplayAttemptedRef.current) {
      autoplayAttemptedRef.current = true;

      // Try to play - mobile browsers may allow after user interaction
      const attemptPlay = async () => {
        try {
          if (playerRef.current) {
            playerRef.current.unMute();
            playerRef.current.playVideo();
          }
        } catch (error) {
          console.log("Autoplay failed, waiting for user interaction:", error);
        }
      };

      // Small delay to ensure user interaction is registered
      setTimeout(attemptPlay, 100);
    }
  }, [shouldAutoPlay, isReady]);

  const togglePlay = () => {
    if (!isReady || !playerRef.current) return;

    // Mark that user has interacted
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      // Ensure audio is unmuted when user manually plays
      playerRef.current.unMute();
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
        aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
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
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
