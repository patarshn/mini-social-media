function responseWrapper({res, status, error, message, data}){
    let resBody = { error: error , message: message}
    if (data) resBody.data = data
    console.log("responseWrapper: ",resBody)
    return res.status(status).json(resBody);
}

export default responseWrapper;