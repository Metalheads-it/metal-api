const getJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) throw new Error('404, Not found');
            if (response.status === 500) throw new Error('500, internal server error');
            // For any other server error
            throw new Error(response.status);
        }
        return response.json();
    } catch (error) {
        console.error('Fetch', error);
        throw error;
    }
};

export { getJSON };
