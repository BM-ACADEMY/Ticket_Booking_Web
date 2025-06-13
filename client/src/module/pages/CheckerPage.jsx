import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Phone, User, Lock, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import CheckerList from "./CheckerList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CheckerPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Checker",
    role_id: "",
  });
  const [errors, setErrors] = useState({});
  const [role_id, setRoleId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const hasFetched = useRef(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRole = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/roles/fetch-all-roles`, {
          withCredentials: true,
        });
        const adminRole = res.data?.roles?.find((r) => r.name === "Checker");
        if (adminRole) {
          toast.success("Role fetched successfully");
          setForm((prev) => ({ ...prev, role: adminRole.name, role_id: adminRole.role_id }));
          setRoleId(adminRole.role_id);
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

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];

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

      if (!editingAdmin) {
        if (!form.password) newErrors.password = "Password is required";
        if (!form.confirmPassword) newErrors.confirmPassword = "Confirm your password";
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;

      const adminForm = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role_id: form.role_id || role_id,
      };

      if (!editingAdmin) {
        adminForm.password = form.password;
        adminForm.confirmPassword = form.confirmPassword;
      }

      if (editingAdmin) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/update-admin-and-subAdmin/${editingAdmin._id}`,
          adminForm,
          { withCredentials: true }
        );
        toast.success("Checker updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/create-admin-and-subAdmin`,
          adminForm,
          { withCredentials: true }
        );
        setOtpSent(true);
        toast.success("Checker created successfully. OTP sent.");
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "Checker",
        role_id: role_id,
      });
      setEditingAdmin(null);
    //   setOtpSent(true);
      setRefresh(!refresh); // Trigger CheckerList re-render
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/verify-otp`,
        { email: form.email, otp },
        { withCredentials: true }
      );
      toast.success("OTP verified successfully");
      setOtpSent(false);
      setRefresh(!refresh); // Trigger CheckerList re-render
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
      setOtpSent(false);
    }
  };

  const handleEdit = (admin) => {
    setForm({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      password: "",
      confirmPassword: "",
      role: "Checker",
      role_id: admin.role_id,
    });
    setEditingAdmin(admin);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/delete-admin-and-subAdmin/${adminToDelete}`,
        { withCredentials: true }
      );
      toast.success("Checker deleted successfully");
      setRefresh(!refresh); // Trigger CheckerList re-render
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete checker");
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    }
  };

  const renderRegistrationForm = () => (
    <>
      <Label className="text-sm">Name</Label>
      <div className="relative">
        <User className="absolute left-2 top-3 h-5 w-5 text-gray-500 align-middle" />
        <Input name="name" value={form.name} placeholder="Name" onChange={handleChange} className="pl-8" />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <Label className="text-sm">Email</Label>
      <div className="relative">
        <Mail className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input name="email" value={form.email} placeholder="Email" onChange={handleChange} className="pl-8" />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <Label className="text-sm">Phone</Label>
      <div className="relative">
        <Phone className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input name="phone" value={form.phone} placeholder="Phone" onChange={handleChange} className="pl-8" />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      {!editingAdmin && (
        <>
          <Label className="text-sm">Password</Label>
          <div className="relative">
            <Lock className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="password"
              name="password"
              value={form.password}
              placeholder="Password"
              onChange={handleChange}
              className="pl-8"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <Label className="text-sm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              placeholder="Confirm Password"
              onChange={handleChange}
              className="pl-8"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
        </>
      )}

      <Label className="text-sm">Role</Label>
      <div className="relative">
        <ShieldCheck className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        <Input name="role" value={form.role} readOnly className="pl-8 bg-gray-100 text-gray-600" />
      </div>

      <Button className="w-full mt-4" onClick={handleRegister}>
        {editingAdmin ? "Update Checker" : "Register"}
      </Button>
    </>
  );

  const renderOtpForm = () => (
    <>
      <Label className="text-sm">Enter OTP sent to your email</Label>
      <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <Button className="w-full mt-4" onClick={handleVerifyOtp}>
        Verify OTP
      </Button>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <h2
        className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
        style={{ backgroundColor: "#030049" }}
      >
        Create Checker
      </h2>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/2 bg-[#030049] text-white flex items-center justify-center p-6 sm:p-10">
          <div className="text-center max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">
              Welcome to Pegasus Checker
            </h1>
            <p className="text-md sm:text-lg text-gray-300">
              This page is for registering a new{" "}
              <span className="text-white font-semibold">Checker</span> to securely access and manage the platform.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-6 sm:p-10">
          <Card className="w-full max-w-md mx-auto p-4 sm:p-6 shadow-lg">
            <CardContent className="space-y-4">
              {otpSent ? renderOtpForm() : renderRegistrationForm()}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-5">
        <CheckerList
          onEdit={handleEdit}
          onDelete={(adminId) => {
            setAdminToDelete(adminId);
            setShowDeleteDialog(true);
          }}
          refresh={refresh}
        />
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this checker? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckerPage;