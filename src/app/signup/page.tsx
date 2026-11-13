"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, User, AtSign, FileText, Palette, Shield } from "lucide-react";
import {
  useUserProfile,
  AVATAR_COLOR_PRESETS,
  UserProfileData,
} from "@/lib/user";

type ThemeMode = "classic" | "twitter" | "light";

export default function SignupPage() {
  const { user, isLoaded, saveUser } = useUserProfile();
  const [theme, setTheme] = useState<ThemeMode>("classic");

  const [username, setUsername] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarBg, setAvatarBg] = useState(AVATAR_COLOR_PRESETS[0].bg);
  const [initials, setInitials] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setUsername(user.username || "");
      setHandle(user.handle ? user.handle.replace(/^@/, "") : "");
      setBio(user.bio || "");
      setAvatarBg(user.avatarBg || AVATAR_COLOR_PRESETS[0].bg);
      setInitials(user.initials || "AN");
    }
  }, [isLoaded, user]);

  const handleUsernameChange = (val: string) => {
    setUsername(val);
    if (!initials || initials === "AN") {
      const parts = val.trim().split(/\s+/);
      const computed = parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : val.slice(0, 2).toUpperCase() || "AN";
      setInitials(computed);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalHandle = handle.trim().replace(/^@/, "") || "anon";
    const finalUsername = username.trim() || "Anonymous";
    const finalInitials = initials.trim().toUpperCase().slice(0, 3) || "AN";

    saveUser({
      username: finalUsername,
      handle: finalHandle,
      bio: bio.trim(),
      avatarBg,
      avatarText: "text-white",
      initials: finalInitials,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const themeStyles = {
    classic: {
      pageBg: "bg-[#FFFFEE] text-[#000000]",
      topNav: "bg-[#F0E0D6] border-b border-[#D9BFB7] text-[#800000]",
      cardBg: "bg-[#FFFFEE] border-[#D9BFB7]",
      cardHeader: "bg-[#F0E0D6] border-b border-[#D9BFB7] text-[#800000]",
      inputBg: "bg-white border-[#D9BFB7] text-black focus:border-[#800000]",
      accentText: "text-[#800000]",
      link: "text-[#0F0C5D] hover:text-[#D00] hover:underline",
      button: "bg-[#800000] text-white hover:bg-[#990000]",
    },
    twitter: {
      pageBg: "bg-[#E6ECF0] text-[#14171A]",
      topNav: "bg-white border-b border-[#E1E8ED] text-[#14171A]",
      cardBg: "bg-white border-[#E1E8ED]",
      cardHeader: "bg-[#F5F8FA] border-b border-[#E1E8ED] text-[#14171A]",
      inputBg: "bg-[#F5F8FA] border-[#E1E8ED] text-[#14171A] focus:border-[#1DA1F2] focus:bg-white",
      accentText: "text-[#1DA1F2]",
      link: "text-[#1DA1F2] hover:underline",
      button: "bg-[#1DA1F2] text-white hover:bg-[#1a91da]",
    },
    light: {
      pageBg: "bg-slate-50 text-slate-800",
      topNav: "bg-white border-b border-slate-200 text-slate-800",
      cardBg: "bg-white border-slate-300",
      cardHeader: "bg-slate-100 border-b border-slate-300 text-slate-800",
      inputBg: "bg-white border-slate-300 text-slate-900 focus:border-emerald-600",
      accentText: "text-emerald-700",
      link: "text-emerald-700 hover:underline",
      button: "bg-emerald-700 text-white hover:bg-emerald-800",
    },
  }[theme];

  return (
    <div className={`min-h-screen ${themeStyles.pageBg} font-sans flex flex-col transition-colors duration-150`}>
      {/* Top Header */}
      <header className={`px-4 py-2 text-xs border-b ${themeStyles.topNav}`}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-semibold hover:underline opacity-80 hover:opacity-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>[Return to Home Directory]</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/catalog" className={themeStyles.link}>
              [Catalog]
            </Link>
            <span className="opacity-30">|</span>
            <button
              onClick={() => {
                const next: ThemeMode =
                  theme === "classic" ? "twitter" : theme === "twitter" ? "light" : "classic";
                setTheme(next);
              }}
              className="text-[11px] opacity-80 hover:opacity-100 cursor-pointer"
            >
              [Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}]
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center">
        {/* Title */}
        <div className="text-center my-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Shield className={`h-6 w-6 ${themeStyles.accentText}`} />
            <h1 className="text-2xl font-bold tracking-tight">Account &amp; Identity Profile</h1>
          </div>
          <p className="text-xs opacity-70 max-w-md mx-auto">
            Create or edit your local client profile. Your username, badge, and avatar initials will be displayed across board threads and in the global navigation bar.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
          {/* Form Box */}
          <div className={`md:col-span-2 border rounded-sm shadow-xs ${themeStyles.cardBg}`}>
            <div className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wide flex items-center justify-between ${themeStyles.cardHeader}`}>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Profile Settings
              </span>
              <span className="text-[10px] font-normal opacity-70">Client LocalStorage</span>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
              {/* Username */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 opacity-60" />
                  Display Name / Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="e.g. IronLifter, NeonHacker, Anon"
                  maxLength={30}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-xs border outline-hidden transition-all ${themeStyles.inputBg}`}
                />
              </div>

              {/* Handle */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1">
                  <AtSign className="h-3.5 w-3.5 opacity-60" />
                  Handle
                </label>
                <div className="flex items-center">
                  <span className="px-2 py-1.5 border border-r-0 border-current/20 text-xs font-mono opacity-60 select-none">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                    placeholder="handle"
                    maxLength={20}
                    className={`w-full px-2.5 py-1.5 text-xs rounded-xs border outline-hidden transition-all font-mono ${themeStyles.inputBg}`}
                  />
                </div>
              </div>

              {/* Initials & Avatar Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 opacity-60" />
                    Avatar Initials
                  </label>
                  <input
                    type="text"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.toUpperCase().slice(0, 3))}
                    placeholder="AN"
                    maxLength={3}
                    className={`w-full px-2.5 py-1.5 text-xs rounded-xs border outline-hidden font-mono text-center tracking-widest ${themeStyles.inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1">
                    <Palette className="h-3.5 w-3.5 opacity-60" />
                    Avatar Color Preset
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {AVATAR_COLOR_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.name}
                        onClick={() => setAvatarBg(preset.bg)}
                        title={preset.name}
                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${preset.bg} border transition-all ${
                          avatarBg === preset.bg
                            ? "ring-2 ring-offset-1 ring-blue-500 scale-110"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-semibold mb-1 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 opacity-60" />
                  Bio / Status
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio or status message..."
                  rows={3}
                  maxLength={160}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-xs border outline-hidden transition-all ${themeStyles.inputBg}`}
                />
                <span className="text-[10px] opacity-50 text-right block mt-0.5">
                  {bio.length} / 160 characters
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className={`px-4 py-2 font-semibold text-xs rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${themeStyles.button}`}
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Identity Profile
                </button>

                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-pulse">
                    <Check className="h-4 w-4" />
                    Saved to local storage!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-4">
            <div className={`border rounded-sm shadow-xs ${themeStyles.cardBg}`}>
              <div className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wide ${themeStyles.cardHeader}`}>
                Live Preview
              </div>
              <div className="p-4 flex flex-col items-center text-center space-y-3">
                {/* Big Avatar */}
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarBg} text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white`}
                >
                  {initials || "AN"}
                </div>

                <div>
                  <h3 className="font-bold text-sm">{username || "Anonymous"}</h3>
                  <p className="text-xs opacity-60 font-mono">@{handle || "anon"}</p>
                </div>

                <p className="text-xs opacity-80 italic px-2">
                  &ldquo;{bio || "Lurking across boards."}&rdquo;
                </p>

                <div className="w-full border-t border-current/10 pt-3 text-left">
                  <span className="text-[10px] uppercase font-bold opacity-50 block mb-1.5">
                    Global Navbar Badge Preview:
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-black/5 border border-current/10 text-xs">
                    <div
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${avatarBg} text-white flex items-center justify-center font-bold text-[9px]`}
                    >
                      {initials || "AN"}
                    </div>
                    <span className="font-semibold text-[11px]">{username || "Anonymous"}</span>
                    <span className="opacity-40 text-[10px] font-mono">@{handle || "anon"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-3 border rounded-sm text-[11px] leading-relaxed opacity-75 ${themeStyles.cardBg}`}>
              <p className="font-semibold mb-1">💡 Anonymous Identity Note</p>
              <p>
                Oomfit respects imageboard tradition. Your identity is stored strictly on this client device. When posting in threads, you can choose to post with this handle or stay completely anonymous.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
