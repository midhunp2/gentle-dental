"use client"

import { useState, useEffect } from "react"
import styles from "./articles.module.css"
import Navbar from "@/app/components/Navbar/page"
import Footer from "@/app/components/Footer/page"
import Image from "next/image"
import Link from "next/link"
import ArticleCardSkeleton from "./ArticleCardSkeleton"
import { fetchArticles } from "@/app/lib/queries/query"

const ARTICLES_PER_PAGE = 3

interface ArticleCard {
  id: string
  slug: string
  title: string
  description: string
  image: string
  imageAlt?: string
  ctaText?: string
  ctaLink?: string
}

interface ArticlesData {
  articles: ArticleCard[]
  bannerImage?: string
  bannerImageAlt?: string
  bannerHeading?: string | null
}

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Helper function to strip HTML tags from description
const stripHtml = (html: string): string => {
  if (!html) return ""
  // Remove HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

const Articles = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [articlesData, setArticlesData] = useState<ArticlesData>({
    articles: [],
  })
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const articles = articlesData.articles
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE)

  // Get articles for current page
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const endIndex = startIndex + ARTICLES_PER_PAGE
  const currentArticles = articles.slice(startIndex, endIndex)

  // Fetch articles data on mount
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true)
        const data = await fetchArticles()
        
        // Transform the data
        const transformedArticles: ArticleCard[] = data.paragraphArticleCards.nodes.map(
          (card: any, index: number) => {
            const title = card.title?.value || ""
            const description = card.description?.processed || card.description?.value || ""
            const imageUrl = card.image?.mediaImage?.url || ""
            const imageAlt = card.image?.mediaImage?.alt || title
            const ctaLink = card.ctaLink?.url || `/patient-resources/articles/${generateSlug(title)}`
            const ctaText = card.ctaText || card.ctaLink?.title || "READ MORE"
            
            return {
              id: `article-${index}`,
              slug: generateSlug(title),
              title,
              description: stripHtml(description),
              image: imageUrl,
              imageAlt,
              ctaText,
              ctaLink,
            }
          }
        )

        // Get banner data
        const banner = data.paragraphArticleBanners?.nodes?.[0]
        const bannerImage = banner?.bannerImage?.mediaImage?.url || "/assets/images/articles-banner.jpg"
        const bannerImageAlt = banner?.bannerImage?.mediaImage?.alt || "Articles Banner"
        const bannerHeading = banner?.bannerHeading

        setArticlesData({
          articles: transformedArticles,
          bannerImage,
          bannerImageAlt,
          bannerHeading,
        })
      } catch (error) {
        console.error("Error loading articles:", error)
        // Keep empty state on error
      } finally {
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    }

    loadArticles()
  }, [])

  // Scroll to top when page changes
  useEffect(() => {
    if (!isInitialLoad) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentPage, isInitialLoad])

  // Simulate loading state for page transitions
  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300) // Short delay to show loading state
      return () => clearTimeout(timer)
    }
  }, [currentPage, isInitialLoad])

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
              src={articlesData.bannerImage || "/assets/images/articles-banner.jpg"} 
              alt={articlesData.bannerImageAlt || "Articles Banner"} 
              fill
              priority
              quality={95}
              className={styles.BannerImage}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.ArticlesBannerContent}>
            <h1 className={styles.ArticlesTitle}>
              {articlesData.bannerHeading || "Articles"}
            </h1>
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
                        alt={article.imageAlt || article.title} 
                        width={400} 
                        height={300}
                        quality={95}
                        className={styles.ArticleImage}
                      />
                    </div>
                    <div className={styles.ArticleContent}>
                      <h2 className={styles.ArticleTitle}>{article.title}</h2>
                      <p className={styles.ArticleDescription}>{article.description}</p>
                      <Link href={article.ctaLink || `/patient-resources/articles/${article.slug}`} className={styles.ReadMoreButton}>
                        {article.ctaText || "READ MORE"}
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