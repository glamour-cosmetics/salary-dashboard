import { createContext, useContext, useEffect } from 'react'
import { useTelegram } from '../hooks/useTelegram'

const TelegramContext = createContext(null)

export function TelegramProvider({ children }) {
  const telegram = useTelegram()

  useEffect(() => {
    if (telegram.tg) {
      telegram.tg.ready()
      telegram.tg.expand()
    }
  }, [])

  return (
    <TelegramContext.Provider value={telegram}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegramContext() {
  return useContext(TelegramContext)
}
