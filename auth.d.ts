declare module '#auth-utils' {
  interface User {
    // Add your own fields
    id: string
    name: string
    isAdmin: boolean
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {}
