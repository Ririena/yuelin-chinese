"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

import { supabase } from "@/lib/supabase"

export function QuizStart({ onStart }) {
  const [selectedPercentage, setSelectedPercentage] = useState(null)
  const [characterCount, setCharacterCount] = useState(20)
  const [maxCharacters, setMaxCharacters] = useState(50)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser()
        if (authError || !authData?.user?.email) {
          console.error("User not logged in:", authError)
          return
        }

        const userEmail = authData.user.email

        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("id")
          .eq("email", userEmail)
          .single()

        if (userError || !userData) {
          console.error("User not found in database:", userError)
          return
        }

        setUserId(userData.id)

        // Fetch jumlah Hanzi berdasarkan user_id
        const { data: hanziData, error: hanziError } = await supabase
          .from("HanziWord")
          .select("id")
          .eq("user_id", userData.id)

        if (hanziError) {
          console.error("Error fetching hanzi data:", hanziError)
          return
        }

        setMaxCharacters(hanziData.length)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <Card className="border-purple-100 shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-purple-800 mb-3">Select difficulty level</h2>
            <div className="grid grid-cols-3 gap-3">
              {[25, 50, 100].map((percentage) => (
                <Button
                  key={percentage}
                  variant={selectedPercentage === percentage ? "default" : "outline"}
                  onClick={() => setSelectedPercentage(percentage)}
                  className={
                    selectedPercentage === percentage
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "border-purple-200 hover:bg-purple-50"
                  }
                >
                  {percentage === 25 ? "Beginner" : percentage === 50 ? "Intermediate" : "Advanced"}
                  <span className="block text-xs mt-1 opacity-80">{percentage}%</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium text-purple-800">Number of characters</h2>
              <span className="text-purple-600 font-medium">
                {characterCount} / {maxCharacters}
              </span>
            </div>
       
            <p className="text-sm text-gray-500 mt-2">
              Select how many characters you want to be quizzed on. Maximum is based on characters you've learned.
            </p>
          </div>

          <Button
            onClick={() => onStart({ selectedPercentage, characterCount, userId })}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={selectedPercentage === null || maxCharacters === 0}
          >
            Start Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
