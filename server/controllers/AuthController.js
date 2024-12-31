import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { createToken } from "../utils/TokenManager.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const COOKIE_NAME = "AuthToken";


export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

export const googleSignin = async(req, res, next) =>{
    const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, avatar: picture, googleId });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token: jwtToken, user });
  } catch (error) {
    res.status(400).json({ message: "Invalid Google Token" });
  }
}

export const signin = async (req, res, next) => {
    try {
        const { form } = req.body;

        const email = form.email;
        const password = form.password;

        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(401).send("User not registered");
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password);

        if (!checkPassword) {
            return res.status(400).send("Password is incorrect");
        }


        const token = createToken(checkUser._id.toString(), checkUser.email, "7d");

        return res.status(200).json({
            message: "OK",
            name: checkUser.name,
            email: checkUser.email,
            token: token
        });
    } catch (error) {
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};

export const signup = async (req, res, next) => {
    try {
        const { form } = req.body;

        const name = form.name;
        const email = form.email;
        const password = form.password;

        const isExisting = await User.findOne({ email });

        if (isExisting) {
            return res.status(400).json({ message: "User with this email ID already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const user1 = new User({ name, email, password: hashedPassword });

        await user1.save();

        const token = createToken(user1._id.toString(), user1.email, "7d");

        return res.status(201).json({
            message: "OK",
            name: user1.name,
            email: user1.email,
        });
    } catch (error) {
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};