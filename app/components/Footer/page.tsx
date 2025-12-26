"use client";

import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Locations</h3>
          <ul className={styles.linkList}>
            <li>
              <Link href="/services" className={styles.footerLink}>
                Dental Services
              </Link>
            </li>
            <li>
              <Link href="/payment" className={styles.footerLink}>
                Payment Options
              </Link>
            </li>
            <li>
              <Link href="/resources" className={styles.footerLink}>
                Patient Resources
              </Link>
            </li>
            <li>
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/health-safety" className={styles.footerLink}>
                Health & Safety
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Partners and Associations</h3>
          <div className={styles.partnerLogos}>
            <div className={styles.logoWrapper}>
              <Image
                src="/assets/images/ada-logo.png"
                alt="American Dental Association"
                width={120}
                height={60}
                className={styles.partnerLogo}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className={styles.logoWrapper}>
              <Image
                src="/assets/images/invisalign-logo.png"
                alt="Invisalign"
                width={120}
                height={60}
                className={styles.partnerLogo}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className={styles.logoWrapper}>
              <Image
                src="/assets/images/mds-logo.png"
                alt="MDS"
                width={120}
                height={60}
                className={styles.partnerLogo}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Facebook"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Twitter"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="YouTube"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.bottomLeft}>
          <p className={styles.copyright}>
            ©2025 Gentle Dental of New England – All Rights Reserved.
          </p>
          <p className={styles.disclaimer}>
            Gentle Dental is a 42 North Dental Care, PLLC practice and is owned
            and operated by licensed dentists.
          </p>
        </div>
        <div className={styles.bottomRight}>
          <div className={styles.legalLinks}>
            <Link href="/sitemap" className={styles.legalLink}>
              Sitemap
            </Link>
            <span className={styles.separator}>|</span>
            <Link href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <span className={styles.separator}>|</span>
            <Link href="/disclaimer" className={styles.legalLink}>
              Disclaimer
            </Link>
            <span className={styles.separator}>|</span>
            <Link href="/terms" className={styles.legalLink}>
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
