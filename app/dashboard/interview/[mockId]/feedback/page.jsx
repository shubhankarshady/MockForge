import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { ChevronsUpDown } from "lucide-react"
import Link from "next/link";


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
export default async function Feedback({ params }) {
  const { mockId } = await params;   // ✅ unwrap promise

  const result = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, mockId))
    .orderBy(UserAnswer.id);

  const avgRating =
    result.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
    (result.length || 1);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your interview feedback</h2>

      <h2 className="text-primary text-lg my-3">
        Your Interview Rating: <strong>{avgRating.toFixed(1)}/10</strong>
      </h2>

      <div className="mt-6 space-y-4">
        {result.map((item, idx) => (
          <div key={item.id} className="border p-4 rounded-lg flex-col gap-2 bg-gray-100">
                <Collapsible>
  <CollapsibleTrigger> <h2 className="font-bold flex justify-between">
              Q{idx + 1}: {item.questions}<ChevronsUpDown/>
            </h2></CollapsibleTrigger>
  <CollapsibleContent>
    <h2 className="text-x text-red-800 mt-2 border p-4 rounded-lg bg-red-50"><strong>Your answer:</strong> {item.userAns}</h2>
            <h2 className=" mt-2 text-green-600 border p-4 rounded-lg bg-green-100 ">
              <strong>Feedback!:</strong> {item.feedback}
            </h2>
            <h2 className="text-sm text-red-600 mt-1 border p-4 rounded-lg bg-white"><strong>Rating:</strong> {item.rating}/10</h2>
  </CollapsibleContent>
</Collapsible>
          </div>
        ))}
      </div>

      <Link href="/dashboard">
  <button className="fixed bottom-10 left-6 bg-primary text-white px-5 py-2 rounded-lg shadow-lg hover:opacity-90 transition">
    ← Go Home
  </button>
</Link>

      
    </div>
  );
}
