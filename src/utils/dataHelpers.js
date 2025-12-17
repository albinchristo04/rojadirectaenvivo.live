export const getAllMatches = (data) => {
    if (!data || !data.events || !data.events.streams) return [];

    const matches = [];
    data.events.streams.forEach(cat => {
        if (cat.streams) {
            cat.streams.forEach(match => {
                // Filter out 24/7 always_live streams
                if (match.always_live === 1 || match.always_live === true) return;

                matches.push({
                    ...match,
                    categoryName: cat.category,
                    categoryId: cat.id
                });
            });
        }
    });

    // Sort by start time
    return matches.sort((a, b) => a.starts_at - b.starts_at);
};

export const getLiveMatches = (matches) => {
    const now = Math.floor(Date.now() / 1000);
    return matches.filter(m => {
        // Only show actual live matches, not 24/7 streams
        return m.starts_at <= now && m.ends_at > now;
    });
};

export const getUpcomingMatches = (matches) => {
    const now = Math.floor(Date.now() / 1000);
    return matches.filter(m => m.starts_at > now);
};

export const formatMatchTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
    });
};

export const formatMatchDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Generate SEO-friendly slug from match name
export const generateSlug = (name) => {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};
