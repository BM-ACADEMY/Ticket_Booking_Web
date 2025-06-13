import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  AwardIcon,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { toast } from "react-toastify"

const UserProfileUpdateForm = () => {
  const { user } = useAuth();
  console.log("user in profile update form", user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
    role_id: user?.role?.role_id || "", // Access role_id from nested role object
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin-and-subAdmin/update-admin-and-subAdmin/${user?._id}`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        { withCredentials: true }
      )
      toast.success(res.data.message || "Profile updated successfully!")
      console.log("Profile updated successfully:", res)
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile")
      console.error("Failed to update profile. Please try again later.", error)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto mt-10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-4 text-center text-white p-2 rounded-sm"
          style={{ backgroundColor: "#030049" }}>Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center mb-3 gap-2" htmlFor="name">
                <User className="w-4 h-4" /> Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label className="flex items-center mb-3 gap-2" htmlFor="email">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label className="flex items-center mb-3 gap-2" htmlFor="phone">
                <Phone className="w-4 h-4" /> Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center mb-3 gap-2" htmlFor="password">
                <Lock className="w-4 h-4" /> New Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password"
              />
            </div>
            <div>
              <Label className="flex items-center mb-3 gap-2" htmlFor="confirmPassword">
                <Lock className="w-4 h-4" /> Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </div>

            <div>
              <Label className="flex items-center mb-3 gap-2" htmlFor="role">
                <AwardIcon className="w-4 h-4" /> Role
              </Label>
              <Input
                id="role"
                name="role"
                value={`${user?.role?.name || "N/A"} (ID: ${formData.role_id})`}
                readOnly
                className="cursor-not-allowed bg-muted"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full flex items-center gap-2 mt-4">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserProfileUpdateForm
