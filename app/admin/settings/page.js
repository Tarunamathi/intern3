"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminSettingsPage() {
  const [selectedTab, setSelectedTab] = useState("My Profile");
  const [profileEdit, setProfileEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const fileInputRef = useRef();

  const [profile, setProfile] = useState({
    id: "",
    firstName: "",
    lastName: "",
    role: "",
    location: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // ✅ Fetch admin profile dynamically
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/settings");
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          console.warn("Non-JSON response for profile", parseErr);
          data = null;
        }

        if (res.ok && data) {
          setProfile(data);
          setAvatar(data.avatarUrl || "/default-avatar.png");
        } else if (!res.ok) {
          console.error("Failed to load profile:", data?.error || text);
        } else {
          // 200 but empty body — nothing to set
          console.warn("Profile endpoint returned empty body");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // ✅ Handle input changes
  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Handle avatar change & upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;
      setAvatar(base64Image); // update immediately

      try {
        const res = await fetch(`/api/admin/settings/${profile.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarUrl: base64Image }),
        });
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          console.warn("Non-JSON response when updating avatar", parseErr);
        }

        if (res.ok) {
          alert("Profile picture updated ✅");
        } else {
          alert(`Error updating avatar: ${data?.error || text}`);
        }
      } catch (error) {
        console.error("Error updating avatar:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  // ✅ Save profile updates
  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`/api/admin/settings/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        console.warn("Non-JSON response when saving profile", parseErr);
      }

      if (res.ok && data) {
        setProfile(data);
        setProfileEdit(false);
        alert("Profile updated successfully ✅");
      } else {
        alert(`Error: ${data?.error || text}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    }
  };

  // ✅ Handle password change
  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: profile.id,
          oldPassword: passwords.current,
          newPassword: passwords.newPass,
        }),
      });
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        console.warn("Non-JSON response when changing password", parseErr);
      }

      if (res.ok) {
        alert("Password updated successfully ✅");
        setPasswordEdit(false);
        setPasswords({ current: "", newPass: "", confirm: "" });
      } else {
        alert(`Error: ${data?.error || text}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating password ❌");
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = "/admin/dashboard";
  };

  const menuItems = ["My Profile", "Password Change"];

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  // ✅ Tab Content
  const contentByTab = {
    "My Profile": (
      <section className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 shadow">
        <h1 className="text-xl font-semibold mb-6">My Profile</h1>

        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-green-700 object-cover"
              />
              {profileEdit && (
                <button
                  className="absolute bottom-0 right-0 bg-green-700 text-white rounded-full p-1"
                  onClick={() => fileInputRef.current.click()}
                >
                  ✏️
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>

            <div>
              {profileEdit ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profile.firstName ?? ""}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                  <input
                    type="text"
                    value={profile.lastName ?? ""}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              ) : (
                <h2 className="text-lg font-semibold">
                  {profile.firstName} {profile.lastName}
                </h2>
              )}
              <p className="text-sm text-gray-500">{profile.role}</p>
              <p className="text-xs text-gray-400">{profile.location}</p>
            </div>
          </div>

          <button
            onClick={() =>
              profileEdit ? handleSaveProfile() : setProfileEdit(true)
            }
            className="border border-gray-300 rounded-full py-1 px-3 hover:bg-green-700 hover:text-white"
          >
            {profileEdit ? "Save" : "Edit"}
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            {["email", "phone"].map((field) => (
              <div key={field}>
                <p className="text-gray-500 capitalize">{field}</p>
                {profileEdit ? (
                  <input
                    type="text"
                    value={profile[field] ?? ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 mt-1 w-full"
                  />
                ) : (
                  <p>{profile[field]}</p>
                )}
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-gray-500">Bio</p>
              {profileEdit ? (
                <textarea
                  value={profile.bio ?? ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 mt-1 w-full"
                  rows={2}
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    ),

    "Password Change": (
      <section className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 shadow">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        {!passwordEdit ? (
          <button
            onClick={() => setPasswordEdit(true)}
            className="border border-green-700 text-green-700 px-4 py-2 rounded-full hover:bg-green-700 hover:text-white"
          >
            Edit Password
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => handlePasswordChange("current", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">New Password</label>
              <input
                type="password"
                value={passwords.newPass}
                onChange={(e) => handlePasswordChange("newPass", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleChangePassword}
                className="bg-green-700 text-white px-5 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setPasswordEdit(false)}
                className="border border-gray-300 px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    ),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/images/rice-field.png')" }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6 flex gap-6">
            <aside className="w-64 pr-6 border-r border-white/5 flex flex-col">
              <div className="text-center mb-8">
                <span className="text-xl font-bold text-green-700">Agri Value Chain</span>
              </div>
              <nav className="flex flex-col space-y-3 flex-1">
                <button
                  onClick={handleBackToDashboard}
                  className="text-left px-3 py-2 rounded bg-transparent hover:bg-gray-100/30 text-gray-100/90 font-medium flex items-center gap-2"
                >
                  <span>←</span> Back to Dashboard
                </button>

                {menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedTab(item)}
                    className={`text-left px-3 py-2 rounded ${
                      selectedTab === item
                        ? "bg-green-100/40 font-semibold text-green-700"
                        : "hover:bg-gray-100/20"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </aside>

            <main className="flex-1">
              {contentByTab[selectedTab]}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}



