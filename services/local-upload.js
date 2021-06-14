const jimp = require("jimp");
const createFolderIsNotExist = require("../helpers/create-folder");
const path = require("path");
const fs = require("fs/promises");

class UploadAvatarService {
  constructor(folderAvatars) {
    this.folderAvatars = folderAvatars;
  }
  async transformAvatar(pathFile) {
    const pic = await jimp.read(pathFile);
    await pic
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(pathFile);
  }
  async saveAvatar({ idUser, file }) {
    await this.transformAvatar(file.path);
    const folderUserAvatar = path.join(this.folderAvatars, idUser);
    await createFolderIsNotExist(folderUserAvatar);
    await fs.rename(file.path, path.join(folderUserAvatar, file.filename));
    return path.normalize(path.join(idUser, file.filename));
  }
}

module.exports = UploadAvatarService;
