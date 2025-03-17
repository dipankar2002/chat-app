import jwt from 'jsonwebtoken';
import UserDb from '../models/user.model.js';

export const authMiddle = async (req,res,next) => {
  try {
    const token = req.cookies .jwt;
    if(!token) {
      return res.status(411).json({
        message: "Token invalid",
        success: false
      })
    }
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    if(!decode) {
      return res.status(400).json({
        message: "Token is wrong",
        success: false
      })
    }

    const user = await UserDb.findById(decode.userId).select('-password');
    if(user) {
      req.user = user,
      next();
    } else {
      return res.status(400).json({
        message: "user not found",
        success: false
      })
    }

  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}