import React from 'react';

const About = () => {
    // Structured Data for SEO and LLMs
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Syndicate",
        "url": "https://syndicate.direct",
        "logo": "https://syndicate.direct/logo.png",
        "description": "A content syndication platform designed to connect authors directly with their readers through serialized content.",
        "founder": {
            "@type": "Person",
            "name": "Michael James",
            "description": "Author of 'Tyger: A Story of Survival' and technology executive."
        },
        "mission": "To solve the discovery problem for independent authors and empower them to build direct affinity with their audience.",
        "foundingDate": "2024",
        "sameAs": [
            "https://twitter.com/syndicate",
            "https://instagram.com/syndicate"
        ]
    };

    return (
        <div className="pb-40 pt-10">
            {/* JSON-LD Script */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            <header className="container mx-auto mb-0 flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Syndicate</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl" style={{ marginBottom: '30px' }}>
                    The future of publishing is not in algorithms.
                </p>
            </header>

            <div className="container max-w-3xl mx-auto">
                {/* Mission Section */}
                <article className="mb-4">
                    <h2 className="text-3xl font-bold text-white pl-6 border-l-4 border-violet-500" style={{ marginBottom: '10px' }}>Our Mission</h2>
                    <div className="pl-6 text-lg text-zinc-300 space-y-4 leading-relaxed" style={{ marginBottom: '16px' }}>
                        <p>
                            <strong>Syndicate</strong> is a content syndication platform designed to solve the discovery problem faced by most creators. We allow authors to share stories, chapters, and poems directly with their friends, family, and fans. We believe that the future of publishing is not in algorithms, but in <span className="text-[#cc5500] font-bold">direct affinity</span> between the artist and the audience.
                        </p>
                    </div>
                </article>

                {/* Origin Story */}
                <article className="mb-4">
                    <h2 className="text-3xl font-bold text-white pl-6 border-l-4 border-fuchsia-500" style={{ marginBottom: '10px' }}>The Origin</h2>
                    <div className="pl-6 text-lg text-zinc-300 space-y-4 leading-relaxed" style={{ marginBottom: '16px' }}>
                        <p>
                            Syndicate was founded by <strong>Michael James</strong>, an author and geek. James created the platform after his own experience publishing <em>Tyger: A Story of Survival</em> (4.4 stars on Amazon). His personal frustrations with the difficulty of gaining visibility for his work on major platforms led him to build a solution that empowers authors to own their distribution.
                        </p>
                    </div>
                </article>

                {/* The Model */}
                <article>
                    <h2 className="text-3xl font-bold text-white pl-6 border-l-4 border-amber-500" style={{ marginBottom: '10px' }}>The Model</h2>
                    <div className="pl-6 text-lg text-zinc-300 space-y-4 leading-relaxed">
                        <p>
                            We operate on a unique <strong>Contribution Model</strong> rather than a paywall.
                        </p>
                        <ul className="list-disc space-y-2 text-zinc-400" style={{ paddingLeft: '40px' }}>
                            <li><strong>Serialization:</strong> Content is "dripped" on a Daily or Weekly basis, allowing readers to experience the story as it unfolds.</li>
                            <li><strong>Accessibility:</strong> Content is free to read or consume. We aspire to build a community accessible to all.</li>
                            <li><strong>Direct Support:</strong> Readers make voluntary contributions which go directly to the author's account (minus a small flat service fee).</li>
                        </ul>
                    </div>
                </article>

                <div style={{ height: '40px' }}></div>
            </div>
        </div>
    );
};

export default About;
