import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next)=>{
    let apiKey;
    const apiKeys = ['GPS_KEY_123456789']; // to be get by Database

    if(
        (req.headers.apikey ?? false) &&
        req.headers.apikey.startsWith("GPS_KEY_")
    ){
        if(apiKeys.includes(req.headers.apikey))
            next()
        else
            res.status(401).json({"message" : "API KEY NOT VALID!"})
    }else{
        res.status(403).json({"message" : "API KEY NOT FOUND!"})
    }

});

export { protect };