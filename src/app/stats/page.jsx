'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, FlameIcon as Fire, Award, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/pages/BottomNavigation";
import { supabase } from "@/lib/supabase";

export default function StatsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [characterStats, setCharacterStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAnalytics();
      fetchQuizResults();
      fetchCharacterStats();
    }
  }, [userId]);

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

  const fetchAnalytics = async () => {
    try {
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("Analytic")
        .select("total_attempts, correct_attempts, wrong_attempts, accuracy")
        .eq("user_id", userId);

      if (analyticsError) {
        console.error("Error fetching analytics:", analyticsError);
        return;
      }

      setAnalytics(analyticsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };
  const fetchQuizResults = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from("QuizSession")
        .select("id, created_at, total_questions, QuizQuestion(is_correct)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
  
      if (quizError) {
        console.error("Error fetching quiz results:", quizError);
        return;
      }
  
      // Calculate the number of correct answers for each quiz
      const resultsWithCorrectCount = quizData.map((quiz) => {
        const correctCount = quiz.QuizQuestion.filter((q) => q.is_correct).length;
        return {
          ...quiz,
          correctCount,
        };
      });
  
      setQuizResults(resultsWithCorrectCount);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    }
  };

  const fetchCharacterStats = async () => {
    try {
      const { data: characterData, error: characterError } = await supabase
        .from("Analytic")
        .select("hanzi_id, total_attempts, correct_attempts, accuracy, HanziWord(character)")
        .eq("user_id", userId);
  
      if (characterError) {
        console.error("Error fetching character stats:", characterError);
        return;
      }
  
      setCharacterStats(characterData);
    } catch (error) {
      console.error("Error fetching character stats:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const totalAttempts = analytics?.reduce((sum, item) => sum + item.total_attempts, 0) || 0;
  const correctAttempts = analytics?.reduce((sum, item) => sum + item.correct_attempts, 0) || 0;
  const wrongAttempts = analytics?.reduce((sum, item) => sum + item.wrong_attempts, 0) || 0;
const overallAccuracy = totalAttempts
  ? ((correctAttempts / totalAttempts) * 100).toFixed(0)
  : 0;
  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center text-purple-700 hover:text-purple-900">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 container mx-auto px-4 py-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Your Statistics</h1>
          <p className="text-gray-600 mt-2">Track your Hanzi learning progress</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="quizzes"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              Quiz Results
            </TabsTrigger>
            <TabsTrigger
              value="characters"
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              Characters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-purple-100">
                <CardContent className="p-4 flex flex-col items-center">
                  <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-500">Total Attempts</p>
                  <p className="text-2xl font-bold text-purple-800">{totalAttempts}</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="p-4 flex flex-col items-center">
                  <Fire className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-500">Correct Attempts</p>
                  <p className="text-2xl font-bold text-purple-800">{correctAttempts}</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="p-4 flex flex-col items-center">
                  <Award className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-500">Wrong Attempts</p>
                  <p className="text-2xl font-bold text-purple-800">{wrongAttempts}</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="p-4 flex flex-col items-center">
                  <Clock className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-500">Overall Accuracy</p>
                  <p className="text-2xl font-bold text-purple-800">{overallAccuracy}%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
  <Card className="border-purple-100">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl text-purple-800">Recent Quiz Results</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {quizResults.map((quiz) => (
          <div
            key={quiz.id}
            className="flex justify-between items-center p-3 bg-purple-50 rounded-lg"
          >
            <div>
              <p className="font-medium">Quiz on {new Date(quiz.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{quiz.total_questions} Questions</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-purple-800">
                {quiz.correctCount}/{quiz.total_questions}
              </p>
              <p className="text-sm text-purple-600">
                {((quiz.correctCount / quiz.total_questions) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="characters" className="space-y-6">
            <Card className="border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-purple-800">Character Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {characterStats.map((char) => (
                    <div
                      key={char.hanzi_id}
                      className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-100"
                    >
                    <span className="text-3xl mb-2">{char.HanziWord.character}</span>
                      <span className="text-sm text-gray-600">{char.total_attempts} Attempts</span>
                      <span className="text-xs text-purple-600 mt-1">{char.accuracy}% Accuracy</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}