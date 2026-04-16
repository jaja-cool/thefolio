export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-avatar.png';
  
  // Always return relative /uploads/ path - browser + baseURL handles
  return `/uploads/${imagePath}`;
};

