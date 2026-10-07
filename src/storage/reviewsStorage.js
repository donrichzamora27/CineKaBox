let mockReviews = [];

export async function addReview({ mediaType, mediaId, rating, moods, thoughts }) {
  const newReview = {
    id: `${mediaType}-${mediaId}-${Date.now()}`,
    mediaType,
    mediaId,
    rating,
    moods,
    thoughts,

    createdAt: new Date().toISOString(),
  };

  mockReviews = [newReview, ...mockReviews]; 
  return mockReviews;
}

export async function loadReviewsForItem(mediaType, mediaId) {
  return mockReviews.filter(
    (r) => r.mediaType === mediaType && String(r.mediaId) === String(mediaId)
  );
}