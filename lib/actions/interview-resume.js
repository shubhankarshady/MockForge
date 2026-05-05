"use server";

import ImageKit from "imagekit";
import { db } from "@/lib/db/index";
import { MockInterview } from "@/lib/db/schema/index";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function createInterviewWithResume(formData) {
  const file = formData.get("resume"); // This could be a File or a string URL
  const jobPosition = formData.get("jobPosition");
  const jobDesc = formData.get("jobDesc");
  const createdBy = formData.get("createdBy");
  const existingResumeUrl = formData.get("existingResumeUrl");

  try {
    let resumeUrl = existingResumeUrl;

    // 1. Upload to ImageKit ONLY if a new file is provided
    if (file && typeof file !== "string" && file.size > 0) {
      console.log("Uploading new resume to ImageKit...");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: file.name || "resume.pdf",
        folder: "/resumes",
      });

      resumeUrl = uploadResponse.url;
      console.log("ImageKit Upload Success:", resumeUrl);
    }

    if (!resumeUrl) {
      return { success: false, error: "Resume is required" };
    }

    // 2. Send to n8n Webhook
    // Note: The n8n workflow MUST have a "Respond to Webhook" node to return the AI JSON.
    const n8nWebhookUrl = "http://localhost:5678/webhook-test/test-resume";
    console.log("Sending to n8n:", { resumeUrl, jobPosition, jobDesc, createdBy });
    
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeUrl,
        jobPosition,
        jobDesc,
        createdBy,
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("n8n Error Response:", errorText);
      
      // Check if it's the specific "No Respond to Webhook node" error
      if (errorText.includes("No Respond to Webhook node")) {
        throw new Error("n8n Error: Your workflow is missing a 'Respond to Webhook' node to return the questions.");
      }
      
      throw new Error(`n8n Webhook failed with status ${n8nResponse.status}`);
    }

    const aiResponse = await n8nResponse.json();
    console.log("n8n AI Response received:", JSON.stringify(aiResponse, null, 2));
    
    // 3. Prevent Double Insertion
    // If n8n has a Supabase/Postgres node, it might have already inserted the record.
    // Check if the response from n8n already contains a mockId or record id.
    if (aiResponse.mockId || (aiResponse[0] && aiResponse[0].mockId)) {
      console.log("n8n handled the insertion. Skipping local DB insert.");
      const returnedMockId = aiResponse.mockId || aiResponse[0].mockId;
      revalidatePath("/dashboard");
      return { success: true, mockId: returnedMockId };
    }

    // 4. Extract the exact interview data from the n8n response structure
    let interviewData = null;
    if (aiResponse.questions && aiResponse.questions[0]) {
      interviewData = aiResponse.questions[0];
    } else if (Array.isArray(aiResponse) && aiResponse[0]) {
      interviewData = aiResponse[0];
    } else {
      // Fallback if n8n returned it slightly differently
      interviewData = aiResponse;
    }

    const mockId = interviewData.mockid || uuidv4();

    // 5. Map specifically to your table columns and Insert via Drizzle
    console.log("Inserting record locally with n8n extracted data...");
    await db.insert(MockInterview).values({
      mockId: mockId,
      jsonMockResp: typeof interviewData.jsonmockresp === 'string' 
        ? interviewData.jsonmockresp 
        : JSON.stringify(interviewData.jsonmockresp || aiResponse),
      jobPosition: interviewData.jobposition || jobPosition,
      jobDesc: interviewData.jobdesc || jobDesc,
      jobExperience: interviewData.jobexperience || "From Resume",
      createdBy: interviewData.createdby || createdBy,
      resumeUrl: interviewData.resumeurl || resumeUrl,
      aifeedback: null // Start as null until the interview is over
    });

    revalidatePath("/dashboard");
    return { success: true, mockId };
  } catch (error) {
    console.error("Error in createInterviewWithResume:", error);
    return { success: false, error: error.message };
  }
}

export async function getLatestResume(email) {
  try {
    const result = await db
      .select({ resumeUrl: MockInterview.resumeUrl })
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, email))
      .orderBy(desc(MockInterview.id))
      .limit(1);

    return result[0]?.resumeUrl || null;
  } catch (error) {
    console.error("Error fetching latest resume:", error);
    return null;
  }
}

