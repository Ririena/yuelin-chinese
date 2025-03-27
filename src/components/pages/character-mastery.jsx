"use client"

import { useEffect, useRef } from "react"

export function CharacterMastery() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for pie chart
    const data = [
      { value: 68, color: "#22c55e", label: "Mastered" },
      { value: 42, color: "#eab308", label: "Learning" },
      { value: 18, color: "#ef4444", label: "Needs Review" },
    ]

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw pie chart
    let startAngle = 0
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    data.forEach((item) => {
      // Calculate angles
      const sliceAngle = (2 * Math.PI * item.value) / total

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      // Fill slice
      ctx.fillStyle = item.color
      ctx.fill()

      // Calculate position for label
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + labelRadius * Math.cos(labelAngle)
      const labelY = centerY + labelRadius * Math.sin(labelAngle)

      // Draw percentage
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const percentage = Math.round((item.value / total) * 100)
      ctx.fillText(`${percentage}%`, labelX, labelY)

      // Update start angle for next slice
      startAngle += sliceAngle
    })
  }, [])

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full h-48"></canvas>
    </div>
  )
}

