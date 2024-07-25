import React, { useState } from "react";
import { apiPost } from "../utils/api";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setErrorMessage("Please enter username and password.");
            return;
        }

        try {
            const res = await apiPost("user/login", { username, password });
            if (res.code === 200) {
                sessionStorage.setItem("token", res.data[0].token);
                localStorage.setItem("user", JSON.stringify(res.data[0].UserData));
                window.location.href = "/";
            } else {
                setErrorMessage(res.message);
            }
        } catch (error) {
            console.error("API call failed:", error);
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-36 w-auto"
                    src="./vetpetso.jpg"
                    alt="VetPetSo"
                    style={{mixBlendMode: 'multiply'}}
                />
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {errorMessage && <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.trim())}
                            className="w-full mt-2 px-3 py-1.5 ring-gray-300 rounded-md ring-inset ring-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="flex mt-2 items-center ring-gray-300 rounded-md ring-inset ring-1 px-3 focus-within:ring-1 focus-within:ring-indigo-500">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value.trim())}
                                className="w-full py-1.5 bg-transparent focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                {showPassword ? (
                                    <IoMdEye className="h-6 w-6" />
                                ) : (
                                    <IoMdEyeOff className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                    <button type="submit"
                        className="flex mt-8 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    >Login</button>
                </form>

            </div>
        </div>
    );
};

export default LoginPage;
