import test from 'node:test'
import assert from 'node:assert/strict'
import { inspectNative, patchNative } from '../scripts/native-release-core.mjs'
const pkg = { name: '@deepseek-ai/dsh-desktop', version: '0.2.0-rc.2' }
const main = 'const BrowserWindow = {};\n// another local patch\n'
const preload = 'const contextBridge = {};\nconst color = nativeColor(style.backgroundColor);\nconst options = { attributeFilter: ["data-ds-dark-theme", "style"] };\n'
test('release native patch installs, updates and removes without truncating later local patches', () => {
  const installed = patchNative(pkg, main, preload, 'const firstBridge = true;')
  const suffix = '\n// unrelated patch added after RHINE\n'
  const updated = patchNative(pkg, installed.main, installed.preload + suffix, 'const nextBridge = true;')
  assert.ok(updated.preload.includes(suffix.trim()))
  assert.ok(!updated.preload.includes('firstBridge'))
  assert.equal(updated.main.split('import "./rhine-window-policy.mjs";').length, 2)
  const removed = patchNative(pkg, updated.main, updated.preload, '', true)
  assert.equal(removed.main, main)
  assert.ok(removed.preload.includes('nativeColor(style.backgroundColor)'))
  assert.ok(removed.preload.includes(suffix.trim()))
  assert.ok(!removed.preload.includes('nextBridge'))
})
test('release patch refuses mismatched versions, entrypoints and incomplete markers before writing', () => {
  assert.throws(() => patchNative({ ...pkg, version:'0.3.0' },main,preload,''),/Only DSH/)
  assert.throws(() => patchNative(pkg,'different build',preload,''),/entrypoints/)
  assert.throws(() => patchNative(pkg,main,preload+'// RHINE_DESKTOP_PRELOAD_BEGIN',''),/markers/)
  assert.throws(() => patchNative(pkg,main,preload.replace('style.backgroundColor','style.color'),''),/entrypoint/)
})

test('detects and repairs a lost main import even when the preload and policy remain installed', () => {
  const bridge = 'const bridge = true;', policy = 'const policy = true;'
  const installed = patchNative(pkg, main, preload, bridge)
  const broken = inspectNative(main, installed.preload, policy, policy, bridge)
  assert.equal(broken.installed, false)
  assert.deepEqual(broken.missing, ['main process import'])
  const repaired = patchNative(pkg, main, installed.preload + '\n// later patch\n', bridge)
  assert.equal(inspectNative(repaired.main, repaired.preload, policy, policy, bridge).installed, true)
  assert.ok(repaired.preload.includes('// later patch'))
  assert.deepEqual(patchNative(pkg, repaired.main, repaired.preload, bridge), repaired)
})

test('checks both bridge halves, the installed policy version and caption patch', () => {
  const bridge = 'const bridge = true;', policy = 'const policy = true;'
  const installed = patchNative(pkg, main, preload, bridge)
  for (const actual of [undefined, 'const oldPolicy = true;']) {
    assert.deepEqual(inspectNative(installed.main, installed.preload, actual, policy, bridge).missing, ['window policy file (missing or outdated)'])
  }
  assert.deepEqual(inspectNative(installed.main, preload, policy, policy, bridge).missing, ['preload bridge', 'native caption patch'])
  assert.equal(inspectNative(installed.main, installed.preload.replaceAll('\n', '\r\n'), policy + '\r\n', policy, bridge).installed, true)
})
