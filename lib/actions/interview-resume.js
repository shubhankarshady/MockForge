"use server";

import ImageKit from "imagekit";
import { db } from "@/lib/db/index";
import { MockInterview } from "@/lib/db/schema/index";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

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
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: file.name || "resume.pdf",
        folder: "/resumes",
      });

      resumeUrl = uploadResponse.url;
    }

    if (!resumeUrl) {
      return { success: false, error: "Resume is required" };
    }

    // 2. Send to n8n Webhook
    const n8nWebhookUrl = "http://localhost:5678/webhook-test/test-resume";
    console.log("Sending to n8n:", { resumeUrl, jobPosition, jobDesc });
    
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
      throw new Error(`n8n Webhook failed with status ${n8nResponse.status}`);
    }

    const aiResponse = await n8nResponse.json();
    console.log("n8n AI Response:", JSON.stringify(aiResponse, null, 2));
    
    // Robustly extract questions array from n8n response
    let finalQuestions = { questions: [] };
    
    if (aiResponse.questions && Array.isArray(aiResponse.questions)) {
      finalQuestions = aiResponse;
    } else if (Array.isArray(aiResponse)) {
      finalQuestions = { questions: aiResponse };
    } else if (typeof aiResponse === 'object') {
       const possibleArray = Object.values(aiResponse).find(val => Array.isArray(val));
       if (possibleArray) {
         finalQuestions = { questions: possibleArray };
       } else {
         console.warn("Could not find array in n8n response, using raw response");
         finalQuestions = { questions: [aiResponse] }; 
       }
    }
    
    const mockId = uuidv4();

    // 3. Save to Database
    await db.insert(MockInterview).values({
      mockId: mockId,
      jsonMockResp: JSON.stringify(finalQuestions),
      jobPosition: jobPosition,
      jobDesc: jobDesc,
      jobExperience: "From Resume",
      createdBy: createdBy,
      resumeUrl: resumeUrl,
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

