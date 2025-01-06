import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog.tsx";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return validator.isEmail(email) ? "" : "Invalid email address";
  };

  const validatePassword = (password) => {
    return validator.isStrongPassword(password)
      ? ""
      : "Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character.";
  };

  const validateName = (name) => {
    if (!validator.isAlpha(name)) {
      return "Name must contain only Alphabets";
    }
    return "";
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "name")
      setErrors((prev) => ({ ...prev, name: validateName(form.name) }));
    if (name === "email")
      setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
    if (name === "password")
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(form.password),
      }));
  };

  const handleSubmit = async () => {
    if (form.name === "" || form.email === "" || form.password === "") {
      console.log("inside fist condition");
      setDialogContent({
        title: "Error",
        description: "Please fill all the fields",
      });
      setDialogOpen(true);
      return;
    }
    try {
      console.log("form in line25", form);
      const response = await axios.post(
        "http://localhost:3125/api/auth/signup",
        { form }
      );
      setSuccess(true);
      setDialogContent({
        title: "Registration Success",
        description: "You have successfully registered your account.",
      });
      setDialogOpen(true);
      console.log("Response in line 25", response);
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setDialogContent({
        title: "Registration Error",
        description: "There was an error registering your account.",
      });
      setDialogOpen(true);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const authHandler = (err, data) => {
    if (err) {
      console.error("Login Error:", err);
      return;
    }
    console.log("Login Success:", data);
  };

  return (
    <div className="flex justify-center mt-10">
      <div
        className="border-2 relative h-auto w-[30%] border-black rounded-3xl shadow-2xl bg-cover"
        style={{ backgroundImage: "url('formBG.png')" }}
      >
        <div className="p-4 ml-2">
          <div className="font-extrabold text-5xl mt-4">
            <h2 className="text-center text-white">REGISTER</h2>
          </div>
          <div className="flex flex-col mt-2 relative">
            <input type="hidden" value="something" />
            <input
              placeholder="Enter Name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              value={form.name}
              className={` rounded-full text-white h-14 w-[100%] pl-10 pr-12 border  bg-transparent ${
                touched.name && errors.name ? "border-red-500" : ""
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-red-500 ml-6 text-sm font-extrabold mt-2">
                {errors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col mt-10 relative">
            <input type="hidden" value="something" />
            <input
              placeholder="Enter Email"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              value={form.email}
              className={`border text-white  bg-transparent rounded-full h-14 w-[100%] pl-10 pr-12 ${
                touched.email && errors.email ? "border-red-500" : ""
              }`}
            />
            <Mail className="absolute right-6 mt-3 text-gray-200" />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm ml-6 font-extrabold mt-2">
                {errors.email}
              </p>
            )}
          </div>
          <div className="flex flex-col mt-10 relative">
            <input type="password" name="password" className="hidden" />
            <input
              autoComplete="new-password"
              placeholder="Enter Password"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              value={form.password}
              className={`border text-white bg-transparent rounded-full h-14 w-[100%] pl-10 pr-12 ${
                touched.password && errors.password ? "border-red-500" : ""
              }`}
            />
            <Lock className="absolute right-6 mt-3 text-gray-200" />
            {touched.password && errors.password && (
              <p className="text-red-500 ml-6 text-sm mt-2 font-extrabold">
                {errors.password}
              </p>
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
              className="bg-transparent border border-white font-extrabold text-2xl hover:bg-gray-50 hover:border-black text-white w-[100%] mt-2 h-14 rounded-full"
            >
              Register
            </button>
          </div>
          <div className="mt-2">
            <p className="text-center text-white">
              Have an account?{" "}
              <span
                onClick={handleLogin}
                className="underline underline-offset-1 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
          <div className="flex justify-center mt-2">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                axios
                  .post("http://localhost:3125/api/auth/google", {
                    token: credentialResponse.credential,
                  })
                  .then((response) => {
                    console.log("Google Login Success:", response.data);
                    setSuccess(true);
                  })
                  .catch((error) => {
                    console.error("Google Login Error:", error);
                  });
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="h-[200px]">
              <DialogHeader>
                <DialogTitle
                  className={`${
                    dialogContent.title === "Error"
                      ? "text-red-600"
                      : "text-blue-700"
                  }`}
                >
                  <p className="text-4xl">{dialogContent.title}</p>
                </DialogTitle>
                <DialogDescription>
                  <p className="mt-20 text-xl">{dialogContent.description}</p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Register;
