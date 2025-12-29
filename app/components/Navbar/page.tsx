"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Gentle Dental Home">
          <Image
            src="/assets/images/gentleDentalLogo.svg"
            alt="Gentle Dental Logo"
            className={styles.logoImage}
            width={180}
            height={60}
            loading="eager"
            priority
            unoptimized
          />
        </Link>

        <ul
          className={`${styles.navLinks} ${isSearchOpen ? styles.hidden : ""}`}
          role="menubar"
        >
          <li role="none">
            <Link href="/locations" className={styles.navLink} role="menuitem">
              LOCATIONS
            </Link>
          </li>
          <li role="none">
            <Link href="/services" className={styles.navLink} role="menuitem">
              DENTAL SERVICES
            </Link>
          </li>
          <li role="none">
            <Link href="/payment" className={styles.navLink} role="menuitem">
              PAYMENT OPTIONS
            </Link>
          </li>
          <li
            className={styles.dropdownContainer}
            role="none"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className={styles.navLink}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Patient Resources menu"
              role="menuitem"
            >
              PATIENT RESOURCES
            </button>
            {isDropdownOpen && (
              <ul 
                className={styles.dropdownMenu}
                role="menu"
                aria-label="Patient Resources submenu"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <li role="none">
                  <Link
                    href="/patient-resources/articles"
                    className={styles.dropdownLink}
                    onClick={() => setIsDropdownOpen(false)}
                    role="menuitem"
                  >
                    Articles
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li role="none">
            <Link href="/about" className={styles.navLink} role="menuitem">
              ABOUT US
            </Link>
          </li>
        </ul>

        <div
          className={`${styles.searchBar} ${
            isSearchOpen ? styles.searchBarOpen : ""
          }`}
          role="search"
          aria-label="Site search"
        >
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search"
            className={styles.searchInput}
            autoFocus
            aria-label="Search site"
          />
          <button className={styles.applyBtn} aria-label="Apply search">Apply</button>
          <button
            className={styles.closeBtn}
            onClick={handleCloseSearch}
            aria-label="Close search"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${styles.rightActions} ${
            isSearchOpen ? styles.hidden : ""
          }`}
        >
          <button
            className={styles.searchBtn}
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.searchIcon}
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button 
            className={styles.bookNowBtn}
            onClick={() => {
              if (typeof window !== "undefined" && (window as any).openJarvisScheduler) {
                (window as any).openJarvisScheduler();
              }
            }}
            aria-label="Book an appointment"
          >
            BOOK NOW
          </button>
        </div>

        <button
          className={styles.menuToggle}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenuOverlay} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        onClick={handleCloseMenu}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={styles.mobileMenuContent}
          onClick={(e) => e.stopPropagation()}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <button
            className={styles.mobileMenuClose}
            onClick={handleCloseMenu}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <ul className={styles.mobileNavLinks} role="menu">
            <li role="none">
              <Link
                href="/locations"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
                role="menuitem"
              >
                LOCATIONS
              </Link>
            </li>
            <li role="none">
              <Link
                href="/services"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
                role="menuitem"
              >
                DENTAL SERVICES
              </Link>
            </li>
            <li role="none">
              <Link
                href="/payment"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
                role="menuitem"
              >
                PAYMENT OPTIONS
              </Link>
            </li>
            <li role="none">
              <div className={styles.mobileDropdownContainer}>
                <button
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  aria-expanded={isMobileDropdownOpen}
                  aria-haspopup="true"
                  role="menuitem"
                >
                  PATIENT RESOURCES
                </button>
                {isMobileDropdownOpen && (
                  <ul className={styles.mobileDropdownMenu} role="menu" aria-label="Patient Resources submenu">
                    <li role="none">
                      <Link
                        href="/patient-resources/articles"
                        className={styles.mobileDropdownLink}
                        onClick={() => {
                          setIsMobileDropdownOpen(false);
                          handleCloseMenu();
                        }}
                        role="menuitem"
                      >
                        Articles
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li role="none">
              <Link
                href="/about"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
                role="menuitem"
              >
                ABOUT US
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
