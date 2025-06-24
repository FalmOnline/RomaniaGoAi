// "use client";

// import Link from 'next/link';
// import Image from 'next/image';
// import { useState } from 'react';
// import FavoritesIcon from '/public/icons/favorites.svg';
// import CalendarPlaneIcon from '/public/icons/calendar-plane.svg';
// import CartIcon from '/public/icons/cart.svg';
// import EarthIcon from '/public/icons/earth.svg';
// import LoginPersonIcon from '/public/icons/login-person.svg';


// export default function Header() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
//   const [profileImage, setProfileImage] = useState<string | null>(null); // Store profile image URL
//   const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown visibility

//   const handleLogin = () => {
//     // Simulate login and fetching profile image
//     setIsLoggedIn(true);
//     setProfileImage('/me.jpg'); // Replace with actual image URL from Facebook/Google
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setProfileImage(null);
//   };


//   return (
//     <header className="text-black py-4">
//       <div className="mr-20 ml-10 mx-auto flex justify-between items-center">
//         <h1 className="text-xl font-bold">
//           <Link href="/" className="flex items-center">
//             <Image src="/images/RomaniaGO-Logo.png" alt="Logo" width={102} height={62} />
//           </Link>
//         </h1>
//         <nav>
//           <ul className="flex space-x-4">
//             <li>
//             <Link
//                 href="/"
//                 className="hover:underline flex items-center space-x-2 group"
//                 aria-label="Favorites"
//               >
//                 <FavoritesIcon className="w-8 h-8 text-white group-hover:text-pink-500 transition-colors duration-200" aria-hidden="true" />
//               </Link>
//             </li>
//             <li>
//             <Link
//                 href="/"
//                 className="hover:underline flex items-center space-x-2 group"
//                 aria-label="Favorites"
//               >
//                 <CalendarPlaneIcon className="w-8 h-8 text-white group-hover:text-pink-500" aria-hidden="true" />
//               </Link>
//             </li>
//             <li>
//             <Link
//                 href="/"
//                 className="hover:underline flex items-center space-x-2 group"
//                 aria-label="Favorites"
//               >
//                 <CartIcon className="w-8 h-8 text-white" aria-hidden="true" />
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/"
//                 className="hover:underline flex items-center space-x-2 group"
//                 aria-label="Favorites"
//               >
//                 <EarthIcon className="w-8 h-8 text-white" aria-hidden="true" />
//               </Link>
//             </li>
//             <li className="relative">
//               {/* Round Button */}
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity duration-200"
//               >
//                 {isLoggedIn && profileImage ? (
//                   <Image
//                     width={40}
//                     height={40}
//                     src={profileImage}
//                     alt="Profile"
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                 ) : (
//                   <LoginPersonIcon className="w-6 h-6 text-white" aria-hidden="true" />
//                 )}
//               </button>

//               {/* Dropdown Menu */}
//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
//                   <ul className="py-2">
//                     {!isLoggedIn ? (
//                       <>
//                         <li>
//                           <button
//                             onClick={handleLogin}
//                             className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             Login
//                           </button>
//                         </li>
//                       </>
//                     ) : (
//                       <>
//                         <li>
//                           <Link
//                             href="/preferences"
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             Preferences
//                           </Link>
//                         </li>
//                         <li>
//                           <button
//                             onClick={handleLogout}
//                             className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                           >
//                             Logout
//                           </button>
//                         </li>
//                       </>
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// }



"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient'; // Import Supabase client
import FavoritesIcon from '/public/icons/favorites.svg';
import CalendarPlaneIcon from '/public/icons/calendar-plane.svg';
import CartIcon from '/public/icons/cart.svg';
import EarthIcon from '/public/icons/earth.svg';
import LoginPersonIcon from '/public/icons/login-person.svg';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [profileImage, setProfileImage] = useState<string | null>(null); // Store profile image URL
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown visibility
  const [setUser] = useState<any>(null); // Store user data

  // Fetch the current session on component mount
useEffect(() => {
  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setIsLoggedIn(true);
      setProfileImage(session.user.user_metadata?.avatar_url || null);
    }
  };

  fetchUser();

  // Listen for auth state changes
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      setUser(session.user);
      setIsLoggedIn(true);
      setProfileImage(session.user.user_metadata?.avatar_url || null);
    } else {
      setUser(null);
      setIsLoggedIn(false);
      setProfileImage(null);
    }
  });

    // FIX: Call subscription() if it's a function
    return () => {
      if (typeof subscription === 'function') {
        subscription();
      }
    };
  }, []);

  const handleLoginWithEmail = async () => {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (email && password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  const handleLoginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) alert(error.message);
  };

  const handleLoginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
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
    <header className="text-black py-4">
      <div className="mr-20 ml-10 mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/" className="flex items-center">
            <Image src="/images/RomaniaGO-Logo.png" alt="Logo" width={102} height={62} />
          </Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/"
                className="hover:underline flex items-center space-x-2 group"
                aria-label="Favorites"
              >
                <FavoritesIcon className="w-8 h-8 text-white group-hover:text-pink-500 transition-colors duration-200" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="hover:underline flex items-center space-x-2 group"
                aria-label="Calendar"
              >
                <CalendarPlaneIcon className="w-8 h-8 text-white group-hover:text-pink-500" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="hover:underline flex items-center space-x-2 group"
                aria-label="Cart"
              >
                <CartIcon className="w-8 h-8 text-white" aria-hidden="true" />
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="hover:underline flex items-center space-x-2 group"
                aria-label="Earth"
              >
                <EarthIcon className="w-8 h-8 text-white" aria-hidden="true" />
              </Link>
            </li>
            <li className="relative">
              {/* Round Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity duration-200"
              >
                {isLoggedIn && profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <LoginPersonIcon className="w-6 h-6 text-white" aria-hidden="true" />
                )}
              </button>

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