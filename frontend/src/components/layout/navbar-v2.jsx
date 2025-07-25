"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Code, Sun, Moon, ChevronRight, Settings } from "lucide-react";
import { RiFocus2Line } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-context-utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuX } from "react-icons/lu";
import SettingsModal from "./settings-modal";

export default function Navbar({ sticky = false }) {
  const navLinks = [
    { name: "Problems", href: "/problems" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Profile", href: "/profile" },
    // { name: "Pricing", href: "#pricing" },
  ];

  const { user, setUser, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [openDropdown, setOpenDropdown] = useState(null); // 'mobile' | 'desktop' | null
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // console.log("Navbar user:", user); // Log user object

  const handleOpenSettingsModal = () => setIsSettingsModalOpen(true);
  const handleCloseSettingsModal = () => setIsSettingsModalOpen(false);

  // Check if a link is active based on current pathname
  const isActiveLink = (href) => {
    if (href === "/profile") {
      // For profile, check if current path starts with /profile
      return location.pathname.startsWith("/profile");
    }
    // For other links, check exact match or if pathname starts with href
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <>
      <header
        className={`${sticky ? "sticky top-0" : "relative"} z-50 w-full backdrop-blur-3xl theme-transition`}
      >
        <div className="w-full h-20 flex items-center justify-between px-6 sm:px-12">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center theme-transition">
            <Link
              to={"/"}
              className="flex items-center gap-2 font-bold text-primary theme-transition"
            >
              <RiFocus2Line className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-md sm:text-xl">Zencode</span>
            </Link>
          </div>

          {/* Center: Nav Links */}
          <nav className="hidden md:flex items-center gap-6 justify-center flex-none theme-transition">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm theme-transition ${
                  isActiveLink(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right: Theme Toggler and Auth */}
          <div className="flex-1 flex items-center justify-end gap-2 theme-transition">
            {/* <Link to={"/problems"}>
            <button className="flex flex-row justify-center items-center bg-primary hover:bg-primary/85 text-primary-foreground font-semibold !py-2 pl-4 pr-3 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer">
              Solve now
              <ChevronRight className="ml-2 h-4 w-4 theme-transition" />
            </button>
          </Link> */}
            {!isAuthenticated ? (
              <>
                {/* <Link to={"signin"}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary"
                >
                  Login
                </Button>
              </Link> */}
                <Link to={"signin"}>
                  <button
                    className={`flex flex-row justify-center items-center bg-accent text-muted-foreground font-semibold !py-2 px-4 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer ${
                      theme === "dark"
                        ? "bg-accent border border-border"
                        : "bg-card border border-border"
                    }`}
                  >
                    Sign In
                  </button>
                </Link>
                {/* Theme Toggler */}
                <button
                  onClick={toggleTheme}
                  disabled={isTransitioning}
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTheme();
                    }
                  }}
                  className={`p-2 rounded-full shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition flex items-center justify-center hover:cursor-pointer border border-border ${
                    theme === "dark" ? "bg-accent" : "bg-card"
                  }`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-muted-foreground theme-transition" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground theme-transition" />
                  )}
                </button>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  className={`flex flex-row justify-center items-center bg-accent text-muted-foreground font-medium !py-2 px-4 rounded-full text-xs shadow-none theme-transition group hover:cursor-pointer ${
                    theme === "dark"
                      ? "bg-accent border border-border"
                      : "bg-card border border-border"
                  }`}
                  aria-label="Settings"
                  tabIndex={0}
                  onClick={handleOpenSettingsModal}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenSettingsModal();
                    }
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </button>
                {/* Theme Toggler */}
                <button
                  onClick={toggleTheme}
                  disabled={isTransitioning}
                  aria-label={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTheme();
                    }
                  }}
                  className={`p-2 rounded-full shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary theme-transition flex items-center justify-center hover:cursor-pointer border border-border ${
                    theme === "dark" ? "bg-accent" : "bg-card"
                  }`}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-muted-foreground theme-transition" />
                  ) : (
                    <Moon className="h-4 w-4 text-muted-foreground theme-transition" />
                  )}
                </button>
                <DropdownMenu
                  open={openDropdown === "desktop"}
                  onOpenChange={(val) =>
                    setOpenDropdown(val ? "desktop" : null)
                  }
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      className="focus:outline-none focus-visible:ring-0 rounded-full hover:cursor-pointer"
                      tabIndex={0}
                      aria-label="User menu"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === "desktop" ? null : "desktop"
                        )
                      }
                    >
                      <Avatar className="h-8.5 w-8.5 theme-transition">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.name || user?.email || "User"}
                        />
                        <AvatarFallback className="text-sm border border-border text-muted-foreground theme-transition">
                          {user?.name
                            ? user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <AnimatePresence>
                    {openDropdown === "desktop" && (
                      <DropdownMenuContent
                        align="end"
                        className="min-w-56 mt-2 shadow-none border border-border outline-none ring-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        asChild
                        forceMount
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{
                            duration: 0.32,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                        >
                          <DropdownMenuLabel className="theme-transition">
                            <div className="flex items-center text-lg gap-2 theme-transition">
                              <Avatar className="h-10 w-10 theme-transition">
                                <AvatarImage
                                  src={user?.avatar}
                                  alt={user?.name || user?.email || "User"}
                                />
                                <AvatarFallback className="text-sm border border-border theme-transition">
                                  {user?.name
                                    ? user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                    : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col theme-transition">
                                <span className="font-medium text-sm theme-transition">
                                  {user?.name || "User"}
                                </span>
                                <span className="text-xs text-muted-foreground theme-transition">
                                  {user?.email}
                                </span>
                              </div>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="theme-transition" />
                          {/* <DropdownMenuItem
                        onClick={toggleTheme}
                        className="flex items-center gap-2 cursor-pointer focus:bg-accent focus:text-accent-foreground theme-transition"
                        aria-label={
                          theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                        }
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleTheme();
                          }
                        }}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-4 w-4 text-primary theme-transition" />
                        ) : (
                          <Moon className="h-4 w-4 text-muted-foreground theme-transition" />
                        )}
                        <span className="text-sm theme-transition">
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                      </DropdownMenuItem> */}
                          {/* {user && user.role === "admin" && (
                            <DropdownMenuItem
                              onClick={() => {
                                navigate("/dashboard");
                              }}
                              className="text-muted-foreground cursor-pointer theme-transition"
                              aria-label="admin dashboard"
                            >
                              Admin Dashboard
                            </DropdownMenuItem>
                          )} */}
                          <DropdownMenuItem
                            onClick={() => {
                              navigate("/profile");
                              setOpenDropdown(null);
                            }}
                            className="text-muted-foreground cursor-pointer theme-transition"
                            aria-label="profile"
                          >
                            My Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              handleOpenSettingsModal();
                              setOpenDropdown(null);
                            }}
                            className="text-muted-foreground cursor-pointer theme-transition"
                            aria-label="Logout"
                          >
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              logout();
                              setOpenDropdown(null);
                            }}
                            className="text-destructive focus:text-destructive cursor-pointer theme-transition"
                            aria-label="Logout"
                          >
                            Log out
                          </DropdownMenuItem>
                        </motion.div>
                      </DropdownMenuContent>
                    )}
                  </AnimatePresence>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            {!isAuthenticated ? (
              <></>
            ) : (
              <DropdownMenu
                open={openDropdown === "mobile"}
                onOpenChange={(val) => setOpenDropdown(val ? "mobile" : null)}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    className="focus:outline-none focus-visible:ring-0 rounded-full hover:cursor-pointer"
                    tabIndex={0}
                    aria-label="User menu"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === "mobile" ? null : "mobile"
                      )
                    }
                  >
                    <Avatar className="h-8.5 w-8.5 theme-transition">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.name || user?.email || "User"}
                      />
                      <AvatarFallback className="text-sm border border-border text-muted-foreground theme-transition">
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  {openDropdown === "mobile" && (
                    <DropdownMenuContent
                      align="end"
                      className="min-w-56 mt-2 shadow-none border border-border outline-none ring-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                      asChild
                      forceMount
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{
                          duration: 0.32,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <DropdownMenuLabel className="theme-transition">
                          <div className="flex items-center text-lg gap-2 theme-transition">
                            <Avatar className="h-10 w-10 theme-transition">
                              <AvatarImage
                                src={user?.avatar}
                                alt={user?.name || user?.email || "User"}
                              />
                              <AvatarFallback className="text-sm border border-border theme-transition">
                                {user?.name
                                  ? user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col theme-transition">
                              <span className="font-medium text-sm theme-transition">
                                {user?.name || "User"}
                              </span>
                              <span className="text-xs text-muted-foreground theme-transition">
                                {user?.email}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="theme-transition" />
                        <DropdownMenuItem
                          onClick={toggleTheme}
                          disabled={isTransitioning}
                          aria-label={
                            theme === "dark"
                              ? "Switch to light mode"
                              : "Switch to dark mode"
                          }
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleTheme();
                            }
                          }}
                          className="text-muted-foreground cursor-pointer theme-transition"
                        >
                          {theme === "dark" ? (
                            <>
                              <Sun className="h-4 w-4 text-muted-foreground theme-transition" />{" "}
                              <span>Change theme</span>
                            </>
                          ) : (
                            <>
                              <Moon className="h-4 w-4 text-muted-foreground theme-transition" />{" "}
                              <span>Change theme</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigate("/problems");
                            setOpenDropdown(null);
                          }}
                          className="text-muted-foreground cursor-pointer theme-transition"
                          aria-label="profile"
                        >
                          Problems
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigate("/leaderboard");
                            setOpenDropdown(null);
                          }}
                          className="text-muted-foreground cursor-pointer theme-transition"
                          aria-label="profile"
                        >
                          Leaderboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigate("/profile");
                            setOpenDropdown(null);
                          }}
                          className="text-muted-foreground cursor-pointer theme-transition"
                          aria-label="profile"
                        >
                          My Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleOpenSettingsModal();
                            setOpenDropdown(null);
                          }}
                          className="text-muted-foreground cursor-pointer theme-transition"
                          aria-label="Logout"
                        >
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            logout();
                            setOpenDropdown(null);
                          }}
                          className="text-destructive focus:text-destructive cursor-pointer theme-transition"
                          aria-label="Logout"
                        >
                          Log out
                        </DropdownMenuItem>
                      </motion.div>
                    </DropdownMenuContent>
                  )}
                </AnimatePresence>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
      {/* Settings Modal - Only for the highlighted button */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettingsModal}
        user={user}
        setUser={setUser}
      />
    </>
  );
}
