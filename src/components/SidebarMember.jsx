"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dumbbell,
  Calendar,
  Menu,
  X,
  ChevronRight,
  Zap,
  Home,
  Mail,
  Users,
  ArrowRight,
} from "lucide-react";
import BellNotifications from "./BellNotifications";

export default function SidebarMember({ pageTitle, children }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user, logout, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const avatarRef = useRef(null);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/member" },
    { icon: Users, label: "Area Cliente", path: "/member/profile" },
    { icon: Dumbbell, label: "Allenamenti", path: "/member/workouts" },

    {
      icon: Calendar,
      label: "Calendario",
      path: "/member/calendar",
    },
    { icon: Mail, label: "Messaggi", path: "/member/messages" },
  ];

  const isActiveItem = (itemPath) => {
    if (itemPath === "/member") {
      return (
        location.pathname === "/member" || location.pathname === "/member/"
      );
    }
    return location.pathname.startsWith(itemPath);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <Flex align="center" gap="3">
            <div className="p-3 bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full shadow-lg">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <Text color="blue" size="5" weight="bold">
              Caricamento...
            </Text>
          </Flex>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "cliente") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-50">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
          <Flex align="center" gap="3">
            <div className="p-3 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-full shadow-lg">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <Text color="red" size="5" weight="bold">
              Accesso non autorizzato
            </Text>
          </Flex>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden member-dashboard">
      <style jsx>{`
        .member-dashboard * {
          pointer-events: auto !important;
        }
        .member-dashboard button {
          pointer-events: auto !important;
          z-index: 999 !important;
          position: relative !important;
        }
      `}</style>

      {/* Sfondo con gradiente soft */}
      <div className="absolute bg-gradient-to-br from-blue-50 via-purple-25 to-pink-25"></div>

      {/* Elementi geometrici discreti */}
      <div className="absolute  pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 bg-purple-200/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-200/10 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed  bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white/25 backdrop-blur-xl border-r border-white/40 shadow-2xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-white/30">
          <Flex align="center" justify="between">
            <Link to="/member" className="no-underline">
              <Flex align="center" gap="3">
                <div className="p-3 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg">
                  <Dumbbell className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <Text
                    size="4"
                    weight="bold"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
                  >
                    CoachConnect
                  </Text>
                  <Text size="2" className="text-gray-600">
                    Member Dashboard
                  </Text>
                </div>
              </Flex>
            </Link>
            <button
              className="lg:hidden p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
              onClick={() => setSidebarOpen(false)}
              style={{ pointerEvents: "auto", zIndex: 9999 }}
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </Flex>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-white/30">
          <Flex align="center" gap="3">
            <div className="relative">
              {user?.profileImg ? (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white/40 shadow-lg">
                  <img
                    src={`${API_BASE_URL}${user.profileImg}`}
                    alt="Profilo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback con iniziali */}
                  <div
                    className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold text-lg"
                    style={{ display: "none" }}
                  >
                    {user.name?.charAt(0) || "C"}
                  </div>
                </div>
              ) : (
                /* Fallback Radix Avatar */
                <Avatar
                  size="3"
                  fallback={user.name?.charAt(0) || "C"}
                  className="ring-2 ring-white/40 shadow-lg"
                />
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <Text
                size="3"
                weight="bold"
                className="text-gray-800 drop-shadow-sm"
              >
                {user.name}
              </Text>
              <Flex align="center" gap="2">
                <div className="bg-purple-100/80 backdrop-blur-sm border border-purple-200/50 rounded-full px-2 py-1">
                  <Text size="1" className="text-purple-700 font-medium">
                    Cliente
                  </Text>
                </div>
                <div className="bg-blue-100/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-2 py-1">
                  <Text size="1" className="text-blue-700 font-medium">
                    Attivo
                  </Text>
                </div>
              </Flex>
            </div>
          </Flex>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {sidebarItems.map((item, index) => {
            const isActive = isActiveItem(item.path);
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                  isActive
                    ? "bg-white/40 backdrop-blur-sm border border-white/50 text-gray-800 shadow-lg"
                    : "hover:bg-white/20 backdrop-blur-sm text-gray-700 hover:border hover:border-white/30"
                }`}
                style={{ pointerEvents: "auto", zIndex: 999 }}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-purple-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <Text size="3" weight="medium" className="flex-1 text-left">
                  {item.label}
                </Text>
                {item.badge && (
                  <div className="bg-gray-100/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-2 py-1">
                    <Text size="1" className="text-gray-600 font-medium">
                      {item.badge}
                    </Text>
                  </div>
                )}
                {!isActive && (
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Action */}
        <div className="p-4">
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-lg">
            <Flex direction="column" gap="3">
              <Flex align="center" gap="2">
                <Zap className="h-4 w-4 text-purple-600" />
                <Text size="2" weight="bold" className="text-purple-700">
                  Azione Rapida
                </Text>
              </Flex>
              <button
                className="w-full h-10 bg-purple-500/80 hover:bg-purple-600/80 backdrop-blur-sm border border-purple-300/50 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                onClick={() => {
                  navigate("/member/calendar");
                  setSidebarOpen(false);
                }}
                style={{ pointerEvents: "auto", zIndex: 9999 }}
              >
                <ArrowRight />
                Visualizza il calendario
              </button>
            </Flex>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Bar */}
        <div className="bg-white/25 backdrop-blur-xl border-b border-white/40 p-4 sticky top-0 z-30 shadow-lg">
          <Flex align="center" justify="between">
            <Flex align="center" gap="4">
              <button
                className="lg:hidden p-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
                onClick={() => setSidebarOpen(true)}
                style={{ pointerEvents: "auto", zIndex: 9999 }}
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <Text
                  size="5"
                  weight="bold"
                  className=" mr-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
                >
                  {user.name}
                </Text>
                <Text size="2" className="text-gray-500">
                  {pageTitle}
                </Text>
              </div>
            </Flex>
            <Flex align="center" gap="3" className="relative" ref={avatarRef}>
              <BellNotifications />

              <div className="relative">
                <div
                  className="ring-2 ring-white/40 shadow-lg rounded-full cursor-pointer overflow-hidden"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  style={{ pointerEvents: "auto", zIndex: 9999 }}
                >
                  {user?.profileImg ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={`${API_BASE_URL}${user.profileImg}`}
                        alt="Profilo"
                        className="w-full h-full object-cover pointer-events-none"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      {/* Fallback con iniziali */}
                      <div
                        className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-600 font-bold text-sm pointer-events-none"
                        style={{ display: "none" }}
                      >
                        {user.name?.charAt(0) || "C"}
                      </div>
                    </div>
                  ) : (
                    /* Fallback Radix Avatar */
                    <Avatar
                      size="2"
                      fallback={user.name?.charAt(0) || "C"}
                      className="pointer-events-none"
                    />
                  )}
                </div>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl ring-1 ring-white/20 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/member/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-white/50 transition-colors flex items-center gap-2 text-gray-700"
                      style={{ pointerEvents: "auto", zIndex: 9999 }}
                    >
                      Il Mio Profilo
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50/50 transition-colors flex items-center gap-2 text-red-600"
                      style={{ pointerEvents: "auto", zIndex: 9999 }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </Flex>
          </Flex>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto member-messages">{children}</div>
      </div>
    </div>
  );
}
