/** @babel */

export default {
  activate () {
    atom.packages.onDidActivateInitialPackages(() => {
      const dalek = require('./dalek')
      const Grim = require('grim')

      let duplicates = dalek.enumerate()
      for (let duplicate of duplicates) {
        Grim.deprecate(
          `You have the core package "${duplicate}" installed as a community package. See https://github.com/atom/dalek for how this causes problems and instructions on how to correct the situation.`,
          { packageName: duplicate }
        )
      }
    })
  }
}
