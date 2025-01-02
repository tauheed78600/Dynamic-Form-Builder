import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import MicrosoftLogin from "react-microsoft-login";
import validator from 'validator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
        return validator.isEmail(email) ? '' : 'Invalid email address';
    };

    const validatePassword = (password) => {
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
        setErrors('');
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (name === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
        if (name === 'password') setErrors((prev) => ({ ...prev, password: validatePassword(form.password) }));
    };

    const handleSubmit = async () => {
        if (!errors.email && !errors.password) {
            try {
                const response = await axios.post('http://localhost:3125/api/auth/signin', { form });
                console.log("response in line 65", response)
                setDialogContent({ title: 'Login Success', description: 'You have successfully logged into your account.' });
                setDialogOpen(true);
                localStorage.setItem('token', response.data.token)
                setTimeout(()=>{
                    navigate('/form-builder')   
                }, 2000)
            } catch (err) {
                console.error('Error:', err);
                setDialogContent({ title: 'Login Error', description: 'There was an error logging into your account.' });
                setDialogOpen(true);
            }
        } else {
            console.error("Validation errors", errors);
        }
    };

    const handleReg = () => {
        navigate('/register');
    };

    const authHandler = (err, data) => {
        if (err) {
            console.error("Login Error:", err);
            return;
        }
        console.log("Login Success:", data);
    };

    return (
        <div className='flex justify-center'>
            <div
                className='border-2 relative h-[600px] w-[500px] border-black rounded-3xl shadow-2xl bg-cover'
                style={{ backgroundImage: "url('bgImage.png')" }}
            >
                <div className='p-4'>
                    <div className='font-extrabold text-5xl mt-4'>
                        <h2 className='text-center'>LOGIN</h2>
                    </div>
                    <div className='flex flex-col mt-10 relative'>
                        <input
                            placeholder='Enter Email'
                            type='email'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name='email'
                            value={form.email}
                            className={`border-black ml-8 rounded-full h-14 w-[400px] pl-10 pr-12 ${touched.email && errors.email ? 'border-red-500' : ''
                                }`}
                        />
                        <Mail className='absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-sm ml-10 mt-2">{errors.email}</p>
                        )}
                    </div>
                    <div className='flex flex-col mt-10 relative'>
                        <input
                            placeholder='Enter Password'
                            type='password'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name='password'
                            value={form.password}
                            className={`border-black ml-8 rounded-full h-14 w-[400px] pl-10 pr-12 ${touched.password && errors.password ? 'border-red-500' : ''
                                }`}
                        />
                        <Lock className='absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        {touched.password && errors.password && (
                            <p className="text-red-500 text-sm ml-10 mt-2">{errors.password}</p>
                        )}
                    </div>
                    <div className='text-left mt-4 ml-10 flex gap-2'>
                        <input type='checkbox' id="rememberMe" className='mt-1' />
                        <label>Remember me</label>
                    </div>
                    <div>
                        <button
                            onClick={handleSubmit}
                            type='submit'
                            className='bg-white text-black font-extrabold text-2xl hover:bg-gray-50 hover:border-black border-black w-[400px] mt-4 h-14 rounded-full ml-8'
                        >
                            Login
                        </button>
                    </div>
                    <div className='mt-2'>
                        <p className='text-center'>
                            Don't have an account?{' '}
                            <span onClick={handleReg} className='underline underline-offset-1 cursor-pointer'>
                                Register
                            </span>
                        </p>
                    </div>
                    <div className='flex justify-center mt-2'>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                axios.post('http://localhost:3125/api/auth/google', {
                                    token: credentialResponse.credential,
                                })
                                    .then((response) => {
                                        console.log("Google Login Success:", response.data);
                                        setDialogContent({ title: 'Login Success', description: 'You have successfully logged into your account.' });
                                        setDialogOpen(true);
                                    })
                                    .catch((error) => {
                                        console.error("Google Login Error:", error);
                                        setDialogContent({ title: 'Login Error', description: 'There was an error logging into your account.' });
                                        setDialogOpen(true);
                                    });
                            }}
                            onError={() => {
                                console.log('Login Failed');
                                setDialogContent({ title: 'Login Error', description: 'There was an error logging into your account.' });
                                setDialogOpen(true);
                            }}
                        />
                    </div>
                    <div className='flex justify-center mt-4'>
                        <MicrosoftLogin
                            clientId={'1e2c7516-159e-40d7-ace6-3110a526b710'}
                            authCallback={authHandler}
                        />
                    </div>
                </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className='h-[200px]'>
                    <DialogHeader>
                        <DialogTitle className={`${dialogContent.title === 'Login Error' ? 'text-red-600' : 'text-blue-700'}`}>
                            {dialogContent.title}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogContent.description}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Login;