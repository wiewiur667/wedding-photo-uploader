export default defineEventHandler(async (event) => {
  const storage = useStorage('fs')
  const base = 'root:data'
  const keys = await storage.keys(base)
  const files = await storage.getItems(keys)
})
