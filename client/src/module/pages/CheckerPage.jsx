
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
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch role on mount
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRole = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  // Validate form fields on change
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      let valid = true;

      if (!otpSent) {
        // Registration/Edit form validation
        if (!form.name.trim()) {
          newErrors.name = "Name is required";
          valid = false;
        }
        if (!form.email.trim()) {
          newErrors.email = "Email is required";
          valid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
          newErrors.email = "Invalid email format";
          valid = false;
        }
        if (!form.phone.trim()) {
          newErrors.phone = "Phone is required";
          valid = false;
        } else if (!/^\d{10}$/.test(form.phone)) {
          newErrors.phone = "Phone must be 10 digits";
          valid = false;
        }

        if (!editingAdmin) {
          if (!form.password) {
            newErrors.password = "Password is required";
            valid = false;
          } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
          }
          if (!form.confirmPassword) {
            newErrors.confirmPassword = "Confirm your password";
            valid = false;
          } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            valid = false;
          }
        }
      } else {
        // OTP form validation
        if (!otp.trim()) {
          newErrors.otp = "OTP is required";
          valid = false;
        } else if (otp.length !== 6) {
          newErrors.otp = "OTP must be 6 digits";
          valid = false;
        }
      }

      setErrors(newErrors);
      setIsFormValid(valid);
    };
    validateForm();
  }, [form, otp, otpSent, editingAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for the changed field
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleRegister = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
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
        toast.success("Checker created successfully. OTP sent.");
        setOtpSent(true);
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
      setRefresh(!refresh);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/verify-otp`,
        { email: form.email, otp },
        { withCredentials: true }
      );
      toast.success("OTP verified successfully");
      setOtp("");
      setOtpSent(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "Checker",
        role_id: role_id,
      });
      setRefresh(!refresh);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
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
    setOtpSent(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/delete-admin-and-subAdmin/${adminToDelete}`,
        { withCredentials: true }
      );
      toast.success("Checker deleted successfully");
      setRefresh(!refresh);
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete checker");
      setShowDeleteDialog(false);
      setAdminToDelete(null);
    } finally {
      setLoading(false);
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

      <Button
        className="w-full mt-4 cursor-pointer flex items-center justify-center"
        onClick={handleRegister}
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <span className="inline-flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          editingAdmin ? "Update Checker" : "Register"
        )}
      </Button>
    </>
  );

  const renderOtpForm = () => (
    <>
      <Label className="text-sm">Enter OTP sent to your email</Label>
      <Input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value);
          setErrors((prev) => ({ ...prev, otp: "" }));
        }}
      />
      {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
      <Button
        className="w-full mt-4 cursor-pointer flex items-center justify-center"
        onClick={handleVerifyOtp}
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <span className="inline-flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          "Verify OTP"
        )}
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
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckerPage;