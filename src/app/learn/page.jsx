"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/pages/BottomNavigation";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function LearnPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [activeTab, setActiveTab] = useState("hsk1");
  const [searchTerm, setSearchTerm] = useState("");
  const [hanziData, setHanziData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("HanziWord")
        .select("id, character, pinyin, meaning, hsk_level")
        .eq("hsk_level", activeTab.replace("hsk", ""));
      
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setHanziData(data);
      }
      setLoading(false);
    }

    fetchData();
  }, [activeTab]);

  const filteredData = hanziData.filter(
    (item) =>
      item.character.includes(searchTerm) ||
      item.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchTerm("");
  };

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
          <h1 className="text-3xl font-bold text-purple-800">Learn Hanzi</h1>
          <p className="text-gray-600 mt-2">Master Chinese characters step by step</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {["hsk1", "hsk2", "hsk3"].map((level) => (
              <TabsTrigger key={level} value={level} className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                {level.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search characters, pinyin, or meaning..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Character</TableHead>
                <TableHead>Pinyin</TableHead>
                <TableHead>Meaning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-4xl ">{item.character}</TableCell>
                  <TableCell className="text-purple-600">{item.pinyin}</TableCell>
                  <TableCell className="text-purple-600">{item.meaning}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-between mt-4">
          <Button disabled={currentPage === 1} onClick={handlePrevPage}>
            <ChevronLeft className="mr-2" /> Prev
          </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage === totalPages} onClick={handleNextPage}>
            Next <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
