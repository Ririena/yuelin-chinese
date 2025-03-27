"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuizStart } from "@/components/pages/quiz-start";
import { QuizQuestion } from "@/components/pages/quiz-question";
import { supabase } from "@/lib/supabase";

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedPercentage, setSelectedPercentage] = useState(null);
  const [characterCount, setCharacterCount] = useState(20);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("hanzi_questions")
      .select("character, options, correctAnswer")
      .order("id", { ascending: true })
      .limit(characterCount * (selectedPercentage / 100));

    if (error) {
      console.error("Error fetching questions:", error);
    } else {
      setQuestions(data);
    }
  };

  const startQuiz = async () => {
    await fetchQuestions();
    setUserAnswers([]);
    setQuizStarted(true);
    setQuizFinished(false);
  };

  const finishQuiz = async () => {
    setQuizStarted(false);
    setQuizFinished(true);
    
    await supabase.from("QuizSession").insert([
      { user_id: "1", score: userAnswers.filter(a => a.correct).length } // Replace with actual user ID
    ]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-purple-700 hover:text-purple-900">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800">Hanzi Quiz</h1>
            <p className="text-gray-600 mt-2">
              {quizStarted
                ? "Select the correct meaning for each character"
                : quizFinished
                ? "Your quiz results"
                : "Test your knowledge of Chinese characters"}
            </p>
          </div>

          {!quizStarted && !quizFinished && (
            <QuizStart
              onStart={startQuiz}
              setSelectedPercentage={setSelectedPercentage}
              setCharacterCount={setCharacterCount}
            />
          )}

          {quizStarted && (
            <QuizQuestion
              questions={questions}
              onFinish={finishQuiz}
              setUserAnswers={setUserAnswers}
            />
          )}

          {quizFinished && <QuizResult userAnswers={userAnswers} />}
        </div>
      </div>
    </div>
  );
}
