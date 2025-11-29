'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 14, s: 59 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 }
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 }
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 }
        return prev // Acabou
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex gap-4 text-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col">
          <motion.div 
            key={value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-12 h-12 glass-panel flex items-center justify-center rounded-lg text-xl font-bold text-white border border-primary/30"
          >
            {value.toString().padStart(2, '0')}
          </motion.div>
          <span className="text-[10px] uppercase text-gray-500 mt-1 font-bold">{unit === 'h' ? 'Hrs' : unit === 'm' ? 'Min' : 'Seg'}</span>
        </div>
      ))}
    </div>
  )
}