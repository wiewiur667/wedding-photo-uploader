declare module 'h3' {
  interface H3EventContext {
    auth: {
      user?: {
        id: string
        name: string
        is_admin: boolean
        created_at: number
      }
    }
    // any other type
  }
}

export default {}
