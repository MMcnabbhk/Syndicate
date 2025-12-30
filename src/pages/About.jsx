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

            <header className="container mb-16 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    About <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Syndicate</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    The platform for the direct-to-reader revolution.
                </p>
            </header>

            <div className="container max-w-3xl mx-auto space-y-20">
                {/* Mission Section */}
                <article>
                    <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-violet-500 pl-6">Our Mission</h2>
                    <div className="pl-6 text-lg text-zinc-300 space-y-4 leading-relaxed">
                        <p>
                            <strong>Syndicate</strong> is a content syndication platform designed to solve the discovery problem found on major retailers.
                            We allow authors to share stories, chapters, and poems directly with their friends, family, and fans.
                        </p>
                        <p>
                            We believe that the future of publishing is not in algorithms, but in <span className="text-[#cc5500] font-bold">direct affinity</span> between the artist and the audience.
                        </p>
                    </div>
                </article>

                {/* Origin Story */}
                <article>
                    <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-fuchsia-500 pl-6">The Origin</h2>
                    <div className="pl-6 text-lg text-zinc-300 space-y-4 leading-relaxed">
                        <p>
                            Syndicate was founded by <strong>Michael James</strong>, an author and technology executive.
                        </p>
                        <p>
                            James created the platform after his own experience publishing <em>Tyger: A Story of Survival</em> (4.4 stars on Amazon).
                            His personal frustrations with the difficulty of gaining visibility for his work on major platforms led him to build a solution that empowers authors to own their distribution.
                        </p>
                    </div>
                </article>

                {/* The Model */}
                <article>
                    <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-amber-500 pl-6">The Model</h2>
                    <div className="pl-6 text-lg text-zinc-300 space-y-4 leading-relaxed">
                        <p>
                            We operate on a unique <strong>Contribution Model</strong> rather than a paywall.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-zinc-400">
                            <li><strong>Serialization:</strong> Content is "dripped" on a Daily or Weekly basis, allowing readers to experience the story as it unfolds.</li>
                            <li><strong>Accessibility:</strong> Content is accessible to read. We aspire to build a community accessible to all.</li>
                            <li><strong>Direct Support:</strong> Readers make voluntary contributions ($1, $3, $10) which go directly to the author's balance (minus a small flat service fee).</li>
                        </ul>
                    </div>
                </article>

                {/* Content Types */}
                <article>
                    <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-cyan-500 pl-6">What We Support</h2>
                    <div className="pl-6 text-lg text-zinc-300 leading-relaxed">
                        <p className="mb-4">
                            We support a wide range of formats to suit different storytelling styles:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">Novels</div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">Novellas</div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">Short Stories</div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">Poetry Collections</div>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-white/5">Audiobooks</div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default About;
