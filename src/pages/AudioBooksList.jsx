// src/pages/AudioBooksList.jsx
import React, { useEffect, useState } from "react";
import AudiobookPlayer from "../components/AudiobookPlayer";

const MOCK_AUDIOBOOKS = [
    {
        id: 1,
        title: "The Great Gatsby",
        chapters: [
            {
                id: 101,
                title: "Chapter 1",
                duration: "24:15",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            {
                id: 102,
                title: "Chapter 2",
                duration: "21:30",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            }
        ]
    },
    {
        id: 2,
        title: "Pride and Prejudice",
        chapters: [
            {
                id: 201,
                title: "Chapter 1",
                duration: "18:45",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            }
        ]
    }
];

const AudioBooksList = () => {
    const [audiobooks, setAudiobooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/audiobooks")
            .then((res) => res.json())
            .then((data) => {
                setAudiobooks(data);
                setLoading(false);
            })
            .catch(() => {
                console.log("Using mock data due to API error");
                setAudiobooks(MOCK_AUDIOBOOKS);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-white">Loading audiobooks…</div>;

    return (
        <div className="pb-20 pt-10">
            <header className="container mb-12 text-center">
                <h1
                    className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    style={{ paddingBottom: "20px", paddingTop: "20px" }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        Audiobooks
                    </span>
                </h1>
            </header>

            <section className="container">
                {audiobooks.length === 0 ? (
                    <p className="text-zinc-400 text-center">No audiobooks found.</p>
                ) : (
                    audiobooks.map((ab) => (
                        <div key={ab.id} className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-4 text-center">
                                {ab.title}
                            </h2>
                            {ab.chapters && ab.chapters.length > 0 ? (
                                ab.chapters.map((ch) => (
                                    <AudiobookPlayer key={ch.id} chapter={ch} />
                                ))
                            ) : (
                                <p className="text-zinc-500 text-center">
                                    No chapters available.
                                </p>
                            )}
                        </div>
                    ))
                )}
            </section>
        </div>
    );
};

export default AudioBooksList;
