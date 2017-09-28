/** @babel */

const assert = require('assert')
const fs = require('fs')
const sinon = require('sinon')

const dalek = require('../lib/dalek')

describe('dalek', function () {
  describe('enumerate', function () {
    let availablePackages = {}
    let realPaths = {}
    let bundledPackages = []
    let sandbox = null

    beforeEach(function () {
      availablePackages = {
        'an-unduplicated-installed-package': '/Users/username/.atom/packages/an-unduplicated-installed-package',
        'duplicated-package': '/Users/username/.atom/packages/duplicated-package',
        'unduplicated-package': `${atom.getLoadSettings().resourcePath}/node_modules/unduplicated-package`
      }

      atom.devMode = false
      bundledPackages = ['duplicated-package', 'unduplicated-package']
      sandbox = sinon.sandbox.create()
      sandbox.stub(dalek, 'realpath').callsFake((filePath) => Promise.resolve(realPaths[filePath] || filePath))
      sandbox.stub(atom.packages, 'isBundledPackage').callsFake((packageName) => { return bundledPackages.includes(packageName) })
      sandbox.stub(atom.packages, 'getAvailablePackageNames').callsFake(() => Object.keys(availablePackages))
      sandbox.stub(atom.packages, 'resolvePackagePath').callsFake((packageName) => availablePackages[packageName])
    })

    afterEach(function () {
      sandbox.restore()
    })

    it('returns a list of duplicate names', async function () {
      assert.deepEqual(await dalek.enumerate(), ['duplicated-package'])
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
        realPaths['/Users/username/.atom/packages/duplicated-package'] = '/Users/username/duplicated-package'
      })

      it('is not included in the list of duplicate names', async function () {
        assert.deepEqual(await dalek.enumerate(), [])
      })
    })
  })
})
