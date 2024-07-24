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
                const searchUsername = Array.isArray(req.query.username) ? req.query.username[0] : "";

                const users = await User.where("username").ne(authUsername)
                    .limit(10)
                    .find({ username: {
                        $regex: searchUsername
                    } });

                if (!users) return responseWrapper({res, status: 500, message: `${prefix}: Error database`, error: false})
                
                const data = []
                users.forEach(user => {
                    data.push({
                        username: user.username,
                        img_profile : "/profile.webp"
                    })
                });

                

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
