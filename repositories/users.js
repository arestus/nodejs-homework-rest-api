const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.findByIdAndUpdate({ _id: id }, { token });
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
  create,
  updateToken,
  updateUserSubscription,
  updateAvatar,
};
