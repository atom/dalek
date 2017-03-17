/** @babel */

const assert = require('assert')
const fs = require('fs')
const sinon = require('sinon')

const dalek = require('../lib/dalek')

describe('dalek', function () {
  describe('enumerate', function () {
    let realPaths = {}
    let sandbox = null

    beforeEach(function () {
      atom.devMode = false
      sandbox = sinon.sandbox.create()
      sandbox.stub(dalek, 'realpath').callsFake((filePath) => Promise.resolve(realPaths[filePath] || filePath))
      sandbox.stub(atom.packages, 'getAvailablePackagePaths').callsFake(() => [
        '/Users/username/.atom/packages/advanced-open-file',
        '/Users/username/.atom/packages/bookmarks',
        '/Users/username/.atom/packages/foo',
        '/Applications/Atom.app/Contents/Resources/app.asar/node_modules/bookmarks',
        '/Applications/Atom.app/Contents/Resources/app.asar/node_modules/foo'
      ])
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('returns a list of duplicate names', async function () {
      assert.deepEqual(await dalek.enumerate(), ['bookmarks', 'foo'])
    })

    describe('when in dev mode', function () {
      beforeEach(function () {
        atom.devMode = true
      })

      it('always returns an empty list', async function () {
        assert.deepEqual(await dalek.enumerate(), [])
      })
    })

    describe('when a package is symlinked into the package directory', async function () {
      beforeEach(function () {
        realPaths['/Users/username/.atom/packages/bookmarks'] = '/Users/username/bookmarks'
      })

      it('is not included in the list of duplicate names', async function () {
        assert.deepEqual(await dalek.enumerate(), ['foo'])
      })
    })
  })
})
