import Link from "next/link"
import { ArrowLeft, Clock, FlameIcon as Fire, Award, BarChart2, BookOpen, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LearningChart } from "@/components/pages/learning-chart"
import { CharacterMastery } from "@/components/pages/character-mastery"
import BottomNavigation from "@/components/pages/BottomNavigation"

export default function StatsPage() {
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
                  <p className="text-sm text-gray-500">Characters Learned</p>
                  <p className="text-2xl font-bold text-purple-800">128</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="p-4 flex flex-col items-center">
                  <Fire className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-500">Current Streak</p>
                  <p className="text-2xl font-bold text-purple-800">7 days</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="p-4 flex flex-col items-center">
                  <Award className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-500">Quiz Accuracy</p>
                  <p className="text-2xl font-bold text-purple-800">82%</p>
                </CardContent>
              </Card>

              <Card className="border-purple-100">
                <CardContent className="p-4 flex flex-col items-center">
                  <Clock className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-500">Study Time</p>
                  <p className="text-2xl font-bold text-purple-800">24h</p>
                </CardContent>
              </Card>
            </div>

            {/* Learning Progress */}
            <Card className="border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-purple-800">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <LearningChart />

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">HSK 1</span>
                      <span className="text-sm text-purple-600">45/50</span>
                    </div>
                    <Progress value={90} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">HSK 2</span>
                      <span className="text-sm text-purple-600">32/50</span>
                    </div>
                    <Progress value={64} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">HSK 3</span>
                      <span className="text-sm text-purple-600">15/50</span>
                    </div>
                    <Progress value={30} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6">
            <Card className="border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-purple-800">Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">HSK 1 Characters</p>
                      <p className="text-sm text-gray-500">March 25, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-800">18/20</p>
                      <p className="text-sm text-purple-600">90%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">Mixed Characters</p>
                      <p className="text-sm text-gray-500">March 23, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-800">15/20</p>
                      <p className="text-sm text-purple-600">75%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">HSK 2 Characters</p>
                      <p className="text-sm text-gray-500">March 20, 2025</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-800">16/20</p>
                      <p className="text-sm text-purple-600">80%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-purple-800">Challenging Characters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-3xl mb-2">难</span>
                    <span className="text-sm text-gray-600">Difficult</span>
                    <span className="text-xs text-red-500 mt-1">40% accuracy</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-3xl mb-2">记</span>
                    <span className="text-sm text-gray-600">Remember</span>
                    <span className="text-xs text-red-500 mt-1">45% accuracy</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-3xl mb-2">解</span>
                    <span className="text-sm text-gray-600">Understand</span>
                    <span className="text-xs text-red-500 mt-1">50% accuracy</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-3xl mb-2">错</span>
                    <span className="text-sm text-gray-600">Wrong</span>
                    <span className="text-xs text-red-500 mt-1">55% accuracy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="characters" className="space-y-6">
            <Card className="border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-purple-800">Character Mastery</CardTitle>
              </CardHeader>
              <CardContent>
                <CharacterMastery />

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mb-2"></div>
                    <span className="text-sm text-gray-600">Mastered</span>
                    <span className="font-medium">68</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mb-2"></div>
                    <span className="text-sm text-gray-600">Learning</span>
                    <span className="font-medium">42</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mb-2"></div>
                    <span className="text-sm text-gray-600">Needs Review</span>
                    <span className="font-medium">18</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-purple-800">Recently Mastered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {["爱", "好", "学", "习", "中", "国", "人", "大", "小", "水"].map((char, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-100"
                    >
                      <span className="text-2xl">{char}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation (reused from index page) */}
      <BottomNavigation/>
    </div>
  )
}

