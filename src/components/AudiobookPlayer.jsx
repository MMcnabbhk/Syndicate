import React, { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const AudiobookPlayer = ({ chapter }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="bg-zinc-800/50 p-4 rounded-lg mb-4 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-colors">
            <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-700 text-white transition-all flex-shrink-0"
            >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <div className="flex-grow min-w-0">
                <h3 className="text-white font-medium truncate">{chapter.title}</h3>
                <p className="text-zinc-400 text-sm truncate">{chapter.duration || "Duration unknown"}</p>
            </div>
            <audio
                ref={audioRef}
                src={chapter.audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />
        </div>
    );
};

export default AudiobookPlayer;
