import { installCaptionPatch, removeCaptionPatch } from '../desktop/rhine-caption-patch.mjs'

const mainLine = 'import "./rhine-window-policy.mjs";'
const begin = '// RHINE_DESKTOP_PRELOAD_BEGIN'
const end = '// RHINE_DESKTOP_PRELOAD_END'

/** Check all files that connect the renderer to the native window policy. */
export function inspectNative(main, preload, policy, expectedPolicy, bridge) {
  const normalize = source => source?.replaceAll('\r\n', '\n').trim()
  const missing = []
  if (!main.includes(mainLine)) missing.push('main process import')
  if (!preload.includes(begin) || !preload.includes(end) || !normalize(preload).includes(normalize(bridge))) missing.push('preload bridge')
  if (normalize(policy) !== normalize(expectedPolicy)) missing.push('window policy file (missing or outdated)')
  if (installCaptionPatch(preload) !== preload) missing.push('native caption patch')
  return { installed: missing.length === 0, missing }
}

function stripBridge(source) {
  const starts = source.split(begin).length - 1, ends = source.split(end).length - 1
  if (starts !== ends || starts > 1) throw new Error('Unexpected RHINE preload markers; no changes made.')
  if (!starts) return source
  const a = source.indexOf(begin), b = source.indexOf(end)
  if (b < a) throw new Error('Invalid RHINE preload marker order; no changes made.')
  return source.slice(0, a) + source.slice(b + end.length)
}

export function patchNative(pkg, main, preload, bridge, remove = false) {
  if (pkg.name !== '@deepseek-ai/dsh-desktop' || pkg.version !== '0.2.0-rc.2')
    throw new Error('Only DSH Desktop 0.2.0-rc.2 is supported. No changes made.')
  if (!main.includes('BrowserWindow') || !preload.includes('contextBridge'))
    throw new Error('Unexpected Desktop entrypoints; no changes made.')
  const clean = stripBridge(preload)
  if (remove) return { main: main.replace(mainLine + '\n', ''), preload: removeCaptionPatch(clean) }
  return {
    main: main.includes(mainLine) ? main : mainLine + '\n' + main,
    preload: installCaptionPatch(clean).trimEnd() + '\n' + begin + '\n' + bridge.trimEnd() + '\n' + end + '\n',
  }
}
