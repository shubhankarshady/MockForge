import { SignIn } from "@clerk/nextjs";
import SplashCursor from "@/components/animations/SplashCursor";

export default function Page() {
  return (
    <section className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <div className="flex min-h-screen">
        <SplashCursor />
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-20">
          <h1 className="text-5xl font-bold mb-6">Ace Your Next Interview.</h1>
          <p className="text-gray-400 text-lg max-w-md">
            Practice real AI-powered mock interviews with instant feedback,
            voice analysis, and performance scoring.
          </p>
        </div>

        <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: "#5227FF",
                  colorBackground: "#111111",
                  colorText: "#ffffff",
                  colorInputBackground: "#1a1a1a",
                  colorInputText: "#ffffff",
                  borderRadius: "12px",
                },
                elements: {
                  card: "bg-[#111111] shadow-xl border border-gray-800",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-400",
                  formButtonPrimary:
                    "bg-purple-600 hover:bg-purple-700 text-white",
                },
              }}
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
