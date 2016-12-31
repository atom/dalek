/** @babel */

const fs = require('fs')

const dalek = require('../lib/dalek')

describe('dalek', function () {
  describe('enumerate', function () {
    let realPaths = {}

    beforeEach(function () {
      atom.devMode = false

      spyOn(fs, 'realpathSync').andCallFake((filepath) => {
        if (realPaths[filepath]) {
          return realPaths[filepath]
        }

        return filepath
      })

      spyOn(atom.packages, 'getAvailablePackagePaths').andReturn([
        '/Users/username/.atom/packages/advanced-open-file',
        '/Users/username/.atom/packages/bookmarks',
        '/Users/username/.atom/packages/foo',
        '/Applications/Atom.app/Contents/Resources/app.asar/node_modules/bookmarks',
        '/Applications/Atom.app/Contents/Resources/app.asar/node_modules/foo'
      ])
    })

    it('returns a list of duplicate names', function () {
      expect(dalek.enumerate()).toEqual(['bookmarks', 'foo'])
    })

    describe('when in dev mode', function () {
      beforeEach(function () {
        atom.devMode = true
      })

      it('always returns an empty list', function () {
        expect(dalek.enumerate()).toEqual([])
      })
    })

    describe('when a package is symlinked into the package directory', function () {
      beforeEach(function () {
        realPaths['/Users/username/.atom/packages/bookmarks'] = '/Users/username/bookmarks'
      })

      it('is not included in the list of duplicate names', function () {
        expect(dalek.enumerate()).toEqual(['foo'])
      })
    })
  })
})
