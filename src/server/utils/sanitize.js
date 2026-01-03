import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitizes HTML content to prevent XSS attacks while preserving allowed formatting.
 */
export const sanitizeHtml = (html) => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'img', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style']
    });
};

/**
 * Sanitizes plain text by removing all HTML tags.
 */
export const sanitizeText = (text) => {
    if (!text) return '';
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};
