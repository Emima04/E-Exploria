import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";

import uiClick from "../assets/audio/ui-click.wav";
import uiInterface from "../assets/audio/ui-interface.wav";
import puzzleOpen from "../assets/audio/puzzle-open.wav";
import commandExtract from "../assets/audio/command-extract.wav";
import puzzleSuccess from "../assets/audio/puzzle-success.wav";
import itemPickup from "../assets/audio/item-pickup.wav";
import puzzleComplete from "../assets/audio/puzzle-complete.wav";

type SoundName =
  | "click"
  | "interface"
  | "open"
  | "extract"
  | "success"
  | "pickup"
  | "complete";

interface AudioContextType {
  playSound: (
    sound: SoundName,
    volume?: number
  ) => void;
}

const AudioContext =
  createContext<AudioContextType | null>(null);

const SOUND_SOURCES: Record<SoundName, string> = {
  click: uiClick,
  interface: uiInterface,
  open: puzzleOpen,
  extract: commandExtract,
  success: puzzleSuccess,
  pickup: itemPickup,
  complete: puzzleComplete,
};

export function AudioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioPool = useRef<
    Partial<Record<SoundName, HTMLAudioElement>>
  >({});

  /*
   * Preload the audio files once.
   */

  useEffect(() => {
    Object.entries(SOUND_SOURCES).forEach(
      ([name, source]) => {
        const soundName = name as SoundName;

        const audio = new Audio(source);

        audio.preload = "auto";
        audio.load();

        audioPool.current[soundName] = audio;
      }
    );
  }, []);

  function playSound(
    sound: SoundName,
    volume = 0.7
  ) {
    const original =
      audioPool.current[sound];

    if (!original) {
      return;
    }

    /*
     * Clone the already-preloaded sound.
     *
     * This avoids creating/loading the WAV file
     * at the exact moment the player clicks.
     */

    const audio =
      original.cloneNode(true) as HTMLAudioElement;

    audio.volume = Math.max(
      0,
      Math.min(volume, 1)
    );

    audio.currentTime = 0;

    void audio.play().catch((error) => {
      console.warn(
        `Could not play sound: ${sound}`,
        error
      );
    });
  }

  return (
    <AudioContext.Provider
      value={{
        playSound,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error(
      "useAudio must be used inside AudioProvider"
    );
  }

  return context;
}