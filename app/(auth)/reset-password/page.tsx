import { redirect } from "next/navigation";
import { resetPassword } from "@/lib/auth";
import { getUser } from "@/lib/supabase/server";

export default async function ResetPassword({ searchParams }: { searchParams: any }) {
  const { user } = await getUser();
  if (!user) {
    return redirect("/signin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/img/signin.jpg)' }}>
        <div className="absolute inset-0 bg-blue-600 opacity-70"></div>
      </div>
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src="/img/logo.png" alt="SewSmith Logo" className="h-12 w-12"/>
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
        <p className="text-center text-sm text-gray-600 mb-6">Enter a new password for your account.</p>
        
        {(searchParams?.error || searchParams?.success) && (
          <div
            className={`rounded-md ${searchParams.error ? "bg-red-50" : "bg-green-50"} p-4 mb-4`}
          >
            <p
              className={`text-center text-sm font-medium ${searchParams?.error ? "text-red-800" : "text-green-800"}`}
            >
              {searchParams?.error} {searchParams?.success}
            </p>
          </div>
        )}

        <form action={resetPassword} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Password
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <a href="/signin" className="font-medium text-blue-600 hover:text-blue-700">Return to login</a>
        </p>
      </div>
    </div>
  );
}
