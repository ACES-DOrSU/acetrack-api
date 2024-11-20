// Helper function to get the public ID from a Cloudinary URL
export const getCloudinaryPublicId = (url) => {
    const parts = url.split("/");
    const publicIdWithExtension = parts[parts.length - 1]; // e.g., 'profile_12345.jpg'
    const publicId = publicIdWithExtension.split(".")[0]; // Strip the extension
    return publicId;
  };
  