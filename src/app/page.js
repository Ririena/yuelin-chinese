import Link from "next/link"
import { Home, BookOpen, HelpCircle, BarChart2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import BottomNavigation from "@/components/pages/BottomNavigation"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 pb-20 pt-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-800">汉字学习</h1>
            <Button variant="ghost" size="icon" className="text-purple-600">
              <HelpCircle size={20} />
            </Button>
          </div>

          {/* Welcome card */}
          <Card className="border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-purple-800">Welcome back!</CardTitle>
              <CardDescription>Continue your Hanzi learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Daily goal</span>
                  <span className="text-sm font-medium text-purple-600">15/20 characters</span>
                </div>
                <Progress value={75} className="h-2 bg-purple-100" indicatorClassName="bg-purple-600" />
              </div>
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">Continue Learning</Button>
            </CardContent>
          </Card>

          {/* Recent characters */}
          <div>
            <h2 className="text-lg font-semibold text-purple-800 mb-3">Recently Learned</h2>
            <div className="grid grid-cols-4 gap-3">
              {["爱", "好", "学", "习"].map((char, index) => (
                <Card
                  key={index}
                  className="flex items-center justify-center h-20 border-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
                >
                  <span className="text-3xl">{char}</span>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick access */}
          <div>
            <h2 className="text-lg font-semibold text-purple-800 mb-3">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-purple-100 hover:border-purple-300 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center">
                  <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">HSK 1 Characters</span>
                </CardContent>
              </Card>
              <Card className="border-purple-100 hover:border-purple-300 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center">
                  <HelpCircle className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Practice Quiz</span>
                </CardContent>
              </Card>
              <Card className="border-purple-100 hover:border-purple-300 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center">
                  <BarChart2 className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Your Progress</span>
                </CardContent>
              </Card>
              <Card className="border-purple-100 hover:border-purple-300 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center">
                  <User className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Profile Settings</span>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation/>
    </div>
  )
}

