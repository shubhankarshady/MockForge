"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle, BrainCircuit, Trash2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import SpotlightWrapper from "@/components/animations/SpotlightWrapper";
import Link from "next/link";
import { getTestHistory, deleteAptitudeTest } from "@/lib/actions/aptitude";
import { toast } from "sonner";

export default function AptitudeDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setFetchingHistory(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const result = await getTestHistory(email);
      setTestHistory(result);
    } catch (error) {
      console.error("Error fetching test history:", error);
    } finally {
      setFetchingHistory(false);
    }
  };
const handleStartTest = () => {
  if (!category) return;
  setLoading(true);
  const testId = uuidv4();
  router.push(`/dashboard/aptitude/${testId}/start?category=${category}`);
};

const onDeleteTest = async (mockId) => {
  if (window.confirm("Are you sure you want to delete this test?")) {
    try {
      const result = await deleteAptitudeTest(mockId);
      if (result.success) {
        toast.success("Test deleted successfully");
        fetchHistory(); // Refresh the list
      } else {
        toast.error("Failed to delete test");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    }
  }
};

return (
  <div className="p-10">
    <h2 className="font-bold text-3xl flex items-center gap-2">
      <BrainCircuit className="text-primary" />
      Aptitude Test
    </h2>
    <p className="text-gray-500">Test your skills and get AI feedback</p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-10">
      <SpotlightWrapper>
        <div
          className="p-10 border rounded-lg bg-secondary hover:scale-105 transition-all cursor-pointer border-dashed border-primary h-full flex flex-col items-center justify-center"
          onClick={() => setOpenDialog(true)}
        >
          <h2 className="text-lg text-center font-bold text-primary">+ Start New Test</h2>
        </div>
      </SpotlightWrapper>

      {/* Render History */}
      {!fetchingHistory && testHistory.map((test, index) => (
        <div key={index} className="border shadow-sm rounded-lg p-5 bg-card flex flex-col justify-between relative group">
          <button 
            onClick={() => onDeleteTest(test.mockId)}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Test"
          >
            <Trash2 size={16} />
          </button>
          <div>
            <h2 className="font-bold text-primary capitalize pr-6">{test.category.replace(/([A-Z])/g, ' $1').trim()} Test</h2>

              <p className="text-sm text-gray-500">Score: <span className="font-medium text-foreground">{test.score}/{test.totalQuestions}</span></p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(test.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>
            <div className="flex justify-between mt-4 gap-3">
               <Link href={`/dashboard/aptitude/${test.mockId}/feedback`} className="w-full">
                  <Button size="sm" variant="outline" className="w-full">View Feedback</Button>
               </Link>
            </div>
          </div>
        ))}

        {fetchingHistory && (
          <div className="flex justify-center items-center col-span-full py-10">
            <LoaderCircle className="animate-spin text-primary" />
          </div>
        )}

        {!fetchingHistory && testHistory.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 border rounded-lg border-dashed">
            No tests taken yet. Start your first test to see results!
          </div>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Select Test Category</DialogTitle>
            <DialogDescription>
              Choose a category to begin your aptitude assessment.
            </DialogDescription>
          </DialogHeader>

          <div className="my-5">
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              <option value="Random">Random</option>
              <option value="MixtureAndAlligation">Mixture And Alligation</option>
              <option value="Age">Age</option>
              <option value="PermutationAndCombination">PermutationAndCombination</option>
              <option value="ProfitAndLoss">Profit And Loss</option>
              <option value="SpeedTimeDistance">SpeedTimeDistance</option>
              <option value="Calendar">Calendar</option>
              <option value="SimpleInterest">SimpleInterest</option>
            </select>
          </div>

          <div className="flex gap-5 justify-end">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartTest} disabled={loading || !category}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Start Test"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
