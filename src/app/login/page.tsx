'use client';
import LoginButton from "@/components/login-button";

export default function Login(){
    const handleLogin = () =>{
        console.log('Login: ')
    }
    return (
        <div>Logim
            <div>
                <LoginButton text="Login" onClick={handleLogin} width="400px" height="55px"/>
            </div>
        </div>
        
    );
}