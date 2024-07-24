import responseWrapper from '@/utils/responseWrapper';
import jwt from 'jsonwebtoken';

const path = require('path');

export const verifyToken = (req, res, next) => {
    let prefix = path.basename(__filename) + `.verifyToken`
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) return responseWrapper({res, status: 401, message: `${prefix}: Unauthorization - No Token Provided`, error: true})
    const tokenSplit = bearerToken.split(" ")
    if ( tokenSplit.length != 2) return responseWrapper({res, status: 401, message: `${prefix}: Unauthorization - Invalid Token`, error: true})
    const token = tokenSplit[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = decoded.data
        return
    } catch (error) {
        return responseWrapper({res, status: 401, message: `${prefix}: Unauthorization - Failed Auth Token`, error: true})
    }
};
