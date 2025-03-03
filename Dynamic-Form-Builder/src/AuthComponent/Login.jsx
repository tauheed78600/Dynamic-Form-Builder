import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog.tsx';

function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [dialogContent, setDialogContent] = useState({ title: '', description: '' });
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email) => {
        if (email === '') {
            return 'Email cannot be empty'
        }
        return validator.isEmail(email) ? '' : 'Invalid email address';
    };

    const validatePassword = (password) => {
        if (password === '') {
            return 'Password cannot be empty'
        }
        return validator.isStrongPassword(password)
            ? ''
            : 'Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character.';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
        // Clear errors when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (name === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
        if (name === 'password') setErrors((prev) => ({ ...prev, password: validatePassword(form.password) }));
    };

    const handleSubmit = async () => {
        setTouched({
            email: true,
            password: true
        });

        const emailError = validateEmail(form.email);
        const passwordError = validatePassword(form.password);
        
        setErrors({
            email: emailError,
            password: passwordError
        });

        if (!emailError && !passwordError) {
            try {
                const response = await axios.post('http://localhost:3125/api/auth/signin', { form });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userid', response.data.id)
                navigate(`/clients/${response.data.id}`);

            } catch (err) {
                console.error('Error:', err);
                setDialogContent({ title: 'Error', description: 'There was an error logging into your account.' });
                setDialogOpen(true);
            }
        }
    };

    const handleReg = () => {
        navigate('/register');
    };

    return (
        <div className="flex justify-center mt-10">
            <div
                className="border-2 relative h-auto lg:w-[30%]  rounded-3xl shadow-2xl bg-cover bg-blue-600"
            >
                <div className="p-4 ml-2">
                    <div className="font-extrabold text-5xl mt-4">
                        <h2 className="text-center text-white">LOGIN</h2>
                    </div>
                    <div className="flex flex-col mt-2 relative">
                        <input
                            placeholder="Enter Email"
                            type="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            name="email"
                            value={form.email}
                            className={`border text-white border-white bg-transparent rounded-full h-14 w-[100%] pl-10 pr-12 ${(touched.email && errors.email) ? 'border-red-500' : ''}`}
                        />
                        <Mail className="absolute right-6 mt-3 text-gray-200" />
                        {touched.email && errors.email && (
                            <p className="text-red-500 ml-6 text-sm font-extrabold mt-2">{errors.email}</p>
                        )}
                    </div>
                    <div className="flex flex-col mt-10 relative">
                        <input
                            placeholder="Enter Password"
                            type="password"
                            onChange={handleChange}
                            autoComplete="off"
                            onBlur={handleBlur}
                            name="password"
                            value={form.password}
                            className={`border text-white border-white bg-transparent rounded-full h-14 w-[100%] pl-10 pr-12 ${(touched.password && errors.password) ? 'border-red-500' : ''}`}
                        />
                        <Lock className="absolute right-6 mt-3 text-gray-200" />
                        {touched.password && errors.password && (
                            <p className="text-red-500 ml-6 text-sm mt-2 font-extrabold">{errors.password}</p>
                        )}
                    </div>
                    <div className="text-left mt-2 flex gap-2">
                        <input type="checkbox" id="rememberMe" className="mt-1" />
                        <label className="text-white">Remember me</label>
                    </div>
                    <div>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="bg-transparent text-white border border-white font-extrabold text-2xl hover:bg-gray-50 hover:border-black w-[100%] mt-2 h-14 rounded-full"
                        >
                            Login
                        </button>
                    </div>
                    <div className="mt-2">
                        <p className="text-center text-white">
                            Don't have an account?{' '}
                            <span onClick={handleReg} className="underline underline-offset-1 cursor-pointer">
                                Register
                            </span>
                        </p>
                    </div>
                    <div className="flex justify-center mt-2">
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                axios.post('http://localhost:3125/api/auth/google', {
                                    token: credentialResponse.credential,
                                })
                                    .then((response) => {
                                        console.log('Google Login Success:', response.data);
                                        setDialogContent({ title: 'Login Success', description: 'You have successfully logged into your account.' });
                                        setDialogOpen(true);
                                        localStorage.setItem('token', response.data.token)
                                        localStorage.setItem('userid', response.data.user._id)
                                        setTimeout(() => {
                                            navigate(`/clients/${response.data.user._id}`);
                                        }, 2000);
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                        setDialogContent({ title: 'Error', description: 'There was an error logging into your account.' });
                                        setDialogOpen(true);
                                    });
                            }}
                            onError={() => {
                                console.log('Login Failed');
                                setDialogContent({ title: 'Error', description: 'There was an error logging into your account.' });
                                setDialogOpen(true);
                            }}
                        />
                    </div>
                </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="h-auto">
                    <DialogHeader>
                        <DialogTitle className={`${dialogContent.title === 'Error' ? 'text-red-600' : 'text-blue-700'}`}>
                            <span className="text-4xl">{dialogContent.title}</span>
                        </DialogTitle>
                        <DialogDescription>
                            <span className=" text-xl">{dialogContent.description}</span>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Login;