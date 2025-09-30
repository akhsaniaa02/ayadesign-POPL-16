const User = require('../models/userModels');
const createError = require('../utils/appError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { JWT_KEY } = require('../utils/constant');

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400);
      return next(new createError('User already exists', 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword
    });
    const token = jwt.sign({ _id: newUser._id }, JWT_KEY, {
      expiresIn: '90d'
    });
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
        cart: newUser.cart
      }
    });
  } catch (error) {
    next(error);
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return next(new createError('User not found', 404));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401);
      return next(new createError('Invalid email or password', 401));
    }
    const token = jwt.sign({ _id: user._id }, JWT_KEY, {
      expiresIn: '90d'
    });
    res.status(200).json({
      status: "success",
      token,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        cart: user.cart
      }
    });
  } catch (error) {
    next(error);
  }
}

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

exports.uploadImage = async (req, res) => {
  try {
    const userId = req.user._id; // Pastikan Anda mendapatkan userId dengan benar
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded');
    }

    // Simpan sementara URL gambar baru
    const newImage = {
      url: `/uploads/${file.filename}`,
      public_id: file.filename
    };
    res.json(newImage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Image upload failed');
  }
};



exports.updateProfileController = async (req, res, next) => {
  try {
    const { image, name, password } = req.body;
    const userId = req.user._id;

    // Prepare data to update
    const dataToUpdate = {};
    if (image) {
      dataToUpdate.image = image;
    }
    if (name) {
      dataToUpdate.name = name;
    }
    

    // Find user by id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle image deletion if URL changes
    if (dataToUpdate.image && user.image && user.image.url !== dataToUpdate.image.url) {
      if (user.image.url) {
        const oldFilePath = path.join(__dirname, '../../client/public/uploads', path.basename(user.image.url));
        if (fs.existsSync(oldFilePath)) {
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error('Failed to delete old image', err);
              // Handle error here, if needed
            } else {
              console.log('Old image deleted successfully');
            }
          });
        }
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, { new: true });

    // Respond with updated user profile
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate Username Error",
      });
    }
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id; // Pastikan Anda mendapatkan userId dengan benar
    const { oldPassword, newPassword } = req.body;

    // Temukan pengguna berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Periksa apakah password lama cocok
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    // Hash password baru dan simpan perubahan
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};