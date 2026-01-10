import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return(
    <section className="bg-white dark:bg-gray-900">
    <div className="flex justify-center min-h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/5" style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?auto=format&fit=crop&w=715&q=80')",
  }}>
        </div>

        <SignUp/>
    </div>
</section>
  )
   
}