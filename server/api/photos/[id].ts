export default defineEventHandler(async (event) => {
  const storage = useStorage('fs')
  const db = useDatabase()
  const id = getRouterParam(event, 'id')
  const fileQuery = await db.sql`SELECT * FROM files WHERE id = ${id}`

  const fileData: any = fileQuery?.rows?.at(0)

  if (fileData) {
    const location = fileData?.filelocation
    const file = await storage.getItemRaw(`${location}`)

    console.log(fileData)

    event.node.res.setHeader('Content-Length', fileData.size)
    event.node.res.setHeader('Content-Type', fileData.mimetype)
    event.node.res.write(file)

    return
  }

  return sendError(event, {
    name: 'FileNotFoundError',
    statusCode: 404,
    message: 'File not found',
    fatal: false,
  })
  // setHeader(event, 'Content-Type', fileData.mimetype)
  // send(event, file, 'image/jpeg')
  // return stream
})
