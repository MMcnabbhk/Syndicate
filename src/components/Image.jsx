
import React, { useState } from 'react';

const Image = ({ src, alt, width, quality = 80, className, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    React.useEffect(() => {
        if (!src) return;

        // Only optimize local uploads, not external URLs (unless we proxy them too, but for now just uploads)
        // Adjust this logic based on how upload URLs are stored (e.g., "uploads/covers/..." vs "/uploads/covers/...")
        // The upload route returns relative paths like "uploads/covers/file.jpg"

        // Clean the src path
        let cleanSrc = src;
        if (cleanSrc.startsWith('/')) cleanSrc = cleanSrc.substring(1);

        if (cleanSrc.startsWith('uploads/')) {
            // Remove 'uploads/' prefix because the route expects the path relative to uploads dir
            // ACTUALLY, looking at my route logic: const relativePath = req.params[0];
            // and originalPath = path.join(UPLOADS_DIR, relativePath);
            // UPLOADS_DIR is public/uploads.
            // If src is "uploads/covers/img.jpg", passing "covers/img.jpg" works.

            const relativePath = cleanSrc.replace(/^uploads\//, '');
            const params = new URLSearchParams();
            if (width) params.append('w', width);
            if (quality) params.append('q', quality);
            params.append('f', 'webp'); // Always prefer webp

            setImgSrc(`/api/images/${relativePath}?${params.toString()}`);
        } else {
            setImgSrc(src);
        }
    }, [src, width, quality]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                if (!error) {
                    setError(true);
                    // Fallback to original if optimization fails
                    setImgSrc(src);
                }
            }}
            {...props}
        />
    );
};

export default Image;
