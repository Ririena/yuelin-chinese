"use client"

import { useEffect, useRef } from "react"

export function LearningChart() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Sample data - characters learned per day for the last 7 days
    const data = [5, 8, 3, 10, 6, 12, 7]
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    // Chart dimensions
    const chartWidth = canvas.width - 40
    const chartHeight = canvas.height - 40
    const barWidth = chartWidth / data.length - 10

    // Find max value for scaling
    const maxValue = Math.max(...data)

    // Draw chart
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw bars
    data.forEach((value, index) => {
      const x = 30 + index * (barWidth + 10)
      const barHeight = (value / maxValue) * chartHeight
      const y = canvas.height - barHeight - 25

      // Draw bar
      ctx.fillStyle = "#a855f7" // Purple color
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 5)
      ctx.fill()

      // Draw value on top of bar
      ctx.fillStyle = "#6b21a8" // Dark purple
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)

      // Draw label below bar
      ctx.fillStyle = "#6b7280" // Gray
      ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 10)
    })

    // Draw horizontal line at bottom
    ctx.strokeStyle = "#e5e7eb"
    ctx.beginPath()
    ctx.moveTo(20, canvas.height - 25)
    ctx.lineTo(canvas.width - 20, canvas.height - 25)
    ctx.stroke()
  }, [])

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full h-48"></canvas>
    </div>
  )
}

