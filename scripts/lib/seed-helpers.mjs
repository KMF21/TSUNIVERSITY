// Shared helpers for the content seeders in /scripts.
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

export const key = () => randomBytes(6).toString('hex')

// _sanityAsset only resolves reliably with an ABSOLUTE file:// path, so it is
// computed from this file's location and works from any working directory.
export const assetPath = (name) => `file://${fileURLToPath(new URL(`../assets/${name}`, import.meta.url))}`
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
