export const getAllMatches = (data) => {
    if (!data || !data.events || !data.events.streams) return [];

    const matches = [];
    data.events.streams.forEach(cat => {
        if (cat.streams) {
            cat.streams.forEach(match => {
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
        // Check if live now or marked as always live (if logic exists)
        // Based on JSON, 'always_live' exists.
        if (m.always_live) return true;
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
