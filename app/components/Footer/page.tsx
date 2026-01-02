import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Site footer">
      <div className={styles.footerContent}>
        <nav className={`${styles.footerSection} ${styles.locationsSection}`} aria-label="Footer navigation">
          <h3 className={styles.sectionTitle}>Locations</h3>
          <ul className={styles.linkList} role="list">
            <li role="listitem">
              <Link href="/services" className={styles.footerLink}>
                Dental Services
              </Link>
            </li>
            <li role="listitem">
              <Link href="/payment" className={styles.footerLink}>
                Payment Options
              </Link>
            </li>
            <li role="listitem">
              <Link href="/resources" className={styles.footerLink}>
                Patient Resources
              </Link>
            </li>
            <li role="listitem">
              <Link href="/about" className={styles.footerLink}>
                About Us
              </Link>
            </li>
            <li role="listitem">
              <Link href="/health-safety" className={styles.footerLink}>
                Health & Safety
              </Link>
            </li>
          </ul>
        </nav>

        <div className={`${styles.footerSection} ${styles.partnersSection}`} aria-label="Partners and associations">
          <h3 className={styles.sectionTitle}>Partners and Associations</h3>
          <div className={styles.partnerLogos} role="list" aria-label="Partner logos">
            <div className={styles.logoWrapper} role="listitem">
              <Image
                src="/assets/images/ada-footer-logo.png"
                alt="American Dental Association"
                width={120}
                height={60}
                className={styles.partnerLogo}
                quality={95}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className={styles.logoWrapper} role="listitem">
              <Image
                src="/assets/images/invisalign-logo.png"
                alt="Invisalign"
                width={120}
                height={60}
                className={styles.partnerLogo}
                quality={95}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className={styles.logoWrapper} role="listitem">
              <Image
                src="/assets/images/mds-footer-logos.png"
                alt="MDS Massachusetts Dental Society"
                width={120}
                height={60}
                className={styles.partnerLogo}
                quality={95}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          </div>
        </div>

        <div className={`${styles.footerSection} ${styles.socialSection}`} aria-label="Social media links">
          <h3 className={styles.sectionTitle}>Follow Us</h3>
          <div className={styles.socialIcons} role="list" aria-label="Social media">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Follow us on Facebook (opens in new tab)"
              role="listitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
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
              aria-label="Follow us on Twitter (opens in new tab)"
              role="listitem"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
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
              aria-label="Follow us on YouTube (opens in new tab)"
              role="listitem"
            >
              <i className="fa fa-youtube-play" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <nav className={`${styles.footerSection} ${styles.bottomRightSection} ${styles.bottomRight}`} aria-label="Legal links">
          <div className={styles.legalLinks} role="list">
            <Link href="/sitemap" className={styles.legalLink} role="listitem">
              Sitemap
            </Link>
            <span className={styles.separator} aria-hidden="true">|</span>
            <Link href="/privacy" className={styles.legalLink} role="listitem">
              Privacy Policy
            </Link>
            <span className={styles.separator} aria-hidden="true">|</span>
            <Link href="/disclaimer" className={styles.legalLink} role="listitem">
              Disclaimer
            </Link>
            <span className={styles.separator} aria-hidden="true">|</span>
            <Link href="/terms" className={styles.legalLink} role="listitem">
              Terms of Use
            </Link>
          </div>
        </nav>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.bottomLeft}>
          <p className={styles.copyright}>
            ©{new Date().getFullYear()} Gentle Dental of New England - All Rights Reserved.
          </p>
          <p className={styles.disclaimer}>
            Gentle Dental is a 42 North Dental Care, PLLC practice and is owned
            and operated by licensed dentists.
          </p>
        </div>
        <nav className={styles.bottomRight} aria-label="Legal links">
          <div className={styles.legalLinks} role="list">
            <Link href="/sitemap" className={styles.legalLink} role="listitem">
              Sitemap
            </Link>
            <span className={styles.separator} aria-hidden="true">|</span>
            <Link href="/privacy" className={styles.legalLink} role="listitem">
              Privacy Policy
            </Link>
            <span className={styles.separator} aria-hidden="true">|</span>
            <Link href="/disclaimer" className={styles.legalLink} role="listitem">
              Disclaimer
            </Link>
            <span className={styles.separator} aria-hidden="true">|</span>
            <Link href="/terms" className={styles.legalLink} role="listitem">
              Terms of Use
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
