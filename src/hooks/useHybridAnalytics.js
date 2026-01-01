import { useEffect, useCallback } from 'react';

/**
 * Robust Hybrid Analytics Hook
 * Handles Platform-level GA4 + Author-level GA4 & Meta Pixel
 */
export const useHybridAnalytics = (authorData = {}) => {
    const GLOBAL_GA4_ID = import.meta.env.VITE_GLOBAL_GA4_ID || import.meta.env.REACT_APP_GLOBAL_GA4_ID;

    // Validate ID using regex (alphanumeric and dashes only)
    const validateId = (id) => {
        if (!id) return false;
        return /^[a-zA-Z0-9-]+$/.test(id);
    };

    const loadGAScript = useCallback((id, name = 'gtag') => {
        if (!validateId(id)) return;
        if (document.getElementById(`ga-script-${id}`)) return;

        const script = document.createElement('script');
        script.id = `ga-script-${id}`;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', id);
    }, []);

    const loadMetaPixelScript = useCallback((id) => {
        if (!validateId(id)) return;
        if (document.getElementById(`fb-pixel-${id}`)) return;

        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        window.fbq('init', id);
        window.fbq('track', 'PageView');

        const pixelImg = document.createElement('noscript');
        pixelImg.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1" />`;
        document.body.appendChild(pixelImg);
    }, []);

    // Initializations
    useEffect(() => {
        // Platform GA4
        if (GLOBAL_GA4_ID) {
            loadGAScript(GLOBAL_GA4_ID, 'global_gtag');
        }

        // Author specific GA4
        if (authorData?.ga_measurement_id) {
            loadGAScript(authorData.ga_measurement_id, 'author_gtag');
        }

        // Author specific Meta Pixel
        if (authorData?.meta_pixel_id) {
            loadMetaPixelScript(authorData.meta_pixel_id);
        }
    }, [GLOBAL_GA4_ID, authorData?.ga_measurement_id, authorData?.meta_pixel_id, loadGAScript, loadMetaPixelScript]);

    /**
     * trackEvent maps internal event names to GA4 and Meta Pixel requirements
     */
    const trackEvent = useCallback((eventName, params = {}) => {
        const activeTrackers = [];
        if (GLOBAL_GA4_ID) activeTrackers.push({ type: 'ga', id: GLOBAL_GA4_ID });
        if (authorData?.ga_measurement_id) activeTrackers.push({ type: 'ga', id: authorData.ga_measurement_id });
        if (authorData?.meta_pixel_id) activeTrackers.push({ type: 'meta', id: authorData.meta_pixel_id });

        // Event Mapping Logic
        let gaEventName = eventName;
        let metaEventName = eventName;

        // Example Mapping: 'view_work' -> GA4 'view_item' and FB 'ViewContent'
        if (eventName === 'view_work') {
            gaEventName = 'view_item';
            metaEventName = 'ViewContent';
        }

        activeTrackers.forEach(tracker => {
            if (tracker.type === 'ga' && window.gtag) {
                window.gtag('event', gaEventName, {
                    ...params,
                    send_to: tracker.id
                });
            }
            if (tracker.type === 'meta' && window.fbq) {
                window.fbq('trackSingle', tracker.id, metaEventName, params);
            }
        });
    }, [GLOBAL_GA4_ID, authorData?.ga_measurement_id, authorData?.meta_pixel_id]);

    return { trackEvent };
};
