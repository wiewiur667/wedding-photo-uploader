import { Buffer } from 'node:buffer'

export default defineEventHandler(async (event) => {
  const storage = useStorage('fs')
  const base = 'root:data'
  const keys = await storage.keys(base)
  const files = await storage.getItems(keys)

  const result = files.map(file => ({
    key: file.key,
    value: Buffer.from(file.value).toString('base64'),
  }))
  return result
})
