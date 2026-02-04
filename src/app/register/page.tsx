"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormInput from "@/components/ui/FormInput";
import LoginButton from "@/components/ui/LoginButton";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import useAuth from "@/hooks/useAuth";
import InteractiveBackground from "@/components/ui/InteractiveBackground";

export default function RegisterPage() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeOurPolicy, setAgreeOurPolicy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleSignUp = async () => {
    if (!agreeOurPolicy) {
      alert("You must agree to our policy to create an account.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: username });
      console.log("User signed up:", userCredential.user);
      router.push("/home");
    } catch (error: unknown) {
      console.error("Error signing up:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "auth/email-already-in-use"
      ) {
        alert("This email is already registered. Please log in or use a different email.");
      } else {
        alert("Failed to create account. Please check your credentials and try again.");
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
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-56px)] md:h-[calc(100dvh-72px)] relative flex flex-col items-center justify-center z-0 overflow-hidden bg-transparent selection:bg-cyan-500/30">
      <InteractiveBackground />
      {/* Background Decorative Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Content Area - Form */}
      <div className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto overflow-x-hidden z-10 custom-scrollbar">
        <div className="w-full max-w-[450px] flex flex-col items-center py-6 my-auto shrink-0">
          
          {/* Header text */}
          <div className="text-center mb-6">
             <h2 className="text-3xl font-bold font-k2d text-white tracking-widest">BEATS MUSIC</h2>
             <p className="text-cyan-400 text-sm tracking-widest uppercase mt-1">Join the Revolution</p>
          </div>

          <div className="w-full backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
             {/* Subtle internal gradient */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

             <div className="text-center mb-5">
               <h3 className="text-xl font-bold text-white">Create Account</h3>
               <p className="text-gray-400 text-xs mt-1">Start your journey with us today</p>
             </div>
             
             <div className="space-y-3">
               <FormInput
                 type="text"
                 placeholder="Username"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 width="w-full"
                 height="h-10"
               />
               <FormInput
                 type="email"
                 placeholder="Email Address"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 width="w-full"
                 height="h-10"
               />
               <div className="relative">
                  <FormInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    width="w-full"
                    height="h-10"
                  />
                  <button
                    type="button"
                    className="absolute right-0 lg:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
               </div>
               <FormInput
                 type="password"
                 placeholder="Confirm Password"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 width="w-full"
                 height="h-10"
               />

               {/* Terms Checkbox */}
               <div className="flex items-center gap-2 pt-1 cursor-pointer group" onClick={() => setAgreeOurPolicy(!agreeOurPolicy)}>
                  <div className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-all duration-200 ${agreeOurPolicy ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500 bg-transparent group-hover:border-cyan-400'}`}>
                     {agreeOurPolicy && <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors select-none">
                    I agree to the <span className="text-cyan-400 hover:underline">Terms & Policy</span>
                  </span>
               </div>

               <div className="pt-2">
                   <LoginButton
                     text="Sign Up"
                     onClick={handleSignUp}
                     width="w-full"
                     height="h-11"
                   />
               </div>
             </div>

             <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-black/40 px-2 text-gray-500 backdrop-blur-xl">Or register with</span></div>
             </div>

             <div className="flex justify-center gap-5">
                 {[
                   { src: "/icons/google-logo.png", alt: "Google", action: handleGoogleLogin },
                   { src: "/icons/facebook-logo.png", alt: "Facebook", action: () => {} },
                   { src: "/icons/github-logo.png", alt: "Github", action: () => {} }
                 ].map((social, idx) => (
                   <button 
                    key={idx}
                    onClick={social.action}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 hover:scale-110 transition-all duration-300"
                   >
                     <Image src={social.src} alt={social.alt} width={20} height={20} className="opacity-80 hover:opacity-100" />
                   </button>
                 ))}
             </div>

             <div className="mt-6 text-center">
                <button
                   type="button"
                   onClick={() => router.push("/login")}
                   className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                   Already have an account? <span className="text-cyan-400 font-semibold ml-1">Login</span>
                </button>
             </div>
          </div>
        </div>
      </div>

       {/* Footer Links */}
       <div className="w-full py-4 text-center z-20 shrink-0 bg-transparent">
           <div className="flex justify-center gap-6 text-xs text-gray-600">
              <button className="hover:text-cyan-400 transition-colors">Terms & Conditions</button>
              <button className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-cyan-400 transition-colors">Support</button>
           </div>
       </div>
    </div>
  );
}
