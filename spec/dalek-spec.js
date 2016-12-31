/** @babel */

const dalek = require('../lib/dalek')

describe('dalek', function () {
  describe('enumerate', function () {
    beforeEach(function () {
      atom.devMode = false
      spyOn(atom.packages, 'getAvailablePackagePaths').andReturn([
        '/Users/username/.atom/packages/advanced-open-file',
        '/Users/username/.atom/packages/bookmarks',
        '/Applications/Atom.app/Contents/Resources/app.asar/node_modules/bookmarks'
      ])
    })

    it('returns a list of duplicate names', function () {
      expect(dalek.enumerate()).toEqual(['bookmarks'])
    })

    describe('when in dev mode', function () {
      beforeEach(function () {
        atom.devMode = true
      })

      it('always returns an empty list', function () {
        expect(dalek.enumerate()).toEqual([])
      })
    })
  })
})
