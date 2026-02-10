"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient"; // Import Supabase client
import LoginPersonIcon from "/public/icons/login-person.svg";
import { CircleUserRound } from "lucide-react";
import { Button } from "./ui/buttons/Button";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [profileImage, setProfileImage] = useState<string | null>(null); // Store profile image URL
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown visibility
  const [setUser] = useState<any>(null); // Store user data

  // Fetch the current session on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        setProfileImage(session.user.user_metadata?.avatar_url || null);
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsLoggedIn(true);
          setProfileImage(session.user.user_metadata?.avatar_url || null);
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setProfileImage(null);
        }
      },
    );

    // FIX: Call subscription() if it's a function
    return () => {
      if (typeof subscription === "function") {
        subscription();
      }
    };
  }, []);

  const handleLoginWithEmail = async () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    }
  };

  const handleLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };

  const handleLoginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
    });
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    setUser(null);
    setIsLoggedIn(false);
    setProfileImage(null);
  };

  return (
    <header className="text-black py-2">
      <div className="mr-20 ml-10 mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/RomaniaGO-Logo.png"
              alt="Logo"
              width={102}
              height={62}
            />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li className="relative">
              {/* Round Button */}

              <Button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                Icon={CircleUserRound}
                iconPosition="left"
              >
                {" "}
                {isLoggedIn && profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  ""
                )}
                Sign In
              </Button>


              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                  <ul className="py-2">
                    {!isLoggedIn ? (
                      <>
                        <li>
                          <Link
                            href="/login"
                            // onClick={handleLoginWithEmail}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Login with Email
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLoginWithGoogle}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Login with Google
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleLoginWithFacebook}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Login with Facebook
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            href="/preferences"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Preferences
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
