'use client'

import { useLogin } from "@/services/react-query/queries/useLogin"
import { type SubmitHandler, useForm } from "react-hook-form"

type Inputs = {
    email: string
    password: string
}

const LoginPage = () => {
    const {
        register,
        handleSubmit
    } = useForm<Inputs>()
    const { mutateAsync: login } = useLogin()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { email, password } = data
        await login({ email, password })
    }

    return (
        <div className="w-screen h-screen bg-[#f48585] flex flex-col">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("email", { required: true })}
                    type="email"
                    placeholder="Enter your email"
                />
                <input {...register("password", { required: true })}
                    type="password"
                    placeholder="Enter your password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginPage