import jwt from "jsonwebtoken";

function generateToken(id)
{
    const token = jwt.sign( {id} , process.env.JWT_SECRET_KEY , {expiresIn : "1d"});
    return token;
}

export default generateToken;