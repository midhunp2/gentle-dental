"use client"

import { useState, useEffect } from "react"
import styles from "./articles.module.css"
import Navbar from "@/app/components/Navbar/page"
import Footer from "@/app/components/Footer/page"
import Image from "next/image"
import Link from "next/link"
import ArticleCardSkeleton from "./ArticleCardSkeleton"

const ARTICLES_PER_PAGE = 3

const articles = [
  {
    id: 1,
    slug: "dental-sealants-how-they-work",
    title: "Dental Sealants: How They Work | Gentle Dental",
    description: "Comprehensive Guide to Dental Sealants: Benefits, Application, and Cost. Learn how sealants protect your teeth from cavities...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 2,
    slug: "unlocking-wellness-itero-wellness-scans",
    title: "Unlocking Wellness: The Importance of iTero Wellness Scans",
    description: "Maintaining our health is more important than ever but it can sometimes feel overwhelming. Discover how iTero scans help...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 3,
    slug: "how-much-does-wisdom-tooth-removal-cost",
    title: "How Much Does a Wisdom Tooth Removal Cost?",
    description: "How much to pull a tooth? Tooth extraction costs can vary based on the type of procedure and your insurance coverage...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 4,
    slug: "root-canal-treatment-complete-guide",
    title: "Root Canal Treatment: A Complete Guide to Pain Relief",
    description: "Everything you need to know about root canal therapy. Learn about the procedure, recovery time, and how modern techniques make it pain-free...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 5,
    slug: "teeth-whitening-options-compared",
    title: "Teeth Whitening Options: In-Office vs. At-Home Treatments",
    description: "Compare professional teeth whitening treatments with at-home options. Find out which method works best for your smile and budget...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 6,
    slug: "gum-disease-prevention-tips",
    title: "Gum Disease Prevention: Essential Tips for Healthy Gums",
    description: "Protect your gums from periodontal disease with these expert tips. Learn about early warning signs and effective prevention strategies...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 7,
    slug: "invisalign-vs-traditional-braces",
    title: "Invisalign vs. Traditional Braces: Which is Right for You?",
    description: "Compare Invisalign clear aligners with traditional metal braces. Discover the pros and cons of each orthodontic treatment option...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 8,
    slug: "emergency-dental-care-what-to-know",
    title: "Emergency Dental Care: What You Need to Know",
    description: "When dental emergencies strike, knowing what to do can save your tooth. Learn about common emergencies and when to seek immediate care...",
    image: "/assets/images/gentle-dental-waltham.webp"
  },
  {
    id: 9,
    slug: "childrens-dental-health-guide",
    title: "Children's Dental Health: A Parent's Complete Guide",
    description: "Help your child develop healthy dental habits that last a lifetime. From first tooth to braces, learn how to care for your child's smile...",
    image: "/assets/images/gentle-dental-waltham.webp"
  }   
  
]

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE)

  // Get articles for current page
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const endIndex = startIndex + ARTICLES_PER_PAGE
  const currentArticles = articles.slice(startIndex, endIndex)

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  // Simulate loading state for page transitions
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // Short delay to show loading state
    return () => clearTimeout(timer)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <>
      <Navbar />
      <main>
        <div className={styles.ArticlesBanner}>
          <div className={styles.ArticlesBannerImage}>
            <Image 
              src="/assets/images/articles-banner.jpg" 
              alt="Articles Banner" 
              fill
              priority
              className={styles.BannerImage}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.ArticlesBannerContent}>
            <h1 className={styles.ArticlesTitle}>Articles</h1>
          </div>
        </div>
        <section className={styles.ArticlesSection}>
          <div className={styles.ArticlesContainer}>
            {isLoading ? (
              <div className={styles.ArticlesGrid} role="list" aria-label="Loading articles">
                {Array.from({ length: ARTICLES_PER_PAGE }).map((_, index) => (
                  <ArticleCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <div className={styles.ArticlesGrid}>
                {currentArticles.map((article) => (
                  <div key={article.id} className={styles.ArticleCard}>
                    <div className={styles.ArticleImageWrapper}>
                      <Image 
                        src={article.image} 
                        alt={article.title} 
                        width={400} 
                        height={300}
                        className={styles.ArticleImage}
                      />
                    </div>
                    <div className={styles.ArticleContent}>
                      <h2 className={styles.ArticleTitle}>{article.title}</h2>
                      <p className={styles.ArticleDescription}>{article.description}</p>
                      <Link href={`/patient-resources/articles/${article.slug}`} className={styles.ReadMoreButton}>
                        READ MORE
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className={styles.PaginationContainer}>
                <button
                  className={`${styles.PaginationButton} ${styles.PaginationPrevNext} ${
                    currentPage === 1 ? styles.PaginationButtonDisabled : ""
                  }`}
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Previous</span>
                </button>

                <div className={styles.PaginationNumbers}>
                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span key={`ellipsis-${index}`} className={styles.PaginationEllipsis}>
                          ...
                        </span>
                      )
                    }

                    const pageNumber = page as number
                    return (
                      <button
                        key={pageNumber}
                        className={`${styles.PaginationNumber} ${
                          currentPage === pageNumber ? styles.PaginationNumberActive : ""
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                        aria-label={`Go to page ${pageNumber}`}
                        aria-current={currentPage === pageNumber ? "page" : undefined}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>

                <button
                  className={`${styles.PaginationButton} ${styles.PaginationPrevNext} ${
                    currentPage === totalPages ? styles.PaginationButtonDisabled : ""
                  }`}
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Articles