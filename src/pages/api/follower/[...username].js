import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import responseWrapper from '@/utils/responseWrapper';
import { verifyToken } from '@/middleware/authMiddleware';

const path = require('path');

export default async function handler(req, res) {
    let prefix = path.basename(__filename) + `.handler.${req.method}`
    switch (req.method) {
        case 'GET':
            verifyToken(req, res)
            await dbConnect();

            try {
                const searchUsername = req.query.username;

                if (!searchUsername) return responseWrapper({ res, status: 500, message: `${prefix}: Username required`, error: false })

                const users = await User.findOne({username: searchUsername}).populate('followers', '_id username email');
                if (!users) return responseWrapper({ res, status: 500, message: `${prefix}: Error database`, error: false })

                const data = []
                users.followers.forEach(user => {
                    data.push({
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        img_profile: "/profile.webp"
                    })
                });

                return responseWrapper({ res, status: 200, message: `${prefix}: Success Get follower`, error: false, data })
            } catch (error) {
                return responseWrapper({ res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error })
            }
        default:
            return responseWrapper({ res, status: 405, message: `${prefix}: Methot not allowed`, error: true })
    }
}
