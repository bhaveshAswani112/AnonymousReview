import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-black">
      <div className="bg-gray-900 rounded-lg shadow-lg p-10 max-w-md w-full text-center">
        <div className="font-extrabold text-4xl mb-6 text-white">
          Welcome to Anonymous Review
        </div>
        <Button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300">
          <Link href="/sign-in">
            Login
          </Link>
        </Button>
      </div>
    </div>
  );
}
