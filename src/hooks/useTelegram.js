/**
 * Hook to access Telegram Web App SDK
 * Provides safe access to window.Telegram.WebApp with fallback for dev environment
 */
export function useTelegram() {
  const tg = window.Telegram?.WebApp

  return {
    tg,
    user: tg?.initDataUnsafe?.user ?? null,
    isReady: !!tg,
    expand: () => tg?.expand(),
    close: () => tg?.close(),
    showMainButton: (text, onClick) => {
      if (!tg) return
      tg.MainButton.setText(text)
      tg.MainButton.onClick(onClick)
      tg.MainButton.show()
    },
    hideMainButton: () => tg?.MainButton.hide(),
    themeParams: tg?.themeParams ?? {},
    colorScheme: tg?.colorScheme ?? 'light',
  }
}
