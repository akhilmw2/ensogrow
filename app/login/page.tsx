"use client";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 md:px-6 py-12 bg-gradient-to-br from-[#f5fbe7] via-[#e0f2df] to-[#d5eadb]">
      <div className="w-full max-w-md rounded-3xl border border-[#cde6cc] bg-white/60 backdrop-blur-xl shadow-xl p-10 md:p-12">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-lime-200 flex items-center justify-center shadow-inner">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 tracking-tight">
            EnsoGrow
          </h1>
          <p className="text-sm text-green-700 mt-2 font-medium">
            Sign in to your green space
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
