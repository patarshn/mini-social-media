import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import responseWrapper from '@/utils/responseWrapper';
import { verifyToken } from '@/middleware/authMiddleware';
import Story from '@/models/Stories';
import { getSocket } from '@/socket';

const path = require('path');
const socket = getSocket()
export default async function handler(req, res) {
    let prefix = path.basename(__filename) + `.handler.${req.method}`
    switch(req.method){
        case 'POST':
            verifyToken(req, res)
            await dbConnect(); 
            
            try {
                
                const story = new Story({
                    content: req.body.content,
                    username: req.auth.username,
                });
                
                await story.save()
                const data = story

                const user = await User.findById(req.auth.id).select('followers').exec();
                console.log(user)

                // user.followers.forEach(follower => {
                //     console.log(follower._id)
                //     global.io.to(follower._id).emit('new-story-following', data);
                // });

                // global.io.to("66a31a6b1eca0b25ee195540").emit('new-story', data);

                // global.io.emit('new-story', data);

                socket.emit('new-story-following', {
                    data: data,
                    followers: user.followers}
                )
                

                return responseWrapper({res, status: 200, message: `${prefix}: Success Add Story`, error: false, data})
            } catch (error) {
                return responseWrapper({res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error})
            }
        default :
            return responseWrapper({res, status: 405, message: `${prefix}: Methot not allowed`, error: true})
    }
}
