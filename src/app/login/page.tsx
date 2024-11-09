"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthContext";

export default function SignIn() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("Already Logged In. Redirecting to home page...");
      router.push("/");
    }
  }, [user, router]);


  const handleSignInFlow = () => {
      signInWithGoogle();
  };

  return (
    <div>
      <button
        onClick={() => handleSignInFlow()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sign in
      </button>
    </div>
  );
}