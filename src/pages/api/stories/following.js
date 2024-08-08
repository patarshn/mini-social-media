import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import responseWrapper from '@/utils/responseWrapper';
import { verifyToken } from '@/middleware/authMiddleware';
import Story from '@/models/Stories';

const path = require('path');

export default async function handler(req, res) {
    let prefix = path.basename(__filename) + `.handler.${req.method}`
    switch(req.method){
        case 'GET':
            verifyToken(req, res)
            await dbConnect();
            
            try {
                const userId = req.auth.id;
                const user = await User.findById(userId).populate('following', '_id username');
                user.following.unshift({
                    _id: user._id,
                    username: user.username,
                })
                
                if (user.length > 0){
                    return responseWrapper({res, status: 200, message: `${prefix}: Success Get Stories`, error: false, data : []})
                }
                const followingUsername = user.following.map(followingUser => followingUser.username);

                const stories = await Story.find({ username: { $in: followingUsername } }).sort({ createdAt: -1 });
                
                const groupedStories = user.following.map(followingUser => {
                    return {
                      _id: followingUser._id,
                      username: followingUser.username,
                      email: followingUser.email,
                      stories: stories.filter(story => story.username === followingUser.username)
                    };
                  });
                
                const data = groupedStories;  
                return responseWrapper({res, status: 200, message: `${prefix}: Success Get Stories`, error: false, data})
            } catch (error) {
                return responseWrapper({res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error})
            }
        default :
            return responseWrapper({res, status: 405, message: `${prefix}: Methot not allowed`, error: true})
    }
}
