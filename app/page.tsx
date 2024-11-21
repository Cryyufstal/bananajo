'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header, HomeView, BoostView, FriendsView, EarnView, Navigation, SettingsModal } from './components/GameComponents'

interface User {
  id: string
  telegramId: number
  username: string
  firstName: string
  lastName: string
  points: number
  referralCount: number
  autoBoostLevel: number
  lastSeen: Date
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState('home')
  const [showSettings, setShowSettings] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [miningStreak, setMiningStreak] = useState(0)
  const [autoBoostLevel, setAutoBoostLevel] = useState(1)
  const [lastMiningTime, setLastMiningTime] = useState(0)
  const [isMining, setIsMining] = useState(false)

  const fetchUserData = useCallback(async () => {
    const telegram = window.Telegram.WebApp
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telegram.initDataUnsafe.user)
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setAutoBoostLevel(userData.autoBoostLevel)
      }
    } catch (error) {
      console.error('Kullanıcı yüklenemedi:', error)
    }
  }, [])

  useEffect(() => {
    const telegram = window.Telegram.WebApp
    telegram.ready()
    telegram.expand()
    fetchUserData()

    const keepAlive = setInterval(fetchUserData, 30000)
    return () => clearInterval(keepAlive)
  }, [fetchUserData])

  const handleMining = async () => {
    if (!user?.telegramId || isMining) return

    const currentTime = Date.now()
    if (currentTime - lastMiningTime < 200) return
    
    setIsMining(true)
    setLastMiningTime(currentTime)
    setIsRotating(true)

    try {
      const points = autoBoostLevel * 2
      const response = await fetch('/api/increase-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user.telegramId,
          points: points
        })
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setMiningStreak(prev => (prev + 1) % 5)
      }
    } catch (error) {
      console.error('Mining başarısız:', error)
    } finally {
      setTimeout(() => {
        setIsRotating(false)
        setIsMining(false)
      }, 100)
    }
  }

  const handleBoostUpgrade = async (level: number, cost: number) => {
    if (!user?.telegramId || user.points < cost || autoBoostLevel >= level) return

    try {
      const response = await fetch('/api/upgrade-boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user.telegramId,
          level: level,
          cost: cost
        })
      })
      
      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setAutoBoostLevel(level)
        await fetchUserData()
      }
    } catch (error) {
      console.error('Yükseltme başarısız:', error)
    }
  }

  const handleShare = () => {
    const telegram = window.Telegram.WebApp
    telegram.switchInlineQuery(`Veltura Mining'e katıl! Referans linkimi kullan: https://t.me/VelturaMiningBot?start=${user?.telegramId}`)
  }

  return (
    <main className="game-container">
      <Header user={user} showSettings={showSettings} setShowSettings={setShowSettings} />
      {currentView === 'home' && (
        <HomeView
          user={user}
          handleMining={handleMining}
          isRotating={isRotating}
          miningStreak={miningStreak}
          autoBoostLevel={autoBoostLevel}
        />
      )}
      {currentView === 'boost' && (
        <BoostView
          user={user}
          autoBoostLevel={autoBoostLevel}
          handleBoostUpgrade={handleBoostUpgrade}
        />
      )}
      {currentView === 'friends' && <FriendsView user={user} handleShare={handleShare} />}
      {currentView === 'earn' && <EarnView user={user} onRewardClaimed={fetchUserData} />}
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} user={user} />}
    </main>
  )
}
