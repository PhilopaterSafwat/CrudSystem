import React, { useEffect, useState } from 'react'
import style from './Signup.module.css'
import { useFormik } from 'formik'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    let navigate = useNavigate()
    const [ferror, setFerror] = useState(null)

    async function handlesignup(values) {
        try {
            const { data } = await axios.post(`http://51.21.216.100/auth/signup`, values, {
                headers: {
                    "accept-language": "en"
                }
            })
            navigate(`/Otp/${values.email}`)
        } catch (error) {
            console.log(error?.response?.data?.msg);
            if (error?.response?.data?.msg == "Email is aleardy exist") {
                setFerror(error?.response?.data?.msg)
            }
        }

    }
    function validateForm(values) {
        let errors = {};
        if (!values.userName) {
            errors.userName = "userName is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = "Invalid email format";
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)) {
            errors.password = "Password must be 8 have one capital char and one sign like !~#$!@% and numbers";
        }

        if (values.password !== values.confirmationPassword) {
            errors.confirmationPassword = "Passwords do not match";
        }

        return errors

    }
    let formik = useFormik({
        initialValues: {
            userName: "",
            email: "",
            password: "",
            confirmationPassword: ""

        }, validate: validateForm
        , onSubmit: handlesignup
    })
    return <>
        <div className="main bg-slate-800 h-screen flex items-center">
            <div className=" min-w-[250px] max-w-[500px] w-4/5 bg-w p-10 py-20 rounded-md mx-auto shadow-xl bg-slate-700">
                <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto">
                    <div className="mb-5">
                        <label htmlFor="userName" className="block mb-2 text-sm font-medium text-white">Your userName</label>
                        <input type="text" value={formik.values.userName} onBlur={formik.handleBlur} onChange={formik.handleChange} id="userName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Philopater" />
                        {formik.errors.userName && formik.touched.userName && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-3" role="alert">
                            {formik.errors.userName}
                        </div>}
                    </div>
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
                    <div className="mb-5">
                        <label htmlFor="confirmationPassword" className="block mb-2 text-sm font-medium text-white">Your confirmation Password</label>
                        <input type="password" onBlur={formik.handleBlur} value={formik.values.confirmationPassword} onChange={formik.handleChange} id="confirmationPassword" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        {formik.errors.confirmationPassword && formik.touched.confirmationPassword && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-3" role="alert">
                            {formik.errors.confirmationPassword}
                        </div>}
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">SignUp</button>
                    <a onClick={() => { navigate("/login") }} className="cursor-pointer text-sm  text-blue-300 hover:underline mx-5">Login?</a>

                </form>
            </div>
        </div>

    </>
}

