import Jwt from "jsonwebtoken";
import { COOKIE_NAME } from './Constants.js'


export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = Jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn
    });
    return token;
};
export const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[`${COOKIE_NAME}`];
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not recieved" });
    }
    return new Promise((resolve, reject) => {
        return Jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                reject(err.message);
                return res.status(401).json({ message: "Token Expired" });
            }
            else {
                console.log("Token verification successful");
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        });
    });
};