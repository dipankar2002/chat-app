import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import MessageDb from "../models/message.model.js";
import UserDb from "../models/user.model.js";

export const getUsers = async (req,res) => {
  const userId = req.user._id;
  try {
    const users = await UserDb.find({ _id: { $ne: userId}}).select('-password');
    if(!users) {
      return res.status(400).json({
        message: "Users not found",
        success: false
      })
    }
    
    res.status(200).json({
      message: "Users found successfully",
      success: true,
      users: users
    })
    
  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
export const getMessage = async (req,res) => {
  const { id:userToChatId } = req.params;
  const myId = req.user._id;

  try {
    const message = await MessageDb.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId
        }, {
          senderId: userToChatId,
          receiverId: myId
        }
      ]
    })
    if(!message) {
      return res.status(400).json({
        message: 'No message found from the DB',
        success: false
      })
    }
    res.status(200).json({
      message: 'Messsage found',
      success: true,
      messagesData: message
    })
  } catch(error) {
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: error,
    });
  }
}
export const sendMessage = async (req,res) => {
  const { id:userToSendId } = req.params;
  const myId = req.user._id;
  const { text, image } = req.body;

  try {
    let imageUrl;
    if(image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }


    const sendMessage = new MessageDb({
      senderId: myId,
      receiverId: userToSendId,
      text: text ?? null,
      image: imageUrl ?? null
    });

    if(sendMessage) {
      await sendMessage.save();

      const receiverSocketId = getReceiverSocketId(userToSendId);
      if(receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', sendMessage)
      }

      return res.status(201).json({
        message: 'Message created successfully',
        success: true,
        messageData: {
          _id: sendMessage._id,
          senderId: sendMessage.senderId,
          receiverId: sendMessage.receiverId,
          text: sendMessage.text,
          image: sendMessage.image,
          createdAt: sendMessage.createdAt,
          updatedAt: sendMessage.updatedAt, 
        }
      });
    } else {
      return res.status(400).json({
        message: 'Message creation failed',
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