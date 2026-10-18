// Shared helpers for the content seeders in /scripts.
import { fileURLToPath, pathToFileURL } from 'node:url'
import { randomBytes } from 'node:crypto'

export const key = () => randomBytes(6).toString('hex')

// _sanityAsset needs an ABSOLUTE file URL. pathToFileURL yields file:///home/…
// on macOS/Linux and file:///D:/… on Windows (a bare file://D:/… is misread
// as a host name), and works from any working directory.
export const assetPath = (name) => pathToFileURL(assetFsPath(name)).href
export const assetFsPath = (name) => fileURLToPath(new URL(`../assets/${name}`, import.meta.url))

export const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
  markDefs: [],
})

export const image = (name, alt) => ({ _type: 'image', alt, _sanityAsset: `image@${assetPath(name)}` })
export const file = (name) => ({ _type: 'file', _sanityAsset: `file@${assetPath(name)}` })

export const ref = (id) => ({ _type: 'reference', _ref: id })
export const withKeys = (items) => items.map((item) => ({ _key: key(), ...item }))
