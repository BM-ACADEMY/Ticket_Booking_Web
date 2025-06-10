import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-toastify"

const ResetPasswordForm = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState("")

  const handleReset = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setStatus("Passwords do not match.")
    }

    try {
     const res= await axios.post(`${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/reset-password/${token}`, { password })
        console.log("Response from reset password:", res);
        toast.success("Password updated successfully.")
      setStatus("Password updated successfully.")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      toast.error("Failed to reset password. Please try again.")
      console.error(err)
      setStatus("Invalid or expired token.")
    }
  }

return (
  <div className="flex min-h-screen items-center justify-center p-4">
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-6 space-y-4">
        {/* Info Box */}
        <div className="bg-gray-100 rounded-md p-4 text-left">
          <h3 className="text-base font-bold text-black">Reset your password</h3>
          <p className="text-sm text-gray-500 mt-1">
            Enter a new password and confirm it below. Make sure it's strong and secure. Once submitted, you can log in with the new credentials.
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold">Reset Password</h2>

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>

        {/* Status */}
        {status && <p className="text-sm text-center text-muted-foreground">{status}</p>}
      </CardContent>
    </Card>
  </div>
);

}

export default ResetPasswordForm
