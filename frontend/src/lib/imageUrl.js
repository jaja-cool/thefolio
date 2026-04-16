export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  if (imagePath.startsWith('http')) return imagePath;
  
  // Local uploads or Cloudinary public_id → prepend server URL
  const baseUrl = window.location.hostname === 'localhost' ? '' : 'https://thefolio-5poz.onrender.com';
  
  return `${baseUrl}/uploads/${imagePath}`;
};

