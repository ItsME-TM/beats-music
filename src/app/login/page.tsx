"use client";

import { useState, useEffect } from "react";
import LoginButton from "@/components/login-button";
import FormInput from "@/components/formInput";
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
import useAuth from "@/components/authProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Google user state not required for UI; omit to avoid unused var

  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User Logged in:", userCredential.user);
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
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google user:", result.user);
      router.push("/home");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden w-screen px-4 sm:px-6 md:px-10 lg:px-16">
      {/* Left column */}
      <div className="md:w-[60%] md:pl-20 pt-8 sm:pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold font-k2d">
          THE MUTIL-UNIVERSAL <br />
          MUSIC PLAYLIST
        </h2>
        <div className="font-k2d mt-4 sm:mt-5 md:mr-20">
          <span className="text-sm sm:text-base">
            Discover the magic of music with us. Our platform is your gateway to
            a world of melodies, rhythms, and emotions. Whether you&apos;re a
            passionate listener, a budding artist, or an industry professional,
            we have something special for you.
          </span>
        </div>
        <div className="mt-6 sm:mt-8 w-full md:w-[600px]">
          <Image
            src="/images/login-intro-image.png"
            alt="Music"
            width={600}
            height={250}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right column */}
      <div className="md:w-[40%] flex-col items-center justify-center md:pr-20 pt-8 sm:pt-10 md:pl-12">
        <div
          className="relative w-full sm:w-[380px] md:w-90 rounded-xl p-6 sm:p-8 backdrop-blur-[53px] shadow-[-8px_4px_5px_0px_#0000003D]"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.14)),\n                        linear-gradient(321.23deg, rgba(191, 191, 191, 0.062) 5.98%, rgba(0, 0, 0, 0) 66.28%)",
            border: "1px solid",
            borderImageSource:
              "linear-gradient(166.93deg, #AFAFAF 3.24%, rgba(96, 96, 96, 0) 96.43%),\n                        linear-gradient(317.92deg, rgba(255, 255, 255, 0.6) 1.48%, rgba(0, 0, 0, 0) 67.95%)",
          }}
        >
          <h2 className="text-white text-xl sm:text-2xl font-bold">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-xs">Glad you&apos;re back.!</p>
          <div className="flex flex-col h-97 items-center">
            <div className="mt-3 w-full flex justify-center">
              <FormInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                width="w-[85%] sm:w-72"
                height="h-10"
              />
            </div>
            <div className="mt-3 w-full flex justify-center">
              <FormInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                width="w-[85%] sm:w-72"
                height="h-10"
              />
              <span
                className="relative left-[70%] sm:left-65 bottom-7 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </span>
            </div>
            <div className="flex items-center justify-start w-full mt-2 ml-3">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="
                                                                        appearance-none bg-gradient-to-b from-blue-500 via-blue-300 to-purple-500 w-4 h-4
                                                                        rounded-sm border border-gray-400
                                                                        checked:bg-blue-600 checked:border-white checked:border-2
                                                                        relative
                                                                        after:content-['✔'] after:absolute after:left-[2px] after:top-[-2px] after:text-black after:text-xs
                                                                        checked:after:opacity-100 after:opacity-0 cursor-pointer
                                                                "
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-white text-xs"
                style={{ fontFamily: "Noto Sans, sans-serif" }}
              >
                Remember me
              </label>
            </div>
            <div className="mt-5 w-full flex justify-center">
              <LoginButton
                text="Login"
                onClick={handleLogin}
                width="w-[85%] sm:w-72"
                height="h-10"
              />
            </div>
            <div>
              <button
                type="button"
                className="text-white text-xs mt-3 cursor-pointer"
                onClick={() => alert("Forgot password clicked")}
              >
                Forgot password ?
              </button>
            </div>
            <div className="flex items-center my-5 w-full">
              <hr className="flex-grow border-t border-gray-600" />
              <span className="mx-3 text-gray-400 text-xs font-noto">or</span>
              <hr className="flex-grow border-t border-gray-600" />
            </div>
            <div className="flex mx-10 sm:mx-20 gap-4">
              <Image
                src="/icons/google-logo.png"
                alt="google-logo"
                width={25}
                height={25}
                className="cursor-pointer"
                onClick={handleGoogleLogin}
              />
              <Image
                src="/icons/facebook-logo.png"
                alt="google-logo"
                width={25}
                height={25}
                className="cursor-pointer"
              />
              <Image
                src="/icons/github-logo.png"
                alt="google-logo"
                width={25}
                height={25}
                className="cursor-pointer"
              />
            </div>
            <div>
              <button
                type="button"
                className="text-white text-xs mt-10 font-noto cursor-pointer"
                onClick={() => router.push("/register")}
              >
                Don&apos;t have an account? Signup
              </button>
            </div>
            <div className="flex mt-3 gap-4 sm:gap-7">
              <button
                type="button"
                className="text-white text-xs font-noto cursor-pointer"
                onClick={() => alert("Terms & Conditions clicked")}
              >
                Terms & Conditions
              </button>
              <button
                type="button"
                className="text-white text-xs font-noto cursor-pointer"
                onClick={() => alert("Support clicked")}
              >
                Support
              </button>
              <button
                type="button"
                className="text-white text-xs font-noto cursor-pointer"
                onClick={() => alert("Customer Care clicked")}
              >
                Customer Care
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
