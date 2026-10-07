let mockWatchlist = [];

function normalizeItem(item) {
  return {
    id: item.id,
    media_type: item.media_type,
    title: item.title || item.name || 'Unknown',

    poster_path: item.poster_path || null,

    overview: item.overview || '',

    release_date: item.release_date || item.first_air_date || '',

    vote_average: item.vote_average || 0,
  };
}

export async function loadWatchlist() {
  return [...mockWatchlist]; 
}

export async function addToWatchlist(item) {
  const normalized = normalizeItem(item);

  const exists = mockWatchlist.some(
    (i) => i.id === normalized.id && i.media_type === normalized.media_type
  );

  if (exists) return [...mockWatchlist];

  mockWatchlist = [normalized, ...mockWatchlist]; 

  return [...mockWatchlist];
}

export async function removeFromWatchlist(item) {
  const normalized = normalizeItem(item);
  mockWatchlist = mockWatchlist.filter(
    (i) => !(i.id === normalized.id && i.media_type === normalized.media_type)
  );

  return [...mockWatchlist];
}

export async function isInWatchlist(item) {
  const normalized = normalizeItem(item);

  return mockWatchlist.some(
    (i) => i.id === normalized.id && i.media_type === normalized.media_type
  );
}