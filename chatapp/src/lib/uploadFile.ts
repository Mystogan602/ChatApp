export const uploadFile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};
