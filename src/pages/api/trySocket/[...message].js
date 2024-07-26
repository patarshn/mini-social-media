// src/pages/api/trySocket/[...message].js
import responseWrapper from '@/utils/responseWrapper';
// import { getSocket } from '@/socket';

// const socket = getSocket();

export default async function handler(req, res) {
    let prefix = "trySocket.handler";
    try {
        let { message } = req.query;

        // This part should be executed in the context where Socket.IO server is initialized

        global.io.emit('trySocket', message);

        const data = {
            message
        };
        return responseWrapper({ res, status: 200, message: `${prefix}: Success send message`, error: false, data });
    } catch (error) {
        return responseWrapper({ res, status: 500, message: `${prefix}: ${error.message}`, error: true, error_detail: error });
    }
}
