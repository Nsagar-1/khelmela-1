import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { logout } from "@/redux/userSlice"; 
import { navigate } from "wouter/use-browser-location";
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getNavLinks = (isLoggedIn: boolean) => {
    const baseLinks = [
      { href: "/", label: "Home" },
      { href: "/", label: "Features", sectionId: "features" },
      { href: "/", label: "Download", sectionId: "download" },
      { href: "/blog", label: "Blog" },
      { href: "/", label: "About", sectionId: "about" },
      { href: "/", label: "Contact", sectionId: "contact" },
    ];
    if (isLoggedIn) {
      return [...baseLinks, { href: "/profile", label: "Profile" }];
    }
    return baseLinks;
  };

  const navLinks = getNavLinks(isLoggedIn);

  const handleLinkClick = (href: string, sectionId?: string) => {
    setActiveLink(href + (sectionId || ''));
    closeMobileMenu();
    
    if (sectionId) {
      if (location === '/') {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  };

  // Reset active link when location changes
  useEffect(() => {
    setActiveLink(null);
  }, [location]);

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-orbitron tracking-wider">
                <span className="text-primary">Khel</span>
                <span className="text-secondary">Mela</span>
              </h1>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.sectionId ? (
                <a
                  key={link.href + link.sectionId}
                  href={`#${link.sectionId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href, link.sectionId);
                  }}
                  className={`font-rajdhani text-lg font-medium transition-all cursor-pointer ${
                    activeLink === link.href + link.sectionId
                      ? "text-secondary shadow-[0_0_10px_rgba(110,43,241,0.5)]"
                      : "text-light hover:text-secondary"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`font-rajdhani text-lg font-medium transition-all cursor-pointer ${
                    activeLink === link.href
                      ? "text-secondary shadow-[0_0_10px_rgba(110,43,241,0.5)]"
                      : "text-light hover:text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Button
              className="bg-primary hover:bg-primary/90 text-white font-orbitron py-2 px-6 rounded-md transition-all hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] transform hover:-translate-y-0.5 font-bold"
              onClick={(e) => {
                e.preventDefault();
                dispatch(logout());
                navigate('/login');
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90 text-white font-orbitron py-2 px-6 rounded-md transition-all hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] transform hover:-translate-y-0.5 font-bold"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Login
            </Button>
          )}            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white font-orbitron py-2 px-6 rounded-md transition-all hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] transform hover:-translate-y-0.5 font-bold"
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.khelmela.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get The App
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-light hover:text-secondary focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col space-y-4 py-4 px-4 bg-dark/80 backdrop-blur-md border-t border-gray-800">
          {navLinks.map((link) => (
            link.sectionId ? (
              <a
                key={link.href + link.sectionId}
                href={`#${link.sectionId}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href, link.sectionId);
                }}
                className={`font-rajdhani py-2 px-4 text-lg transition-all cursor-pointer ${
                  activeLink === link.href + link.sectionId
                    ? "text-secondary shadow-[0_0_10px_rgba(110,43,241,0.5)]"
                    : "text-light hover:text-secondary"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`font-rajdhani py-2 px-4 text-lg transition-all cursor-pointer ${
                  activeLink === link.href
                    ? "text-secondary shadow-[0_0_10px_rgba(110,43,241,0.5)]"
                    : "text-light hover:text-secondary"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
          {isLoggedIn && (
            <Button
              className="bg-primary hover:bg-primary/90 text-white font-orbitron py-2 px-6 rounded-md transition-all hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] transform hover:-translate-y-0.5 font-bold"
              onClick={(e) => {
                e.preventDefault();
                dispatch(logout());
                navigate('/login');
              }}
            >
              <Link href="/login">Logout</Link>
            </Button>
          )}
          <a
            href="https://play.google.com/store/apps/details?id=com.khelmela.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-white text-center font-orbitron py-3 px-6 rounded-md transition-all hover:shadow-[0_0_10px_rgba(110,43,241,0.5),_0_0_20px_rgba(110,43,241,0.3)] font-bold mt-2"
          >
            Get The App
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;