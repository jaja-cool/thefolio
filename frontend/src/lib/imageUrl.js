export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  if (imagePath.startsWith('http')) return imagePath;
  
  // Skip prepending for Cloudinary URLs, only for local uploads
  if (imagePath.includes('cloudinary.com')) return imagePath;
  
  const baseUrl = window.location.hostname === 'localhost' ? '' : 'https://thefolio-5poz.onrender.com';
  return `${baseUrl}/uploads/${imagePath}`;

};

