import jwt from "jsonwebtoken"

const authenticateToken = (req,res,next)=>{
    const token = req.headers["authorization"];

    if(!token) {
        return res.status(401).json({error:"Unauthorized: Missing token"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    }catch(error){
        console.error('Error in token authentication: ',error);
        return res.status(403).json({error: 'Forbidden: Invalid token'});
    }
}

export default authenticateToken;