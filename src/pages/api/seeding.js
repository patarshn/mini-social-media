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
        case 'POST':
            await dbConnect(); 
            
            try {
                
                const username = req.body.username;

                const user = await User.findOne({username});
                if (!user){
                    return responseWrapper({res, status: 400, message: `${prefix}: can't find user`, error: true})
                }

                req.auth = {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                }

                const story = new Story({
                    content: req.body.content,
                    username: req.auth.username,
                });
                
                await story.save()
                const data = story

                return responseWrapper({res, status: 200, message: `${prefix}: Success Add Story`, error: false, data})
            } catch (error) {
                return responseWrapper({res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error})
            }
        default :
            return responseWrapper({res, status: 405, message: `${prefix}: Methot not allowed`, error: true})
    }
}
