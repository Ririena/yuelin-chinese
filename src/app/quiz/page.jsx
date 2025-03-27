"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [characterCount, setCharacterCount] = useState(20);
  const [maxCharacters, setMaxCharacters] = useState(50); // Max Hanzi count
  const [hskLevel, setHskLevel] = useState(null); // Selected HSK level
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userId, setUserId] = useState(null);
  const [quizSessionId, setQuizSessionId] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchMaxCharacters();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
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

      if (userError || !userData) {
        console.error("User not found in database:", userError);
        return;
      }

      // Set userId as bigint
      setUserId(userData.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMaxCharacters = async () => {
    try {
      const { data: hanziData, error: hanziError } = await supabase
        .from("HanziWord")
        .select("id");

      if (hanziError) {
        console.error("Error fetching Hanzi data:", hanziError);
        return;
      }

      setMaxCharacters(hanziData.length); // Set max Hanzi count
    } catch (error) {
      console.error("Error fetching max characters:", error);
    }
  };

  const generateOptions = (correctAnswer, allMeanings) => {
    let options = new Set([correctAnswer]);

    while (options.size < 4) {
      const randomMeaning = allMeanings[Math.floor(Math.random() * allMeanings.length)];
      options.add(randomMeaning);
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const startQuiz = async () => {
    if (!userId || !characterCount || !hskLevel) return;
  
    const { data: hanziWords, error } = await supabase
      .from("HanziWord")
      .select("id, character, meaning")
      .eq("hsk_level", hskLevel); // Filter by selected HSK level
  
    if (error || !hanziWords || hanziWords.length === 0) {
      console.error("Error fetching Hanzi words or no data found:", error);
      return;
    }
  
    // Shuffle the fetched Hanzi words
    const shuffledHanziWords = hanziWords.sort(() => Math.random() - 0.5);
  
    // Limit the number of questions based on characterCount
    const selectedHanziWords = shuffledHanziWords.slice(0, characterCount);
  
    const allMeanings = selectedHanziWords.map((word) => word.meaning);
  
    const questionsWithOptions = selectedHanziWords.map((word) => ({
      ...word,
      options: generateOptions(word.meaning, allMeanings),
    }));
  
    const sessionId = uuidv4();
    setQuizSessionId(sessionId);
    setQuestions(questionsWithOptions);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
  
    await supabase.from("QuizSession").insert([
      {
        id: sessionId,
        user_id: userId,
        progress_type: 1,
        progress_value: characterCount,
        total_questions: characterCount,
        created_at: new Date(),
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !quizSessionId) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.meaning;

    // Insert into QuizQuestion
    await supabase.from("QuizQuestion").insert([
      {
        id: uuidv4(),
        quiz_session_id: quizSessionId,
        hanzi_id: currentQuestion.id,
        user_answer: selectedAnswer,
        is_correct: isCorrect,
        created_at: new Date(),
      },
    ]);

    // Fetch existing analytic data
    const { data: existingAnalytics, error: analyticError } = await supabase
      .from("Analytic")
      .select("*")
      .eq("user_id", userId)
      .eq("hanzi_id", currentQuestion.id)
      .maybeSingle();

    if (analyticError) {
      console.error("Error fetching analytic data:", analyticError);
      return;
    }

    if (existingAnalytics) {
      // Update existing analytic
      const updatedAnalytics = {
        total_attempts: existingAnalytics.total_attempts + 1,
        correct_attempts: existingAnalytics.correct_attempts + (isCorrect ? 1 : 0),
        wrong_attempts: existingAnalytics.wrong_attempts + (isCorrect ? 0 : 1),
        accuracy: ((existingAnalytics.correct_attempts + (isCorrect ? 1 : 0)) /
          (existingAnalytics.total_attempts + 1)) *
          100,
        last_attempted_at: new Date(),
      };

      await supabase
        .from("Analytic")
        .update(updatedAnalytics)
        .eq("id", existingAnalytics.id);
    } else {
      // Insert new analytic
      await supabase.from("Analytic").insert([
        {
          id: uuidv4(),
          user_id: userId,
          hanzi_id: currentQuestion.id,
          total_attempts: 1,
          correct_attempts: isCorrect ? 1 : 0,
          wrong_attempts: isCorrect ? 0 : 1,
          accuracy: isCorrect ? 100 : 0,
          last_attempted_at: new Date(),
        },
      ]);
    }

    // Move to the next question or finish the quiz
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizStarted(false);
    }
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
              {quizStarted ? "Select the correct meaning for each character" : "Test your knowledge of Chinese characters"}
            </p>
          </div>

          {!quizStarted ? (
            <Card className="border-purple-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-purple-800 mb-2">
                      Number of Characters
                    </label>
                    <input
                      type="number"
                      value={characterCount}
                      onChange={(e) => setCharacterCount(Number(e.target.value))}
                      max={maxCharacters}
                      min={1}
                      className="w-full border border-purple-200 rounded-md p-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum: {maxCharacters} characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-purple-800 mb-2">
                      Select HSK Level
                    </label>
                    <div className="flex space-x-3">
                      {[1, 2, 3].map((level) => (
                        <Button
                          key={level}
                          variant={hskLevel === level ? "default" : "outline"}
                          onClick={() => setHskLevel(level)}
                          className={
                            hskLevel === level
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "border-purple-200 hover:bg-purple-50"
                          }
                        >
                          HSK {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={startQuiz}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={!characterCount || !hskLevel}
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
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

              <Card className="border-purple-100 shadow-sm">
                <CardContent className="pt-6 pb-8">
                  <div className="text-8xl mb-8">{questions[currentQuestionIndex]?.character}</div>
                  <div className="grid grid-cols-1 gap-3 w-full">
                    {questions[currentQuestionIndex]?.options.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        className={`justify-start text-left h-auto py-3 px-4 border-purple-200 hover:bg-purple-50 ${
                          selectedAnswer === option ? "border-purple-500 bg-purple-50" : ""
                        }`}
                        onClick={() => setSelectedAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700" disabled={!selectedAnswer}>
                {currentQuestionIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}