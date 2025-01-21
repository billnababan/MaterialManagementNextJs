"use client";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { AiFillEyeInvisible } from "react-icons/ai";
import { IoEyeSharp } from "react-icons/io5";
import { TbPassword } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../utils/Api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const LoginPage = () => {
  const { register, handleSubmit, formState } = useForm();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.username, data.password);
      console.log(response.data);

      if (response.data) {
        const userRole = response.data.department;
        const userData = { username: data.username, department: userRole };

        // Save token and role to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", userRole);

        login(userData);

        if (userRole === "WAREHOUSE") {
          Swal.fire("Success", "Login as Warehouse", "success");
          router.push("/pages/dashboard");
        } else if (userRole === "PRODUCTION") {
          Swal.fire("Success", "Login as Production", "success");
          router.push("/pages/request");
        } else {
          toast.error("Access denied: Role not recognized.");
        }
      }
    } catch (error) {
      toast.error("Username or password is incorrect.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Column */}
      <div className="w-1/2 bg-cyan-500 flex flex-col items-center justify-center">
        <img src="/assets/bgWebsite.jpg" alt="Login" className="w-full h-full object-cover" />
      </div>

      {/* Right Column */}
      <div className="w-1/2 bg-blue-500 flex items-center justify-center">
        {/* // <h2 className="text-2xl flex justify-center text-center">Login</h2> */}
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-10 mt-5 text-black gap-4 w-[450px]">
          {formState.errors.username && <span className="text-red-600">Only letters and numbers are allowed for username.</span>}
          <div className="input input-bordered flex justify-between w-full gap-5 items-center bg-[#f2f4f6] border border-black focus-within:ring-1 focus-within:ring-black">
            <FaUser />
            <input
              type="text"
              className="w-full bg-[#f2f4f6] -ml-1 placeholder:text-tertiary placeholder:tracking-widest placeholder:text-xs placeholder:font-bold"
              {...register("username", {
                required: true,
                maxLength: 75,
                pattern: /^[A-Za-z0-9]+$/i,
              })}
              placeholder="username"
            />
          </div>

          {formState.errors.password && <span className="text-red-600">Password is required.</span>}
          <div className="input input-bordered flex justify-between w-full gap-5 items-center bg-[#f2f4f6] border border-black focus-within:ring-1 focus-within:ring-black">
            <TbPassword size={25} />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: true })}
              placeholder="password"
              className="w-full bg-[#f2f4f6] -ml-2 placeholder:text-tertiary placeholder:tracking-widest placeholder:text-xs placeholder:font-bold"
            />
            {showPassword ? <AiFillEyeInvisible size={25} onClick={togglePasswordVisibility} /> : <IoEyeSharp size={25} onClick={togglePasswordVisibility} />}
          </div>
          <button className="btn bg-black text-white border-black hover:border-white hover:text-black">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
