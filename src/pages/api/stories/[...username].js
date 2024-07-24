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
                const searchUsername = req.query.username;
                const stories = await Story.find({username: searchUsername})
                if (!stories) return responseWrapper({res, status: 500, message: `${prefix}: Error database`, error: false})
                
                const data = stories

                return responseWrapper({res, status: 200, message: `${prefix}: Success Get Stories`, error: false, data})
            } catch (error) {
                return responseWrapper({res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error})
            }
        default :
            return responseWrapper({res, status: 405, message: `${prefix}: Methot not allowed`, error: true})
    }
}
