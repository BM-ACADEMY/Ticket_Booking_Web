"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const VerifyOtpForm = ({ className, ...props }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/verify-otp`,
        { email, otp }
      );
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      console.error("OTP verification failed:", error.response?.data || error.message);
    }
  };

  return (
    <div
      className={cn("flex min-h-screen items-center justify-center p-4", className)}
      {...props}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Verify Your Email</h1>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit OTP sent to {email}
              </p>
            </div>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full">
              Verify OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtpForm;