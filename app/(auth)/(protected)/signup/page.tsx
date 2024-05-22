import { signInWith, signUp } from "@/lib/auth";

interface SearchParams {
  error?: string;
  success?: string;
}

export default function SignUp({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/img/signup.jpg" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-600 opacity-70"></div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-lg font-semibold">Already Signed up?</h2>
          <p className="text-sm my-2">All users on SewSmith know that there are millions of fabric enthusiasts just like them who love creating unique designs and joining this crafty community.</p>
          <a href="/signin" className="bg-white text-blue-600 py-2 px-4 rounded-md text-sm inline-block">Sign In</a>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-12 bg-white relative">
        <img src="/img/logo.png" alt="SewSmith Logo" className="absolute left-5 top-5 w-12 h-12" />
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">Sign Up for an Account</h2>
          {(searchParams?.error || searchParams?.success) && (
            <div
              className={`rounded-md ${searchParams.error ? "bg-red-50" : "bg-green-50"} p-4 mb-4`}
            >
              <p
                className={`text-center text-sm ${searchParams?.error ? "text-red-800" : "text-green-800"}`}
              >
                {searchParams?.error || searchParams?.success}
              </p>
            </div>
          )}
          <form className="space-y-4" action={signUp} method="post">
            <div className="flex justify-between gap-2">
              <input type="text" name="first_name" placeholder="First Name" className="w-1/2 p-2 border rounded-md" required />
              <input type="text" name="last_name" placeholder="Last Name" className="w-1/2 p-2 border rounded-md" required />
            </div>
            <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded-md" required />
            <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded-md" required />
            <div className="flex items-center">
              <input id="terms" type="checkbox" className="w-4 h-4" required />
              <label htmlFor="terms" className="ml-2 text-sm">I accept SewSmith's Terms & Conditions</label>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md">SIGN UP</button>
          </form>
        </div>
      </div>
    </div>
  );
}