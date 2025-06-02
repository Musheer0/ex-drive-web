"use client";
import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../search/search-bar";
import UserButton from "../auth/user-button";
import { DownloadIcon } from "lucide-react";
import SearchHistory from "../search/search-history";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import InstallButton from "../install-app";

const Navbar = () => {
  const [open, setIsOpen] = useState(false);
  const pathname = usePathname();
  const params = useSearchParams();
  const QueryParam = params.get("query");

  const controls = useAnimation();
  const lastScrollY = useRef(0);

  // Show/hide nav based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling down
        controls.start({ y: "-100%" });
      } else {
        // Scrolling up
        controls.start({ y: "0%" });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  useEffect(() => {
    if (QueryParam) {
      setIsOpen(false);
    }
  }, [QueryParam]);

  useEffect(() => {
    if (pathname !== "/search") {
      setIsOpen(false);
    }
  }, [pathname]);

  return (
    <>
      <motion.nav
        animate={controls}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={() => setIsOpen(true)}
        className="w-full z-50 sticky top-0 bg-background shadow-md gap-3 p-2 flex items-center justify-between"
      >
        {/* Desktop */}
        <div className="w-full gap-3 p-2 relative hidden md:flex items-center justify-between">
          <SearchBar
            onSubmit={() => {
              setIsOpen(false);
            }}
          />
        <InstallButton>
            <p
     
            className="ml-auto text-sm hover:underline cursor-pointer flex items-center gap-2 bg-muted-foreground/5 px-4 py-2 rounded-md"
          >
            Download Ex-drive
            <DownloadIcon size={14} />
          </p>
        </InstallButton>
          <UserButton />
        </div>

        {/* Mobile */}
        <div className="w-full gap-3 p-2 relative md:hidden flex items-center justify-between">
          <SearchBar
            onSubmit={() => {
              setIsOpen(false);
            }}
          />
          <UserButton className="absolute top-1/2 scale-95 -translate-y-1/2 right-5" />
        </div>

        <SearchHistory isopen={open} onClose={setIsOpen} />
      </motion.nav>
    </>
  );
};

export default Navbar;
