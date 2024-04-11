export const generateStars = (rating) => {
    const solidStar = <i key="solid" className="fa-solid fa-star" style={{color: "#FFD43B"}}></i>;
    const emptyStar = <i key="empty" className="fa-solid fa-star" style={{color: "#c8e4f9"}}></i>;
    const stars = [];

    // Push solid stars
    for (let i = 0; i < rating.numberOfStars; i++) {
        stars.push(<span key={`solid-${i}`}>{solidStar}</span>);
    }

    // Push empty stars
    for (let i = 0; i < 5 - rating.numberOfStars; i++) {
        stars.push(<span key={`empty-${i}`}>{emptyStar}</span>);
    }
    return stars;
};

export const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${month}/${day}/${year} ${hours}:${minutes}${ampm}`;
}
