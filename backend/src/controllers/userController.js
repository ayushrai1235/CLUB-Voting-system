import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import redisClient from '../config/redis.js';

export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old image from Cloudinary if it exists and is not a default/external image
    if (user.profilePhoto && user.profilePhoto.includes('cloudinary')) {
      try {
        // Extract public ID from URL
        // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
        const parts = user.profilePhoto.split('/');
        const filename = parts[parts.length - 1];
        const publicId = filename.split('.')[0];
        
        // If you are using folders, you might need to adjust the extraction logic
        // For now, assuming simple structure or that publicId needs to include folder if present
        // A more robust way is to store public_id in DB, but extracting from URL is common if structure is known
        
        // Let's try to be safer: Cloudinary URLs often have version numbers.
        // We need everything after 'upload/' and before extension, excluding version 'v123...'
        
        const uploadIndex = user.profilePhoto.indexOf('/upload/');
        if (uploadIndex !== -1) {
            let publicIdWithVersion = user.profilePhoto.substring(uploadIndex + 8); // +8 for length of '/upload/'
            // Remove version if present (starts with v and numbers, then slash)
            if (publicIdWithVersion.match(/^v\d+\//)) {
                publicIdWithVersion = publicIdWithVersion.replace(/^v\d+\//, '');
            }
            const publicId = publicIdWithVersion.split('.')[0]; // Remove extension
            
            await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err);
        // Continue even if delete fails, don't block update
      }
    }

    // The new image is already uploaded by multer-storage-cloudinary or we need to upload it?
    // Wait, the upload middleware uses memoryStorage in this project (checked in step 250).
    // So we need to upload the buffer to Cloudinary here.

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'voting-system/profiles',
    });

    // Update user
    user.profilePhoto = result.secure_url;
    await user.save();

    // Invalidate Redis Cache
    try {
        await redisClient.del(`user:${user.email}`);
    } catch (cacheError) {
        console.error('Redis cache invalidate error:', cacheError);
    }

    res.json({ 
      message: 'Profile photo updated successfully', 
      profilePhoto: user.profilePhoto 
    });

  } catch (error) {
    console.error('Update profile photo error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
