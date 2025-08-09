import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, MapPin, Calendar, Edit3, Save, X, Camera, Phone, Globe, Briefcase } from "lucide-react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { navigate } from "wouter/use-browser-location"

interface UserProfile {
  name: string
  email: string
  location: string
  website: string
  phone: string
  company: string
  joinDate: string
  avatar: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user } = useSelector((state: RootState) => state.user);
  const username = user?.username;
  const email = user?.email;
  const profilePhoto = user?.profilePhoto;
  const createdAt = user?.createdAt ? new Date(user.createdAt) : new Date();

  // Format the date as "Month Year" (e.g., "August 2024")
  const formatJoinDate = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const [profile, setProfile] = useState<UserProfile>({
    name: username || "Alex Johnson",
    email: email || "alex.johnson@example.com",
    location: "Nepal",
    website: "https://alexjohnson.dev",
    phone: "+1 (555) 123-4567",
    company: "Tech Innovations Inc.",
    joinDate: formatJoinDate(createdAt),
    avatar: profilePhoto || "/placeholder.svg?height=120&width=120&text=AJ",
  })

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
        setEditedProfile((prev) => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    setAvatarPreview("")
    alert("Profile updated successfully!")
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
    setAvatarPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")         
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="mb-8 flex items-center justify-between">
          
          {user?.admin === 'admin' && (
            <Button onClick={() => navigate('/signup')} className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Make Account
            </Button>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={avatarPreview || profile.avatar} alt={profile.name} />
                      <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />

                  <h2 className="text-2xl font-bold text-white-900 mb-2">{profile.name}</h2>
                  <p className="text-white-600 mb-4">{profile.email}</p>

                  {/* <Badge variant="secondary" className="mb-4">
                    Member since {profile.joinDate}
                  </Badge> */}

                  {/* <p className="text-sm text-gray-600 text-center">{profile.bio}</p> */}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {/* <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blog Posts</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comments</span>
                    <span className="font-semibold">48</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Likes Received</span>
                    <span className="font-semibold">156</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                      />
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editedProfile.location}
                          onChange={(e) => setEditedProfile((prev) => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      {/* <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={editedProfile.company}
                          onChange={(e) => setEditedProfile((prev) => ({ ...prev, company: e.target.value }))}
                        />
                      </div> */}
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={editedProfile.website}
                          onChange={(e) => setEditedProfile((prev) => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div> */}
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{profile.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* <div>
                      <p className="text-sm text-gray-500 mb-2">Bio</p>
                      <p className="text-gray-900">{profile.bio}</p>
                    </div>

                    <Separator /> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{profile.location}</p>
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Company</p>
                          <p className="font-medium">{profile.company}</p>
                        </div>
                      </div> */}
                    </div>

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            {profile.website}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{profile.phone}</p>
                        </div>
                      </div>
                    </div> */}

                    {/* <Separator />

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">{profile.joinDate}</p>
                      </div>
                    </div> */}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
