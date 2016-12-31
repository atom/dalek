/** @babel */

import fs from 'fs'
import path from 'path'

export default {
  enumerate () {
    if (atom.inDevMode()) {
      return []
    }

    let paths = atom.packages.getAvailablePackagePaths()
    let counts = paths.filter((packagePath) => {
                   if (packagePath.includes('app.asar')) {
                     return true
                   }

                   if (fs.realpathSync(packagePath) !== packagePath) {
                     return false
                   }

                   return true
                 }).map((packagePath) => {
                   return path.basename(packagePath)
                 }).reduce((counts, name) => {
                   if (counts[name]) {
                     counts[name] += 1
                   } else {
                     counts[name] = 1
                   }

                   return counts
                 }, {})

    let names = []
    for (let name of Object.keys(counts)) {
      if (counts[name] > 1) {
        names.push(name)
      }
    }

    return names
  }
}
