'use client';
import { useState } from "react";
import LoginButton from "@/components/login-button";
import FormInput from "@/components/formInput";
import Image from "next/image";

export default function Login() {
    const [email, setEmail] = useState('');
    const handleLogin = () => {
        console.log('Login: ')
    }

    return (
        <div className="flex"> {/* 2.5rem = 40px header height */}
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
            <div className="w-[45%] flex flex-col items-center justify-center">
                {/* Right column content */}
                <FormInput 
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    width="w-38"
                    height="h-8"
                />
                <LoginButton text="Login" onClick={handleLogin} width="w-38" height="h-8"/>
            </div>
        </div>
    );
}