import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import { comparePassword, hashPassword } from "../middleware/hashPass.js";
import UserDb from "../models/user.model.js";
import { userLoginZod, userSignupZod } from "../zod/user.zod.js";


export const updateProfile = async (req,res) => {
  const { profileImg } = req.body;
  const userId = req.user._id;

  try {
    if(!profileImg) {
      return res.status(400).json({
        message: "Profile image link not found",
        success: false
      })
    }

    const updateRes = await cloudinary.uploader.upload(profileImg);
    const updateUser = await UserDb.findByIdAndUpdate(userId, { profileImg: updateRes.secure_url }, { new: true });
    res.status(200).json({
      message: "Profile image upload successfull",
      success: true,
      user: {
        _id: updateUser._id,
        email: updateUser.email,
        name: updateUser.name,
        username: updateUser.username,
        profileImg: updateUser.profileImg,
      }
    })
  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }

}
export const checkUser = (req,res) => {
  try {
    res.status(200).json({
      message: "User fetch successfull",
      success: true,
      user: req.user
    });
  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
export const signup = async (req,res)=> {
  const { email, name, username, password } = req.body;

  try {
    const { success, error } = userSignupZod.safeParse({ email, name, username, password });
    if(!success ) {
      return res.status(401).json({
        message: 'Invalid input data',
        success: false,
        error: error,
      });
    }
    
    const isUserExist = await UserDb.findOne({ email });
    if(isUserExist) {
      return res.status(401).json({
        message: 'User already exists',
        success: false,
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserDb({
      email, name, username, password: hashedPassword,
    });

    if(newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
    
      return res.status(201).json({
        message: 'User created successfully',
        success: true,
        user: {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          username: newUser.username,
          profileImg: newUser.profileImg,
        }
      });
    } else {
      return res.status(401).json({
        message: 'User creation failed',
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
export const login = async (req,res) => {
  const { email, password } = req.body;

  try {
    const { success, error } = userLoginZod.safeParse({ email, password });
    if(!success) {
      return res.status(401).json({
        message: 'Invalid input data',
        success: false,
        error: error,
      });
    }

    const user = await UserDb.findOne({ email });
    if(!user) {
      return res.status(400).json({
        message: "User not found / Try to SignUp first",
        success: false
      })
    }

    const checkPass = await comparePassword(password, user.password);
    if(checkPass) {
      generateToken(user._id, res);

      return res.status(201).json({
        message: 'User login successfully',
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          username: user.username,
          profileImg: user.profileImg,
        }
      });
    } else {
      return res.status(400).json({
        message: "Password is incorrect",
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
export const logout = (req,res)=> {
  try {
    res.cookie('jwt', "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfull",
      success: true
    })
  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
