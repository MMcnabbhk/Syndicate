// src/pages/PoetryCollections.jsx
import React, { useEffect, useState } from "react";
import PoetryCollectionView from "../components/PoetryCollectionView";

const PoetryCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/poetry-collections")
            .then((res) => res.json())
            .then((data) => {
                setCollections(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-white">Loading collections…</div>;

    return (
        <div className="pb-20 pt-10">
            <header className="container mb-12 text-center">
                <h1
                    className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    style={{ paddingBottom: "20px", paddingTop: "20px" }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                        Poetry Collections
                    </span>
                </h1>
            </header>

            <section className="container">
                {collections.length === 0 ? (
                    <p className="text-zinc-400 text-center">No collections found.</p>
                ) : (
                    collections.map((col) => (
                        <PoetryCollectionView key={col.id} collection={col} />
                    ))
                )}
            </section>
        </div>
    );
};

export default PoetryCollections;
