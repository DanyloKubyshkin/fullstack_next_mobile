import LoginPage from "@/components/Login/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'University Management/Login',
    description: 'Generated by create next app',
}
const Login = () => {
    return (
        <>
            <LoginPage />
        </>
    )
}

export default Login;