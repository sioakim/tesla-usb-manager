import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export interface UseAudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  currentSoundId: string | null;
  progress: number; // 0-1
  duration: number; // milliseconds
}

export interface UseAudioPlayer extends UseAudioPlayerState {
  playSound: (soundId: string, uri: string) => Promise<void>;
  pauseSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
}

export function useAudioPlayer(): UseAudioPlayer {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSoundId, setCurrentSoundId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const unloadCurrentSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.warn('Error unloading sound:', error);
      }
      soundRef.current = null;
    }
  };

  const playSound = async (soundId: string, uri: string) => {
    try {
      setIsLoading(true);

      // Stop previous sound if playing
      if (soundRef.current && currentSoundId !== soundId) {
        await unloadCurrentSound();
      }

      // If same sound is paused, resume
      if (currentSoundId === soundId && soundRef.current && !isPlaying) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      // Load new sound
      const { sound, status } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      setCurrentSoundId(soundId);

      // Set duration when loaded
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }

      // Subscribe to playback status updates
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.isLoaded) {
          setDuration(playbackStatus.durationMillis || 0);
          setProgress(
            playbackStatus.durationMillis
              ? playbackStatus.positionMillis / playbackStatus.durationMillis
              : 0
          );
          setIsPlaying(playbackStatus.isPlaying);

          // Auto-stop when finished
          if (playbackStatus.didJustFinish) {
            setIsPlaying(false);
            setProgress(0);
          }
        }
      });

      // Play the sound
      await sound.playAsync();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.warn('Error playing sound:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const pauseSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.warn('Error pausing sound:', error);
    }
  };

  const stopSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setIsPlaying(false);
      setCurrentSoundId(null);
      setProgress(0);
    } catch (error) {
      console.warn('Error stopping sound:', error);
    }
  };

  const seekTo = async (position: number) => {
    try {
      if (soundRef.current && duration > 0) {
        const positionMs = Math.max(0, Math.min(position, 1)) * duration;
        await soundRef.current.setPositionAsync(positionMs);
      }
    } catch (error) {
      console.warn('Error seeking:', error);
    }
  };

  return {
    isPlaying,
    isLoading,
    currentSoundId,
    progress,
    duration,
    playSound,
    pauseSound,
    stopSound,
    seekTo,
  };
}
