import express, { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Cấu hình multer với giới hạn kích thước
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    }
});

// Kiểm tra xem có đủ thông tin cấu hình không
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing Cloudinary credentials');
    process.exit(1);
}

// Cấu hình Cloudinary với timeout
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60000 // Tăng timeout lên 60 giây
});

const router = express.Router();

router.post('/upload', upload.single('image'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        // Kiểm tra mime type
        if (!req.file.mimetype.startsWith('image/')) {
            res.status(400).json({ error: 'File must be an image' });
            return;
        }

        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
            {
                folder: 'avatars',
                resource_type: 'auto',
                timeout: 60000, // Timeout cho upload request
                transformation: [
                    { width: 500, height: 500, crop: 'limit' }, // Giới hạn kích thước ảnh
                    { quality: 'auto' } // Tự động tối ưu chất lượng
                ]
            }
        );

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed. Please try again.' });
    }
});

export default router; 