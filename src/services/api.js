const DATA_URL = "https://raw.githubusercontent.com/albinchristo04/ptv/refs/heads/main/events.json";

export const fetchEvents = async () => {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return null;
    }
};
