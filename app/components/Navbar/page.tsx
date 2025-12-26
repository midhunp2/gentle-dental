"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
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
        >
          <li>
            <Link href="/locations" className={styles.navLink}>
              LOCATIONS
            </Link>
          </li>
          <li>
            <Link href="/services" className={styles.navLink}>
              DENTAL SERVICES
            </Link>
          </li>
          <li>
            <Link href="/payment" className={styles.navLink}>
              PAYMENT OPTIONS
            </Link>
          </li>
          <li>
            <Link href="/resources" className={styles.navLink}>
              PATIENT RESOURCES
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.navLink}>
              ABOUT US
            </Link>
          </li>
        </ul>

        <div
          className={`${styles.searchBar} ${
            isSearchOpen ? styles.searchBarOpen : ""
          }`}
        >
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
            autoFocus
          />
          <button className={styles.applyBtn}>Apply</button>
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
          <Link href="/appointment" className={styles.bookNowBtn}>
            BOOK NOW
          </Link>
        </div>

        <button
          className={styles.menuToggle}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenuOverlay} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        onClick={handleCloseMenu}
      >
        <div
          className={styles.mobileMenuContent}
          onClick={(e) => e.stopPropagation()}
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
          <ul className={styles.mobileNavLinks}>
            <li>
              <Link
                href="/locations"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
              >
                LOCATIONS
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
              >
                DENTAL SERVICES
              </Link>
            </li>
            <li>
              <Link
                href="/payment"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
              >
                PAYMENT OPTIONS
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
              >
                PATIENT RESOURCES
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={styles.mobileNavLink}
                onClick={handleCloseMenu}
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
