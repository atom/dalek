/** @babel */

export default {
  activate () {
    atom.packages.onDidActivateInitialPackages(() => {
      const dalek = require('./dalek')

      let duplicates = dalek.enumerate()
      if (duplicates.length > 0) {
        atom.notifications.addWarning(formatMessage(duplicates), {dismissable: true})
      }
    })
  }
}

function formatMessage (duplicates) {
  let message = 'You have the following built-in packages installed as community packages:\n\n'

  for (let duplicate of duplicates) {
    message += `* ${duplicate}\n`
  }

  message += '\nSee https://github.com/atom/dalek for how this causes problems and instructions on how to correct the situation'

  return message
}
