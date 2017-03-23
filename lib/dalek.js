/** @babel */

const fs = require('fs')
const path = require('path')

module.exports = {
  async enumerate () {
    const resourcePath = atom.getLoadSettings().resourcePath
    if (atom.inDevMode()) {
      return []
    }

    const paths = atom.packages.getAvailablePackagePaths()
    const countsByPackageName = new Map()
    for (let i = 0; i < paths.length; i++) {
      const packagePath = paths[i]
      const realPath = await this.realpath(packagePath)
      if (packagePath.includes(resourcePath) || realPath === packagePath) {
        const packageName = path.basename(packagePath)
        const counts = countsByPackageName.get(packageName) || 0
        countsByPackageName.set(packageName, counts + 1)
      }
    }

    const duplicatePackages = []
    for (const [packageName, count] of countsByPackageName) {
      if (count > 1) {
        duplicatePackages.push(packageName)
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
