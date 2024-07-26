import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import responseWrapper from '@/utils/responseWrapper';

const path = require('path');
let prefix = path.basename(__filename);

export default async function handler(req, res) {
    let prefix = path.basename(__filename) + `.handler.${req.method}`
    switch(req.method){
        case 'POST':
            await dbConnect();
            
            try {  
                const { username, email, password } = req.body;
                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new User({ username, email, password: hashedPassword });

                await user.save();
                return responseWrapper({res, status: 200, message: `${prefix}: Success Register`, error: false})
            } catch (error) {
                return responseWrapper({res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error})
            }
        default :
            return responseWrapper({res, status: 405, message: `${prefix}: Methot not allowed`, error: true})
    }
}
