/** @babel */

const fs = require('fs')
const path = require('path')

module.exports = {
  async enumerate () {
    const resourcePath = atom.getLoadSettings().resourcePath
    if (atom.inDevMode()) {
      return []
    }

    const duplicatePackages = []
    const names = atom.packages.getAvailablePackageNames()
    for (let name of names) {
      if (atom.packages.isBundledPackage(name)) {
        const packagePath = atom.packages.resolvePackagePath(name)
        const realPath = await this.realpath(packagePath)

        if (!packagePath.includes(resourcePath) && packagePath === realPath) {
          duplicatePackages.push(name)
        }
      }
    }

    return duplicatePackages
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
