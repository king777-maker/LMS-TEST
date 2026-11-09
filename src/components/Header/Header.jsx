import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import MainNavbar from "./MainNavbar";
import MobileNavbar from "./MobileNavbar";
import RequestCertificateModal from "../Modals/RequestCertificateModal";
import AuthModal from "../Modals/AuthModal";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  const { currentUser, logout: handleLogout, setAuthUser } = useAuth();

  // Listen to custom window events for opening auth modal from other pages
  useEffect(() => {
    const handleOpenAuth = (e) => {
      const tab = e.detail?.tab || "login";
      setAuthModalTab(tab);
      setIsAuthModalOpen(true);
    };

    window.addEventListener("open-auth-modal", handleOpenAuth);
    return () => window.removeEventListener("open-auth-modal", handleOpenAuth);
  }, []);

  const openLogin = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalTab("register");
    setIsAuthModalOpen(true);
  };

  const openRequestCertificate = () => {
    setIsCertModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setAuthUser(user);
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-md">
        {/* Tier 1: Brand Accent Yellow Top Bar with Email, Socials, Blogs, Contact, Log In, Register */}
        <TopBar
          onRequestCertificate={openRequestCertificate}
          onOpenLogin={openLogin}
          onOpenRegister={openRegister}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Tier 2: Solid Brand Navy Navbar with Brand Logo in Left Corner, Categories, Search & Verify Certificate */}
        <MainNavbar
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
          isMobileOpen={isMobileOpen}
        />
      </header>

      {/* Mobile Drawer */}
      <MobileNavbar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        onRequestCertificate={openRequestCertificate}
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Interactive Modals */}
      <RequestCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;
