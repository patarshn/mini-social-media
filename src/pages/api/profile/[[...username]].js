import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import responseWrapper from '@/utils/responseWrapper';
import { verifyToken } from '@/middleware/authMiddleware';

const path = require('path');

export default async function handler(req, res) {
    let prefix = path.basename(__filename) + `.handler.${req.method}`
    switch(req.method){
        case 'GET':
            verifyToken(req, res)
            await dbConnect();

            
            
            try {
                const authUsername = req.auth.username;
                const searchUsername = req.query.username ?? authUsername;
                const user = await User.findOne({ username: searchUsername });

                if (!user) return responseWrapper({res, status: 400, message: `${prefix}: Username not found`, error: false})
                
                const data = {
                    username : user.username,
                    email : user.email,
                    img_profile : "/profile.webp",
                    img_background : "/background.webp",
                    follower : 100,
                    following : 100,
                    is_follow : null,
                }

                if ( authUsername != searchUsername ){
                    // chech follower
                } 

                return responseWrapper({res, status: 200, message: `${prefix}: Success Get Profile`, error: false, data})
            } catch (error) {
                return responseWrapper({res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error})
            }
        default :
            return responseWrapper({res, status: 405, message: `${prefix}: Methot not allowed`, error: true})
    }
}
