'use client';
import { useState } from "react";
import LoginButton from "@/components/login-button";
import FormInput from "@/components/formInput";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import type { User } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [googleUser, setGoogleUser] = useState<User | null>(null);

    const router = useRouter();

    const handleLogin = () => {
        console.log('Login: ')
    }

    const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        setGoogleUser(result.user);
        console.log("Google user:", result.user);
        router.push("/home"); // Redirect to home or dashboard
    } catch (error) {
        console.error("Google login error:", error);
    }
};

    return (
        <div className="flex overflow-x-hidden w-screen"> 
            <div className="w-[60%] pl-25 pt-10 flex-clo">
                {/* Left column content */}
                <div>
                    <h2 className="text-3xl font-bold font-k2d">THE MUTIL-UNIVERSAL <br/>MUSIC PLAYLIST</h2>
                </div>
                <div className="font-k2d mt-5 mr-30">
                    <span className="text-lg">
                        Discover the magic of music with us. Our platform is your gateway to a world of 
                        melodies, rhythms, and emotions. Whether you&#39;re a passionate listener, a budding 
                        artist, or an industry professional, we have something special for you.
                    </span>
                </div>
                <div className="mt-8 w-150 h-60">
                    <Image src="/images/login-intro-image.png" alt="Music" width={600} height={250} />
                </div>
                
            </div>
            <div className="w-[40%] flex-col items-center justify-center pr-20 pt-10 pl-15">
                {/* Right column content */}
                <div
                    className="relative w-90 rounded-xl p-8 backdrop-blur-[53px] shadow-[-8px_4px_5px_0px_#0000003D]"
                    style={{
                        background: `
                        linear-gradient(0deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.14)),
                        linear-gradient(321.23deg, rgba(191, 191, 191, 0.062) 5.98%, rgba(0, 0, 0, 0) 66.28%)
                        `,
                        border: "1px solid",
                        borderImageSource: `
                        linear-gradient(166.93deg, #AFAFAF 3.24%, rgba(96, 96, 96, 0) 96.43%),
                        linear-gradient(317.92deg, rgba(255, 255, 255, 0.6) 1.48%, rgba(0, 0, 0, 0) 67.95%)
                        `
                    }}
                >
                    <h2 className="text-white text-2xl font-bold">Welcome Back</h2>
                    <p className="text-gray-300 text-xs">Glad you’re back.!</p>
                    <div className="flex flex-col  h-97 items-center">
                        <div className="mt-3">
                            <FormInput 
                                type="email"
                                placeholder="Username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                width="w-72"
                                height="h-10"
                            />
                        </div>
                        <div className="mt-3">
                            <FormInput 
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                width="w-72"
                                height="h-10"
                            />
                            <span 
                                className="relative left-65 bottom-7 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={15}/> : <FaEye size={15}/>}
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
                                style={{ fontFamily: 'Noto Sans, sans-serif' }}
                            >
                                Remember me
                            </label>
                        </div>
                        <div className="mt-5">
                            <LoginButton text="Login" onClick={handleLogin} width="w-72" height="h-10"/>
                        </div>
                        <div>
                            <button 
                                type="button"
                                className="text-white text-xs mt-3 cursor-pointer"
                                onClick={() => alert('Forgot password clicked')}
                                >
                                Forgot password ?
                            </button>
                        </div>
                        <div className="flex items-center my-5 w-full">
                            <hr className="flex-grow border-t border-gray-600"/>
                                <span className="mx-3 text-gray-400 text-xs font-noto">
                                    or
                                </span>
                            <hr className="flex-grow border-t border-gray-600"/>
                        </div>
                        <div className="flex mx-20 gap-4">
                            <Image src="/icons/google-logo.png" alt="google-logo" width={25} height={25} className="cursor-pointer" onClick={handleGoogleLogin}/>
                            <Image src="/icons/facebook-logo.png" alt="google-logo" width={25} height={25} className="cursor-pointer"/>
                            <Image src="/icons/github-logo.png" alt="google-logo" width={25} height={25} className="cursor-pointer"/>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="text-white text-xs mt-10 font-noto cursor-pointer"
                                onClick={() => router.push('/register')}
                                >
                                Don&#39;t have an account? Signup
                            </button>
                        </div>
                         <div className="flex mt-3 gap-7">
                            <button
                                type="button"
                                className="text-white text-xs font-noto cursor-pointer"
                                onClick={() => alert('Terms & Conditions clicked')}
                                >
                                Terms & Conditions
                            </button>
                            <button
                                type="button"
                                className="text-white text-xs font-noto cursor-pointer"
                                onClick={() => alert('Support clicked')}
                                >
                                Support
                            </button>
                            <button
                                type="button"
                                className="text-white text-xs font-noto cursor-pointer"
                                onClick={() => alert('Customer Care clicked')}
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