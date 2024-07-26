import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import responseWrapper from '@/utils/responseWrapper';

const path = require('path');

export default async function handler(req, res) {
    let prefix = path.basename(__filename) + `.handler.${req.method}`
    switch(req.method){
        case 'POST':
            await dbConnect();
            
            try {
                const { email, password } = req.body;
                console.log(email, password)
                const user = await User.findOne({ email });
                console.log(user.password)
                if (!user) return responseWrapper({res, status: 401, message: `${prefix}: Invalid Credentials - 001`, error: false})
                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) return responseWrapper({res, status: 401, message: `${prefix}: Invalid Credentials - 002`, error: false})
                const userData = {
                    id: user._id,
                    username: user.username,
                    email: user.email 
                }
                const token = jwt.sign({
                    data : {
                        id: user._id,
                        username: user.username,
                        email: user.email 
                    },
                }, process.env.JWT_SECRET, { expiresIn: '24h' });

                const data = {
                    jwt: token,
                    ...userData
                }
                return responseWrapper({res, status: 200, message: `${prefix}: Success Login`, error: false, data})
            } catch (error) {
                return responseWrapper({res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error})
            }
        default :
            return responseWrapper({res, status: 405, message: `${prefix}: Methot not allowed`, error: true})
    }
}
