"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function AddHanziPage() {
  const [formData, setFormData] = useState({
    character: "",
    pinyin: "",
    meaning: "",
    hskLevel: "hsk1",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, hskLevel: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      console.error("You must be logged in to add a character.");
      return;
    }
  
    if (!formData.character.trim() || !formData.pinyin.trim() || !formData.meaning.trim()) {
      console.error("All fields are required.");
      return;
    }
  
    setIsSubmitting(true);
  
    const hskLevelNumber = parseInt(formData.hskLevel.replace("hsk", ""), 10);
  
    const { error } = await supabase.from("HanziWord").insert([
      {
        user_id: userId, 
        character: formData.character,
        pinyin: formData.pinyin,
        meaning: formData.meaning,
        hsk_level: hskLevelNumber,
      },
    ]);
  
    setIsSubmitting(false);
  
    if (error) {
      console.error("Insert error:", error);
      console.error("Failed to save character.");
    } else {
      console.success(`Successfully added ${formData.character}.`);
      setFormData({
        character: "",
        pinyin: "",
        meaning: "",
        hskLevel: "hsk1",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4">
        <Link href="/learn" className="inline-flex items-center text-purple-700 hover:text-purple-900">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Learn</span>
        </Link>
      </div>

      <div className="flex-1 container mx-auto px-4 py-4 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Add New Hanzi</h1>
          <p className="text-gray-600 mt-2">Contribute to your personal character collection</p>
        </div>

        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="text-xl text-purple-800">Character Details</CardTitle>
            <CardDescription>Enter information about the new character</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="character" className="text-purple-800">Hanzi Character</Label>
                <Input
                  id="character"
                  name="character"
                  value={formData.character}
                  onChange={handleChange}
                  placeholder="Enter character (e.g. 爱)"
                  className="text-2xl text-center h-16 border-purple-200 focus:border-purple-400"
                  maxLength={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pinyin" className="text-purple-800">Pinyin</Label>
                <Input
                  id="pinyin"
                  name="pinyin"
                  value={formData.pinyin}
                  onChange={handleChange}
                  placeholder="Enter pinyin with tones (e.g. ài)"
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meaning" className="text-purple-800">Meaning</Label>
                <Textarea
                  id="meaning"
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleChange}
                  placeholder="Enter English meaning (e.g. love, to love)"
                  className="min-h-[80px] border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-purple-800">HSK Level</Label>
                <RadioGroup value={formData.hskLevel} onValueChange={handleRadioChange} className="flex flex-col space-y-1">
                  {[1, 2, 3].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={`hsk${level}`} id={`hsk${level}`} className="border-purple-400 text-purple-600" />
                      <Label htmlFor={`hsk${level}`} className="font-normal">HSK {level} ({["Beginner", "Elementary", "Intermediate"][level - 1]})</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Character</>}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
