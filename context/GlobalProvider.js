import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/appwrite'

const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)
export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setUser(user)
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])
  return (
    <GlobalContext.Provider
      value={{ isLoading, setIsLoggedIn, user, setUser, isLoggedIn }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
