"use client";

import { useState, useEffect } from "react";
import LoginButton from "@/components/ui/LoginButton";
import FormInput from "@/components/ui/FormInput";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import useAuth from "@/hooks/useAuth";
import InteractiveBackground from "@/components/ui/InteractiveBackground";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      if (!auth) {
        alert(
          "Authentication is currently unavailable. Try again in the browser.",
        );
        return;
      }

      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithEmailAndPassword(auth, email, password);
      //console.log("User Logged in:", userCredential.user);
      router.push("/home");
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "auth/wrong-password"
      ) {
        alert("Incorrect password. Please try again.");
      } else if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "auth/user-not-found"
      ) {
        alert("No account found with this email. Please register first.");
      } else {
        alert("Login failed. Please check your credentials and try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!auth || !googleProvider) {
        alert(
          "Authentication is currently unavailable. Try again in the browser.",
        );
        return;
      }

      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
      //console.log("Google user:", result.user);
      router.push("/home");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-72px)] relative flex flex-col lg:flex-row overflow-hidden bg-transparent selection:bg-cyan-500/30">
      <InteractiveBackground />

      {/* Background Decorative Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Left Column - Hero/Intro (Hidden on mobile/tablet vertical, visible on lg) */}
      <div className="hidden lg:flex w-[55%] h-full flex-col justify-center px-16 xl:px-24 z-10 pointer-events-none">
        <div className="relative">
          <h2 className="text-4xl xl:text-5xl font-bold font-k2d text-white leading-tight">
            THE MULTI-UNIVERSAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              MUSIC PLAYLIST
            </span>
          </h2>
          <p className="font-k2d mt-6 text-gray-400 text-lg leading-relaxed max-w-xl">
            Discover the magic of music with us. Your gateway to a world of
            melodies, rhythms, and emotions. Join the revolution today.
          </p>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-[45%] h-full flex flex-col items-center z-10 relative">
        {/* Main Form Area - Scrollable if needed */}
        <div className="flex-1 w-full flex flex-col items-center justify-center px-6 sm:px-12 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Mobile Logo Header */}
          <div className="lg:hidden mb-4 mt-4 text-center shrink-0">
            <h2 className="text-xl font-bold font-k2d text-white tracking-widest">
              BEATS MUSIC
            </h2>
            <p className="text-cyan-400 text-[10px] tracking-widest uppercase mt-1">
              Your Music, Your Way
            </p>
          </div>

          <div className="w-full max-w-[420px] backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-6 py-2 sm:px-8 sm:py-5 shadow-2xl relative overflow-hidden shrink-0 my-auto">
            {/* Subtle internal gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </h3>
              <p className="text-gray-400 text-sm">
                Please login to your account
              </p>
            </div>

            <div className="space-y-4">
              <FormInput
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                width="w-full"
                height="h-11"
              />

              <div className="relative">
                <FormInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  width="w-full"
                  height="h-11"
                />
                <button
                  type="button"
                  className="absolute right-0 lg:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${rememberMe ? "bg-cyan-500 border-cyan-500" : "border-gray-500 bg-transparent group-hover:border-cyan-400"}`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-3.5 h-3.5 text-black font-bold"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors select-none">
                    Remember Me
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Forgot password clicked")}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <LoginButton
                text="Login"
                onClick={handleLogin}
                width="w-full"
                height="h-11 md:h-12"
              />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/40 px-2 text-gray-500 backdrop-blur-xl">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              {[
                {
                  src: "/icons/google-logo.png",
                  alt: "Google",
                  action: handleGoogleLogin,
                },
                //  { src: "/icons/facebook-logo.png", alt: "Facebook", action: () => {} },
                //  { src: "/icons/github-logo.png", alt: "Github", action: () => {} }
              ].map((social, idx) => (
                <button
                  key={idx}
                  onClick={social.action}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 hover:scale-110 transition-all duration-300"
                >
                  <Image
                    src={social.src}
                    alt={social.alt}
                    width={24}
                    height={24}
                    className="opacity-80 hover:opacity-100"
                  />
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Don&apos;t have an account?{" "}
                <span className="text-cyan-400 font-semibold ml-1">
                  Sign Up
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        {/* <div className="w-full py-4 text-center z-20 shrink-0 bg-transparent">
             <div className="flex justify-center gap-6 text-xs text-gray-600">
                <button className="hover:text-cyan-400 transition-colors">Terms & Conditions</button>
                <button className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
                <button className="hover:text-cyan-400 transition-colors">Support</button>
             </div>
         </div> */}
      </div>
    </div>
  );
}
