import React, { useEffect, useState } from 'react'
import style from './Login.module.css'
import { useFormik } from 'formik'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    let navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogin(values) {
        try {
            const { data } = await axios.post(`https://crudsystemapp.eu-4.evennode.com/auth/login`, values, {
                headers: {
                    "accept-language": "en",
                    "Access-Control-Allow-Origin": "*"
                }, withCredentials: true
            })

            let token = data.data.token
            localStorage.setItem("Authentication", JSON.stringify(token))
            navigate('/')
        } catch (error) {
            if (error.response.status = 400) {
                setErrorMessage("In-Valid Email or Password")
            }
            console.log(error);
        }

    }
    function validateForm(values) {
        let errors = {};
        if (!values.email) {
            errors.email = "Email is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors

    }
    let formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        }, validate: validateForm
        , onSubmit: handleLogin
    })
    return <>
        <div className="main bg-slate-800 h-screen flex items-center">
            <div className=" min-w-[250px] max-w-[500px] w-4/5 bg-w p-10 py-20 rounded-md mx-auto shadow-xl bg-slate-700">
                <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto">
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                        <input type="email" value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Philopater.safwat@gmail.com" />
                        {formik.errors.email && formik.touched.email && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-3" role="alert">
                            {formik.errors.email}
                        </div>}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Your password</label>
                        <input type="password" onBlur={formik.handleBlur} value={formik.values.password} onChange={formik.handleChange} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        {formik.errors.password && formik.touched.password && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-3" role="alert">
                            {formik.errors.password}
                        </div>}
                    </div>
                    <div className={`${!errorMessage ? "hidden" : ''} flex items-center p-4 mb-4 text-sm text-red-500 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert`}>
                        <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                            {errorMessage}
                        </div>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
                    <a onClick={() => { navigate("/signup") }} className="cursor-pointer text-sm  text-blue-300 hover:underline mx-5">Signup?</a>
                </form>
            </div>
        </div>

    </>
}

