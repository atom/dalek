/** @babel */

const fs = require('fs')
const path = require('path')

module.exports = {
  async enumerate () {
    if (atom.inDevMode()) {
      return []
    }

    const duplicatePackages = []
    const names = atom.packages.getAvailablePackageNames()
    for (let name of names) {
      if (atom.packages.isBundledPackage(name)) {
        const isApmInstalled = await this.isPackageApmInstalled(name)
        if (isApmInstalled) {
          duplicatePackages.push(name)
        }
      }
    }

    return duplicatePackages
  },

  async isPackageApmInstalled (name) {
    const availablePackagePaths = atom.packages.getPackageDirPaths()

    for (let packagePath of availablePackagePaths) {
      const candidate = path.join(packagePath, name)

      if (fs.existsSync(candidate)) {
        const realPath = await this.realpath(candidate)
        return realPath === candidate
      }
    }

    return false
  },

  realpath (path) {
    return new Promise((resolve, reject) => {
      fs.realpath(path, function (error, realpath) {
        if (error) {
          reject(error)
        } else {
          resolve(realpath)
        }
      })
    })
  }
}
