export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-avatar.png';
  return `https://thefolio-5poz.onrender.com/uploads/${imagePath}`;
};

