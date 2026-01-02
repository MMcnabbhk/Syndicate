// Anti-scraping middleware to block AI crawlers

const AI_CRAWLER_PATTERNS = [
    /GPTBot/i,
    /ChatGPT/i,
    /Google-Extended/i,
    /CCBot/i,
    /anthropic-ai/i,
    /Claude-Web/i,
    /ClaudeBot/i,
    /Omgilibot/i,
    /FacebookBot/i,
    /Applebot-Extended/i,
    /Meta-ExternalAgent/i,
    /PerplexityBot/i,
    /Bytespider/i,
    /Diffbot/i,
    /cohere-ai/i
];

export const blockAICrawlers = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';

    // Check if User-Agent matches any AI crawler pattern
    const isAICrawler = AI_CRAWLER_PATTERNS.some(pattern => pattern.test(userAgent));

    if (isAICrawler) {
        console.log(`[Anti-Scraping] Blocked AI crawler: ${userAgent}`);
        return res.status(403).json({
            error: 'Access forbidden',
            message: 'AI crawlers are not permitted to access this content. Please respect creator rights.'
        });
    }

    next();
};

export default blockAICrawlers;
