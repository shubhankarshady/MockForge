"use client";

import dynamic from "next/dynamic";

const SpeechRecorder = dynamic(() => import("./SpeechRecorder"), {
  ssr: false,
  loading: () => <div className="border p-5">Loading speech engine...</div>,
});

export default function RecordAnsSection({ mockId, activeQuestion, user }) {
  return (
    <SpeechRecorder
      mockId={mockId}
      activeQuestion={activeQuestion}
      user={user}
    />
  );
}
