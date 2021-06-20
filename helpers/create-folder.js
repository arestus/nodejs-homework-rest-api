const fs = require('fs/promises')
const path = require('path')
const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(path.join(process.cwd(), folder)))) {
    const folders = folder.split('/')
    let currentFolder = process.cwd()
    let count = 0
    do {
      currentFolder = path.join(currentFolder, folders[count])
      await fs.mkdir(path.join(currentFolder))
      count++
    } while (count < folders.length)
  }
}

module.exports = createFolderIsNotExist
