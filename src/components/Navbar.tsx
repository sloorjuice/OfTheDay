"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const date_link = "https://www.google.com/search?q=today's+date";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="bg-[#2c3e50] fixed top-0 w-full shadow-md z-[1000] py-2">
      <div className="w-full px-6 flex justify-between items-center relative">
        {/* Brand */}
        <div className="flex flex-col items-start min-w-[150px] z-[1010]">
          <Link
            href="/"
            className="text-[#ecf0f1] text-xl xl:text-2xl font-bold uppercase tracking-wider relative pb-1 border-b-4 border-[#3498db] transition duration-300 hover:scale-105 hover:text-[#3498db]"
          >
            Of The Day!
          </Link>
          {/* Date (below title in mobile mode) */}
          <div className="block 2xl:hidden text-sm text-[#ecf0f1] mt-1">
            <a
              href={date_link}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b-2 border-[#3498db] pb-[2px] hover:text-[#3498db] transition"
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </a>
          </div>
        </div>

        {/* Date (centered for desktop mode) */}
        <div className="hidden 2xl:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl text-[#ecf0f1] whitespace-nowrap">
          <a
            href={date_link}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-2 border-[#3498db] pb-[2px] hover:text-[#3498db] transition"
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="2xl:hidden z-[1020]"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <div
            className={`hamburger flex flex-col justify-between w-7 h-5 ${
              menuOpen ? "open" : ""
            }`}
          >
            <span
              className={`bg-[#ecf0f1] h-[3px] w-full rounded transition-transform duration-300 ${
                menuOpen ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`bg-[#ecf0f1] h-[3px] w-full rounded transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`bg-[#ecf0f1] h-[3px] w-full rounded transition-transform duration-300 ${
                menuOpen ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {/* Navigation Links */}
        <ul
          className={`
            ${menuOpen ? "right-0" : "right-[-100%]"}
            2xl:static 2xl:flex 2xl:flex-row 2xl:space-x-3 2xl:bg-transparent
            fixed top-0 h-screen 2xl:h-auto bg-[#2c3e50] w-[250px] 2xl:w-auto flex flex-col 2xl:flex-row justify-start 2xl:justify-end items-center 2xl:items-center gap-y-4 pt-24 2xl:pt-0 px-4 transition-all duration-300 z-[1000]
          `}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/music", label: "Music" },
            { href: "/games", label: "Games" },
            { href: "/movies", label: "Movies" },
            { href: "/tv", label: "TV Shows" },
            { href: "/books", label: "Books" },
          ].map(({ href, label }) => (
            <li key={href} className="w-full 2xl:w-auto text-center">
              <Link
                href={href}
                className={`block w-full py-2 2xl:px-4 text-[#ecf0f1] font-medium text-lg border-b-2 ${
                  pathname === href
                    ? "text-[#3498db] font-semibold border-[#3498db]"
                    : "border-transparent hover:text-[#3498db] hover:border-[#3498db]"
                } transition`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
