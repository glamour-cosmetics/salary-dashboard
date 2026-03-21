import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function login(employeeData) {
    setEmployee(employeeData)
    setIsAuthenticated(true)
  }

  function logout() {
    setEmployee(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ employee, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
