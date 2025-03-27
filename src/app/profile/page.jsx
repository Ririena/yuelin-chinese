"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  BarChart2,
  User,
  Settings,
  Bell,
  LogOut,
  Award,
  Moon,
  ChevronRight,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from "@/components/pages/BottomNavigation";
import { supabase } from "@/lib/supabase";
export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        const { data, error: userError } = await supabase
          .from("User")
          .select("*")
          .eq("email", user.email)
          .single();

        if (userError) throw userError;

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      <div className="p-4">
        <Link
          href="/"
          className="inline-flex items-center text-purple-700 hover:text-purple-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 container mx-auto px-4 py-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and preferences
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="border-purple-100 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-purple-100">
                  <AvatarImage
                    src="/placeholder.svg?height=96&width=96"
                    alt="Profile picture"
                  />
                  <AvatarFallback className="bg-purple-200 text-purple-800 text-xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white border-purple-200 text-purple-800"
                >
                  <Edit2 size={14} />
                </Button>
              </div>

              <h2 className="text-xl font-bold mt-4">
                {userData ? userData.username : "Loading..."}
              </h2>
              <p className="text-gray-500">{userData ? userData.email : "Loading..."}</p>

              <div className="flex items-center mt-2">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-800 border-purple-200"
                >
                  Premium
                </Badge>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">
                  Member since March 2025
                </span>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-800"
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-800"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card className="border-purple-100 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-purple-800">
              Learning Preferences
            </CardTitle>
            <CardDescription>
              Customize your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Daily Goal</div>
                  <div className="text-sm text-gray-500">
                    Number of characters to learn each day
                  </div>
                </div>
                <Button variant="outline" className="border-purple-200">
                  20 characters
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Learning Schedule</div>
                  <div className="text-sm text-gray-500">
                    Set your preferred learning times
                  </div>
                </div>
                <Button variant="outline" className="border-purple-200">
                  Morning
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Difficulty Level</div>
                  <div className="text-sm text-gray-500">
                    Adjust the challenge of new characters
                  </div>
                </div>
                <Button variant="outline" className="border-purple-200">
                  Intermediate
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="border-purple-100 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-purple-800">
              App Settings
            </CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-purple-600" />
                  <div className="font-medium">Notifications</div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon size={20} className="text-purple-600" />
                  <div className="font-medium">Dark Mode</div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-purple-600" />
                  <div className="font-medium">Sound Effects</div>
                </div>
                <Switch
                  checked={soundEffects}
                  onCheckedChange={setSoundEffects}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-purple-600" />
                  <div className="font-medium">Language</div>
                </div>
                <Button variant="outline" className="border-purple-200">
                  English
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="border-purple-100 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-purple-800">
              Achievements
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <Award size={32} className="text-purple-600 mb-2" />
                <span className="text-sm font-medium text-center">
                  7-Day Streak
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <Award size={32} className="text-purple-600 mb-2" />
                <span className="text-sm font-medium text-center">
                  100 Characters
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <Award size={32} className="text-purple-600 mb-2" />
                <span className="text-sm font-medium text-center">
                  Quiz Master
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                <Award size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-center">
                  30-Day Streak
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                <Award size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-center">
                  250 Characters
                </span>
              </div>

              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                <Award size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-medium text-center">
                  Perfect Week
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={16} className="mr-2" />
          Log Out
        </Button>
      </div>

      {/* Bottom Navigation (reused from index page) */}

      <BottomNavigation />
    </div>
  );
}
