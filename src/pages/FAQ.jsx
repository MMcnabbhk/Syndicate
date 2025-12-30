import React from 'react';

const FAQ = () => {
    const faqs = [
        {
            category: "General Overview",
            navLabel: "General Overview",
            id: "general",
            items: [
                {
                    question: "What is Syndicate?",
                    answer: "Syndicate is a content syndication platform designed to connect authors with their readers. We solve the discovery problem found on major platforms by allowing authors to share stories, chapters, and poems directly with their friends, family, and fans. It is a space to profile your interests, build affinity with your audience, and distribute your work on your own terms."
                },
                {
                    question: "Who founded Syndicate?",
                    answer: "Syndicate was founded by Michael James, an author and technology executive. James created the platform after his own experience publishing Tyger: A Story of Survival (4.4 stars on Amazon). His personal frustrations with the difficulty of gaining visibility for his work on major retailers led him to build a solution that empowers authors to connect directly with their audience."
                },
                {
                    question: "How does the release model work?",
                    answer: "Unlike traditional retailers where a book is purchased once, Syndicate allows authors to \"drip\" content. You can release your work—whether it’s a novel, a short story collection, or a series of poems—on a Daily or Weekly basis, or offer it as a Full Download. Unlike Patreon or Substack, the syndication cycle begins from the date of the user request. In this way the reader receives the content in the order that it was intended."
                },
                {
                    question: "Who is this platform for?",
                    answer: "It is for writers who own the copyright to their work and want a direct line to their readers, and for readers who want to support independent authors while enjoying serialized content."
                },
                {
                    question: "What content do we support?",
                    answer: "We support a wide range of formats to suit different storytelling styles. You can publish Novels, Novellas, Short Stories, Poetry, and Audiobooks."
                }
            ]
        },
        {
            category: "For Authors: Publishing & Rights",
            navLabel: "Publishing & Rights",
            id: "publishing",
            items: [
                {
                    question: "Do I keep the rights to my work?",
                    answer: "Yes. You must own the copyright to any content you upload. You retain full ownership; we simply provide the platform for you to distribute it."
                },
                {
                    question: "Can I set a minimum amount to access my content?",
                    answer: "No. We are not a traditional retail model. We aspire to build a community of writers across all genres and forms, accessible to all. However, you have control over your distribution. You may elect not to allow a Full Download of your work. Your profile includes links to your works on Amazon, Google, and Apple. This allows you to run a hybrid strategy where you build an audience here with serialized content while selling complete volumes on other retailers."
                },
                {
                    question: "Can I use AI-generated content?",
                    answer: "Syndicate screens all submissions for AI-generated text. To maintain the integrity of human artistry on our platform, we may elect not to accept content flagged as AI-generated."
                },
                {
                    question: "How does scheduling work?",
                    answer: "You have full control over the cadence of your release. You can select Frequency: Daily, Weekly, or Full Download. You choose the specific day of the week and time of day for your content to drop."
                },
                {
                    question: "How do I find readers?",
                    answer: "We provide tools for you to invite friends, family, and your existing network via direct links or through the system’s invitation feature. Syndicate is built to help you strengthen relationships with the people who actually read your books, turning casual readers into loyal fans."
                }
            ]
        },
        {
            category: "For Authors: Earnings & Payouts",
            navLabel: "Earnings & Payouts",
            id: "earnings",
            items: [
                {
                    question: "How do readers pay for content?",
                    answer: "We use a Contribution Model rather than a paywall. Readers can express their appreciation for your art by making voluntary contributions in set amounts: $1.00, $3.00, or $10.00. These levels were set to reflect what authors net from the sale of a digital download or audiobook on Amazon."
                },
                {
                    question: "What are the fees?",
                    answer: "Syndicate charges a flat Service Fee of $3.00 per month from your earnings. How it works: We deduct the first $3.00 of contributions you receive each month to cover platform maintenance and hosting. Any contributions earned above that first $3.00 go directly to your author account balance."
                },
                {
                    question: "Are there any additional fees?",
                    answer: "Yes, we pass on the Stripe payment processing fees. These are roughly 3.2%."
                },
                {
                    question: "When do I get paid?",
                    answer: "You can request a payout once your account balance reaches a minimum of $40.00."
                },
                {
                    question: "How are payments processed?",
                    answer: "Currently, all payouts are processed via PayPal. We will be adding bank transfers to US and Canadian banks in the future."
                }
            ]
        },
        {
            category: "For Readers",
            navLabel: "For Readers",
            id: "readers",
            items: [
                {
                    question: "Is the content free?",
                    answer: "Yes, the content is accessible to read. Syndicate operates on an appreciation model. You can read the stories, chapters, and poems freely, and then choose to support the authors you love with voluntary contributions."
                },
                {
                    question: "Why should I contribute?",
                    answer: "Direct contributions allow authors to keep creating. Unlike major publishing platforms that take a massive cut of every sale, Syndicate ensures that after a small monthly service fee, your specific contribution goes to the author's balance."
                }
            ]
        }
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const renderWithHighlights = (text) => {
        if (!text) return text;

        // Split by the target phrases to preserve them in the parts
        const parts = text.split(/(Syndicate)/g);

        return parts.map((part, i) => {
            if (part === 'Syndicate') {
                return (
                    <span key={i} className="font-bold" style={{ color: '#cc5500' }}>
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="pb-40 pt-10">
            {/* Page Header */}
            <header className="container mb-12 text-center">
                <h1
                    className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    style={{ paddingBottom: '20px', paddingTop: '20px' }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">FAQ</span>
                </h1>

            </header>

            {/* Sub-navigation */}
            <section className="container mb-20 sticky top-20 z-40 bg-[#18181b]/95 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:bg-transparent md:backdrop-blur-none md:static md:p-0">
                <div className="flex items-center justify-center">
                    <div className="flex flex-wrap gap-3 items-center justify-center">
                        {faqs.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className="px-5 py-2 rounded-full text-sm font-medium bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5 transition-all duration-300"
                            >
                                {section.navLabel}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Sections */}
            <div className="flex flex-col gap-0">
                {faqs.map((section, idx) => (
                    <section
                        key={section.id}
                        id={section.id}
                        className={`py-6 ${idx % 2 !== 0 ? 'bg-zinc-900/30' : ''}`}
                        style={{ padding: '40px 0 20px 0' }}
                    >
                        <div className="container max-w-4xl mx-auto">
                            <h2
                                className="text-3xl font-bold text-white mb-6 border-l-4 border-violet-500 pl-6"
                                style={{ marginBottom: '20px' }}
                            >
                                {section.category}
                            </h2>

                            <div className="space-y-4">
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="pl-6" style={{ marginBottom: '10px' }}>
                                        <h3 className="text-xl font-bold text-zinc-200 mb-2">
                                            {renderWithHighlights(item.question)}
                                        </h3>
                                        <p className="text-lg text-zinc-400 leading-relaxed">
                                            {renderWithHighlights(item.answer)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>


        </div>
    );
};

export default FAQ;
