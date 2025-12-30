"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { useSearchStore } from "@/app/store/useSearchStore";
import { performGlobalSearch } from "@/app/lib/search/searchUtils";
import SearchResults from "@/app/components/SearchResults/SearchResults";
import { fetchNavbar } from "@/app/lib/queries/query";
import { Skeleton } from "@/app/components/Ui/Skeleton/Skeleton";

interface MenuItem {
  route?: {
    url?: string;
  } | null;
  title: string;
  children?: Array<{
    title: string;
    url: string;
  }>;
}

interface MenuData {
  menu: {
    id: string;
    items: MenuItem[];
  };
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<string, boolean>>({});
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Zustand store
  const {
    query,
    results,
    isSearching,
    setQuery,
    setResults,
    setIsSearching,
    setIsOpen,
    clearSearch,
  } = useSearchStore();

  // Debounce search query
  const debouncedQuery = useDebounce(localSearchQuery, 300);

  // Fetch menu data
  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const data = await fetchNavbar();
        setMenuData(data);
      } catch (error) {
        console.error("Error loading menu data:", error);
      }
    };
    loadMenuData();
  }, []);

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

  // Perform search when debounced query changes
  useEffect(() => {
    const search = async () => {
      if (debouncedQuery.trim()) {
        setIsSearching(true);
        setQuery(debouncedQuery);
        try {
          const searchResults = await performGlobalSearch(debouncedQuery);
          setResults(searchResults);
          setIsOpen(true);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
        setQuery("");
      }
    };

    if (isSearchOpen) {
      search();
    }
  }, [debouncedQuery, isSearchOpen, setQuery, setResults, setIsSearching, setIsOpen]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[class*="searchResults"]')
      ) {
        // Don't close if clicking on search results
        const target = event.target as HTMLElement;
        if (!target.closest('[class*="searchResults"]')) {
          setIsOpen(false);
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSearchOpen, setIsOpen]);

  // Handle ESC key to close search
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchOpen) {
        handleCloseSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isSearchOpen]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setIsOpen(true);
    // Focus input after state update
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setLocalSearchQuery("");
    clearSearch();
    setIsOpen(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim() && results.length > 0) {
      // Navigate to first result
      window.location.href = results[0].url;
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setOpenMobileDropdowns({});
  };

  const toggleDropdown = (itemTitle: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  const toggleMobileDropdown = (itemTitle: string) => {
    setOpenMobileDropdowns((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  const getMenuUrl = (item: MenuItem): string => {
    return item.route?.url || "#";
  };

  const formatMenuTitle = (title: string): string => {
    return title.toUpperCase();
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
          {!menuData ? (
            // Skeleton loaders for desktop navlinks
            [80, 100, 90, 85, 95].map((width, index) => (
              <li key={index} role="none" className={styles.skeletonNavLinkItem}>
                <Skeleton
                  variant="text"
                  width={width}
                  height="1.5rem"
                  className={styles.skeletonNavLink}
                />
              </li>
            ))
          ) : (
            menuData?.menu?.items?.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const itemTitle = item.title;
              const isDropdownOpen = openDropdowns[itemTitle] || false;
              const menuUrl = getMenuUrl(item);

              if (hasChildren) {
                return (
                  <li
                    key={index}
                    className={styles.dropdownContainer}
                    role="none"
                    onMouseEnter={() => setOpenDropdowns((prev) => ({ ...prev, [itemTitle]: true }))}
                    onMouseLeave={() => setOpenDropdowns((prev) => ({ ...prev, [itemTitle]: false }))}
                  >
                    <button
                      className={styles.navLink}
                      onClick={() => toggleDropdown(itemTitle)}
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      aria-label={`${itemTitle} menu`}
                      role="menuitem"
                    >
                      {formatMenuTitle(itemTitle)}
                    </button>
                    {isDropdownOpen && (
                      <ul
                        className={styles.dropdownMenu}
                        role="menu"
                        aria-label={`${itemTitle} submenu`}
                        onMouseEnter={() => setOpenDropdowns((prev) => ({ ...prev, [itemTitle]: true }))}
                        onMouseLeave={() => setOpenDropdowns((prev) => ({ ...prev, [itemTitle]: false }))}
                      >
                        {item.children?.map((child, childIndex) => (
                          <li key={childIndex} role="none">
                            <Link
                              href={child.url}
                              className={styles.dropdownLink}
                              onClick={() => setOpenDropdowns((prev) => ({ ...prev, [itemTitle]: false }))}
                              role="menuitem"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={index} role="none">
                  <Link href={menuUrl} className={styles.navLink} role="menuitem">
                    {formatMenuTitle(itemTitle)}
                  </Link>
                </li>
              );
            })
          )}
        </ul>

        <div
          ref={searchBarRef}
          className={`${styles.searchBar} ${isSearchOpen ? styles.searchBarOpen : ""
            }`}
          role="search"
          aria-label="Site search"
        >
          <div className={styles.searchBarInner}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <label htmlFor="search-input" className="sr-only">
                Search
              </label>
              <input
                ref={searchInputRef}
                id="search-input"
                type="search"
                placeholder="Search locations, articles, pages..."
                className={styles.searchInput}
                value={localSearchQuery}
                onChange={handleSearchInputChange}
                autoFocus
                aria-label="Search site"
                aria-busy={isSearching}
              />
              {isSearching && (
                <div className={styles.searchSpinner} aria-label="Searching">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.spinner}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="32"
                      strokeDashoffset="32"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        dur="2s"
                        values="0 32;16 16;0 32;0 32"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-dashoffset"
                        dur="2s"
                        values="0;-16;-32;-32"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>
              )}
              <button
                type="submit"
                className={styles.applyBtn}
                aria-label="Apply search"
                disabled={isSearching}
              >
                Search
              </button>
            </form>
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
          {isSearchOpen && localSearchQuery.trim() && (
            <SearchResults
              results={results}
              onResultClick={handleCloseSearch}
              isLoading={isSearching}
            />
          )}
        </div>

        <div
          className={`${styles.rightActions} ${isSearchOpen ? styles.hidden : ""
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
        className={`${styles.mobileMenuOverlay} ${isMenuOpen ? styles.mobileMenuOpen : ""
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
            {!menuData ? (
              // Skeleton loaders for mobile navlinks
              Array.from({ length: 5 }).map((_, index) => (
                <li key={index} role="none" className={styles.skeletonMobileNavLinkItem}>
                  <Skeleton
                    variant="text"
                    width="80%"
                    height="1.5rem"
                    className={styles.skeletonMobileNavLink}
                  />
                </li>
              ))
            ) : (
              menuData?.menu?.items?.map((item, index) => {
                const hasChildren = item.children && item.children.length > 0;
                const itemTitle = item.title;
                const isMobileDropdownOpen = openMobileDropdowns[itemTitle] || false;
                const menuUrl = getMenuUrl(item);

                if (hasChildren) {
                  return (
                    <li key={index} role="none">
                      <div className={styles.mobileDropdownContainer}>
                        <button
                          className={styles.mobileNavLink}
                          onClick={() => toggleMobileDropdown(itemTitle)}
                          aria-expanded={isMobileDropdownOpen}
                          aria-haspopup="true"
                          role="menuitem"
                        >
                          {formatMenuTitle(itemTitle)}
                        </button>
                        {isMobileDropdownOpen && (
                          <ul className={styles.mobileDropdownMenu} role="menu" aria-label={`${itemTitle} submenu`}>
                            {item.children?.map((child, childIndex) => (
                              <li key={childIndex} role="none">
                                <Link
                                  href={child.url}
                                  className={styles.mobileDropdownLink}
                                  onClick={() => {
                                    setOpenMobileDropdowns((prev) => ({ ...prev, [itemTitle]: false }));
                                    handleCloseMenu();
                                  }}
                                  role="menuitem"
                                >
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={index} role="none">
                    <Link
                      href={menuUrl}
                      className={styles.mobileNavLink}
                      onClick={handleCloseMenu}
                      role="menuitem"
                    >
                      {formatMenuTitle(itemTitle)}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
