
import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ items, style = {} }) => {
    // Duplicate items to ensure smooth infinite loop
    const marqueeItems = [...items, ...items, ...items, ...items];

    console.log('Marquee Rendered', { itemCount: items.length, duration: items.length * 30 });

    return (
        <div
            className="relative w-full overflow-hidden bg-black text-white border-b border-gray-800 py-2"
            style={style}
        >
            <div className="flex">
                <motion.div
                    key={`marquee-${items.length}-30`} // Force re-render when duration parameters change
                    className="flex whitespace-nowrap"
                    animate={{ x: [0, '-100%'] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: items.length * 30, // Dynamic duration based on length
                    }}
                >
                    {marqueeItems.map((item, index) => (
                        <span
                            key={`${item.id}-${index}`}
                            className="mx-8 text-sm font-medium tracking-widest uppercase"
                            style={{ color: item.color || 'white' }}
                        >
                            {item.title} {item.author_name ? `• ${item.author_name}` : ''}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Marquee;
