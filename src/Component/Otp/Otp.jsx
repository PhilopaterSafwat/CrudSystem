import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

export default function Otp() {
    const navigate = useNavigate("")
    const { email } = useParams();
    const [errorMessage, setErrorMessage] = useState("");

    async function handleOtp(values) {
        try {
            const { data } = await axios.patch(
                `https://crudsystemapp.eu-4.evennode.com/auth/confirm-email`,
                { otp: values.code, email },
                {
                    headers: {
                        "accept-language": "en"
                    }
                }
            );
            console.log(data);
            
            if (data.message = "confirm-email") {
                navigate("/login")
            }
        } catch (error) {
            console.log(error);

            setErrorMessage(error.response?.data?.message || "in_valid OTP");
        }
        // navigate("/login")
    }

    function validateForm(values) {
        let errors = {};
        if (!values.code) {
            errors.code = "OTP is required";
        } else if (values.code.length !== 4) {
            errors.code = "OTP must be 4 digits";
        }
        return errors;
    }

    const formik = useFormik({
        initialValues: { code: "" },
        validate: validateForm,
        onSubmit: handleOtp,
    });

    return (
        <div className="main bg-slate-800 h-screen flex items-center">
            <div className="min-w-[250px] max-w-[500px] w-4/5 bg-w p-10 py-20 rounded-md mx-auto shadow-xl bg-slate-700 flex items-center flex-col">
                <h2 className="text-white text-center text-3xl font-bold mb-4">Verify OTP</h2>
                {errorMessage && (
                    <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={formik.handleSubmit} className="w-full mx-auto">
                    <div className="mb-5">
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter OTP"
                        />
                        {formik.errors.code && formik.touched.code && (
                            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-3" role="alert">
                                {formik.errors.code}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-5"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
