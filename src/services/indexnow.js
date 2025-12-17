// IndexNow API Integration for instant URL indexing
// Supports Bing, Yandex, Seznam, and other search engines

const INDEXNOW_KEY = '37377068f08348e2998d3617f6cad74d'; // Your IndexNow key
const SITE_HOST = 'rojadirectaenvivo.live';

// Submit single URL to IndexNow
export const submitToIndexNow = async (url) => {
    try {
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                host: SITE_HOST,
                key: INDEXNOW_KEY,
                keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
                urlList: [url]
            })
        });

        if (response.ok || response.status === 200 || response.status === 202) {
            console.log(`✅ IndexNow: Submitted ${url}`);
            return true;
        }
        console.warn(`⚠️ IndexNow: Failed to submit ${url}`, response.status);
        return false;
    } catch (error) {
        console.error('IndexNow submission error:', error);
        return false;
    }
};

// Submit multiple URLs in batch
export const submitBatchToIndexNow = async (urls) => {
    if (!urls || urls.length === 0) return false;

    try {
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                host: SITE_HOST,
                key: INDEXNOW_KEY,
                keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
                urlList: urls.slice(0, 10000) // Max 10,000 URLs per request
            })
        });

        if (response.ok || response.status === 200 || response.status === 202) {
            console.log(`✅ IndexNow: Submitted ${urls.length} URLs`);
            return true;
        }
        console.warn(`⚠️ IndexNow: Batch submission failed`, response.status);
        return false;
    } catch (error) {
        console.error('IndexNow batch submission error:', error);
        return false;
    }
};

// Generate all indexable URLs from matches
export const generateIndexableUrls = (matches) => {
    const baseUrl = `https://${SITE_HOST}`;
    const urls = [
        baseUrl,
        `${baseUrl}/`,
    ];

    // Add all match URLs
    matches.forEach(match => {
        urls.push(`${baseUrl}/event/${match.id}`);
    });

    // Add article URLs
    const articleSlugs = [
        'rojadirecta-en-vivo',
        'ver-futbol-online-gratis',
        'roja-directa-partidos',
        'deportes-en-vivo-hoy',
        'futbol-gratis-online'
    ];

    articleSlugs.forEach(slug => {
        urls.push(`${baseUrl}/articulo/${slug}`);
    });

    return urls;
};

// Auto-submit on page load (call once on initial load)
export const autoSubmitCurrentPage = () => {
    if (typeof window !== 'undefined') {
        const currentUrl = window.location.href;
        // Only submit on production
        if (currentUrl.includes(SITE_HOST)) {
            submitToIndexNow(currentUrl);
        }
    }
};
