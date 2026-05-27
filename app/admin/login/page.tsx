"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/leads");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md border">
        <h1 className="text-3xl font-extrabold mb-2">Admin Login</h1>
        <p className="text-gray-500 mb-6">Khatu Rides Leads Dashboard</p>

        <input
          className="w-full border rounded-xl px-4 py-3 mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded-xl px-4 py-3 mb-5"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-orange-600 text-white rounded-full py-3 font-bold"
        >
          Login
        </button>
      </div>
    </main>
  );
}