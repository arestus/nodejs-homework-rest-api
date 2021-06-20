const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateTokenVerify = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken });
};

const updateUserSubscription = async (userId, body) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { ...body },
    { new: true }
  );
  return result;
};

const updateAvatar = async (id, avatar, idCloudAvatar = null) => {
  return await User.findByIdAndUpdate({ _id: id }, { avatar, idCloudAvatar });
};

module.exports = {
  findById,
  findByEmail,
  findByVerifyToken,
  create,
  updateToken,
  updateTokenVerify,
  updateUserSubscription,
  updateAvatar,
};
