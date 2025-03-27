"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";

export function QuizQuestion({ onFinish }) {
  const [userId, setUserId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Fetch user ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authData?.user?.email) {
          console.error("User not logged in:", authError);
          return;
        }

        const userEmail = authData.user.email;

        const { data: userData, error: userError } = await supabase
          .from("User")
          .select("id")
          .eq("email", userEmail)
          .single();

        if (userError) {
          console.error("User not found in database:", userError);
          return;
        }

        setUserId(userData.id);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!userId) return;

      const { data: hanziData, error: hanziError } = await supabase
        .from("HanziWord")
        .select("id, character, pinyin")
        .eq("user_id", userId);

      if (hanziError) {
        console.error("Error fetching hanzi data:", hanziError);
        return;
      }

      setQuestions(hanziData);
      setLoading(false);
    };

    fetchQuestions();
  }, [userId]);

  // Fetch answer options
  useEffect(() => {
    const fetchOptions = async () => {
      if (questions.length === 0) return;

      const currentQuestion = questions[currentQuestionIndex];

      // Ambil semua Hanzi kecuali yang sedang diuji
      const { data: allOptions, error } = await supabase
        .from("HanziWord")
        .select("character, pinyin")
        .neq("id", currentQuestion.id);

      if (error) {
        console.error("Error fetching options:", error);
        return;
      }

      // Acak data dan ambil 3 pilihan acak
      const shuffledOptions = allOptions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Gabungkan jawaban benar + 3 pilihan acak
      const finalOptions = [
        {
          character: currentQuestion.character,
          pinyin: currentQuestion.pinyin,
          isCorrect: true,
        },
        ...shuffledOptions.map((opt) => ({ ...opt, isCorrect: false })),
      ].sort(() => Math.random() - 0.5); // Acak ulang sebelum ditampilkan

      setOptions(finalOptions);
    };

    fetchOptions();
  }, [questions, currentQuestionIndex]);

  const handleAnswerClick = async (option) => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Simpan jawaban user ke database
    await supabase.from("QuizQuestion").insert([
      {
        quiz_session_id: userId, // Sesuai dengan sesi user
        hanzi_id: currentQuestion.id,
        user_answer: option.character,
        is_correct: option.isCorrect,
        created_at: new Date(),
      },
    ]);

    setSelectedAnswer(option.character);

    // Lanjut ke soal berikutnya
    setTimeout(() => {
      setSelectedAnswer(null); // Reset pilihan
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        onFinish();
      }
    }, 1000); // Delay agar user bisa melihat hasil
  };

  if (loading) return <div>Loading questions...</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-purple-800">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          className="w-32 h-2 bg-purple-100"
          indicatorClassName="bg-purple-600"
        />
      </div>

      {/* Card Soal */}
      <Card className="border-purple-100 shadow-sm">
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col items-center">
            <div className="text-8xl mb-8">{currentQuestion.character}</div>
            <div className="text-gray-600 text-sm">
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswerClick(option)}
            className={`w-full py-4 text-lg flex flex-col items-center ${
              selectedAnswer === option.character
                ? option.isCorrect
                  ? "bg-green-600"
                  : "bg-red-600"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={selectedAnswer !== null}
          >
            <span className="text-sm text-gray-200">{option.pinyin}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
