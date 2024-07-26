import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import responseWrapper from '@/utils/responseWrapper';
import { verifyToken } from '@/middleware/authMiddleware';
import path from 'path';

export default async function handler(req, res) {
    let prefix = path.basename(__filename) + `.handler.${req.method}`
    
    switch(req.method){
        case 'GET':
            verifyToken(req, res);
            await dbConnect();

            try {
                const authUsername = req.auth.username;
                const searchUsername = req.query.username ?? authUsername;

                const user = await User.findOne({ username: searchUsername }).populate('following followers');

                if (!user) return responseWrapper({ res, status: 400, message: `${prefix}: Username not found`, error: false });
                
                const isFollow = authUsername !== searchUsername
                    ? await User.findOne({ username: authUsername, following: user._id }) != null
                    : null;

                const data = {
                    username: user.username,
                    email: user.email,
                    img_profile: "/profile.webp", // Replace with actual user data
                    img_background: "/background.webp", // Replace with actual user data
                    follower: user.followers.length,
                    following: user.following.length,
                    is_follow: isFollow,
                    is_same_user: authUsername == searchUsername
                };

                return responseWrapper({ res, status: 200, message: `${prefix}: Success Get Profile`, error: false, data });
            } catch (error) {
                return responseWrapper({ res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error });
            }
        default:
            return responseWrapper({ res, status: 405, message: `${prefix}: Method not allowed`, error: true });
    }
}
