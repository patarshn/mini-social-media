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
        case 'POST':
            verifyToken(req,res)
            await dbConnect();
            
            try {
                const status = req.body.status;
                const usernameToFollow = req.body.username;
                const authUserID = req.auth.id;

                if (usernameToFollow == req.auth.username) return responseWrapper({ res, status: 400, message: `${prefix}: Can't follow self`, error: true })

                const userToFollow = await User.findOne({ username: usernameToFollow });
                if (!userToFollow) return responseWrapper({res, status: 400, message: `${prefix}: Username not found`, error: false})

                if (status){                    
                    await User.findByIdAndUpdate(authUserID, { $addToSet: { following: userToFollow._id } });
                    await User.findByIdAndUpdate(userToFollow._id, { $addToSet: { followers: authUserID } });
                }else{
                    await User.findByIdAndUpdate(authUserID, { $pull: { following: userToFollow._id } });
                    await User.findByIdAndUpdate(userToFollow._id, { $pull: { followers: authUserID } });
                }

                return responseWrapper({ res, status: 200, message: `${prefix}: Success ${status ? 'Follow' : 'Unfollow'}`, error: false })
            } catch (error) {
                return responseWrapper({ res, status: 500, message: `${prefix}: ${error.message}`, error: true , error_detail: error})
            }
        default:
            return responseWrapper({ res, status: 405, message: `${prefix}: Methot not allowed`, error: true })
    }
}
