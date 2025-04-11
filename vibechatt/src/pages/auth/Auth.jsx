import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiClient } from '@/lib/api-client'
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants'
import { TabsContent } from '@radix-ui/react-tabs'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'


const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const resetField = () => {
        setEmail("")
        setPassword("")
        setConfirmPassword("")
    }

    //validation before sign up process
    const validateSignUp = () => {
        if (!email.length) {
            toast.error("Email is required")
            return false;
        }
        if (!password.length) {
            toast.error("Password is required")
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("password and confirm password should be same")
            return false;
        }

        return true;
    }

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required")
            return false;
        }
        if (!password.length) {
            toast.error("Password is required")
            return false;
        }
        return true;
    }


    //handle login and sign up process
    const handelLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(SIGNIN_ROUTE, { email, password }, { withCredentials: true })
            console.log(response)
            resetField();
            if (response.data.user.profileSetup) navigate("/chat");
            else navigate("/profile");
        }
    }

    const handleSignUp = async () => {
        if (validateSignUp()) {
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true })
            resetField();
            if (response.data.user.profileSetup) navigate("/chat");
            else navigate("/profile");
        }
    }

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center">
            <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">
                                Welcome
                            </h1>
                            <img src={Victory} alt="victory emoji" className='h-[100px]' />
                        </div>
                        <p className='font-medium text-center'>
                            Fill in the details to get started with a best chat app
                        </p>
                    </div>

                    {/* Login and SignUp Content*/}
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" value="login">Login</TabsTrigger>
                                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300" value="signup">SignUp</TabsTrigger>
                            </TabsList>
                            <TabsContent className='flex flex-col gap-5 mt-10' value='login'>
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)}>
                                </Input>
                                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)}>
                                </Input>
                                <Button className="rounded-full p-6" onClick={handelLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className='flex flex-col gap-5 mt-10' value='signup'>
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)}>
                                </Input>
                                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)}>
                                </Input>
                                <Input placeholder="Confirm Password" type="password" className="rounded-full p-6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                                </Input>
                                <Button className="rounded-full p-6" onClick={handleSignUp}>SignUp</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="Background Login" className='h-[500px]' />
                </div>
            </div>
        </div>
    )
}

export default Auth
