'use client';
import { useState } from "react";
import LoginButton from "@/components/login-button";
import FormInput from "@/components/formInput";

export default function Login(){
    const [email, setEmail] = useState('');
    const handleLogin = () =>{
        console.log('Login: ')
    }
    console.log(email);
    return (
        <div>Logim
            <div>
                <LoginButton text="Login" onClick={handleLogin} width="400px" height="55px"/>
            </div>
            <div>
                <FormInput 
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    width="400px"
                    height="55px"
                />
            </div>
        </div>
        
    );
}