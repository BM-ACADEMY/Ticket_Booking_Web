import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, User, Lock, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

const subAdminPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "subAdmin",
  });
  const [errors, setErrors] = useState({});
  const [role_id,setRoleId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/roles/fetch-all-roles`);
        const adminRole =  res.data?.roles?.find((r) => r.name === "subAdmin");
            console.log("subadmin Role:", adminRole);
        if (adminRole) {
      
          toast.success("Role fetched successfully");
          setForm((prev) => ({ ...prev, role: adminRole.name }));
          setRoleId(adminRole.role_id); // Assuming role_id is the ID of the role
        }
      } catch (err) {
        toast.error("Failed to fetch role");
        console.error("Failed to fetch role", err);
      }
    };
    fetchRole();
  }, []);

const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({ ...prev, [name]: value }));

  // Clear error for current field only
  setErrors((prevErrors) => {
    const newErrors = { ...prevErrors };
    delete newErrors[name];

    // Optional: real-time revalidation for confirmPassword
    if (name === "password" || name === "confirmPassword") {
      if (form.confirmPassword && value !== (name === "password" ? form.confirmPassword : form.password)) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    return newErrors;
  });
};

  const handleRegister = async () => {
    try {
      const newErrors = {};

      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";

      if (!form.phone.trim()) newErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";

      if (!form.password) newErrors.password = "Password is required";
      if (!form.confirmPassword) newErrors.confirmPassword = "Confirm your password";
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
      const adminForm={
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role_id: role_id, // Assuming role_id is the name of the role
      }
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/create-admin-and-subAdmin`, adminForm);
      // alert(res.data.message);
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/verify-otp`, {
        email: form.email,
        otp,
      });
 
       setOtpSent(false);
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
       setOtpSent(false);
    }
  };

  const renderRegistrationForm = () => (
    <>
      <Label className="text-sm">Name</Label>
      <div className="relative">
        <User className="absolute left-2 top-3 h-5 w-5 text-gray-500 align-middle" />
        <Input name="name" placeholder="Name" onChange={handleChange} className="pl-8" />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <Label className="text-sm">Email</Label>
      <div className="relative">
        <Mail className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input name="email" placeholder="Email" onChange={handleChange} className="pl-8" />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <Label className="text-sm">Phone</Label>
      <div className="relative">
        <Phone className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input name="phone" placeholder="Phone" onChange={handleChange} className="pl-8" />

        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <Label className="text-sm">Password</Label>
      <div className="relative">
        <Lock className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input type="password" name="password" placeholder="Password" onChange={handleChange} className="pl-8" />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <Label className="text-sm">Confirm Password</Label>
      <div className="relative">
        <Lock className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="pl-8" />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <Label className="text-sm">Role</Label>
      <div className="relative">
        <ShieldCheck className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input name="role" value={form.role} readOnly className="pl-8 bg-gray-100 text-gray-600" />
      </div>

      <Button className="w-full mt-4" onClick={handleRegister}>
        Register
      </Button>
    </>
  );

  const renderOtpForm = () => (
    <>
      <Label className="text-sm">Enter OTP sent to your email</Label>
      <Input placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
      <Button className="w-full mt-4" onClick={handleVerifyOtp}>
        Verify OTP
      </Button>
    </>
  );

return (
  <div className="flex flex-col lg:flex-row min-h-screen">
    {/* Left Side */}
    <div className="w-full lg:w-1/2 bg-gray-900 mb-3 rounded-sm text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Pegasus Sub Admin</h1>
      <p className="text-lg text-gray-300 text-center">
        This page is for registering a new <span className="text-white font-semibold">Sub Admin</span> to securely access and manage the platform.
      </p>
    </div>

    {/* Right Side */}
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-auto p-4 shadow-lg">
        <CardContent className="space-y-4">
          {otpSent ? renderOtpForm() : renderRegistrationForm()}
        </CardContent>
      </Card>
    </div>
  </div>
);

};

export default subAdminPage;
