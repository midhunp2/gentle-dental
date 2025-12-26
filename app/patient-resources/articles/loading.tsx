import ArticleCardSkeleton from "./ArticleCardSkeleton"
import Navbar from "@/app/components/Navbar/page"
import Footer from "@/app/components/Footer/page"
import styles from "./articles.module.css"

export default function ArticlesLoading() {
  return (
    <>
      <Navbar />
      <main>
        <div className={styles.ArticlesBanner}>
          <div className={styles.ArticlesBannerImage}>
            <div className={styles.SkeletonBannerImage} />
          </div>
          <div className={styles.ArticlesBannerContent}>
            <div className={styles.SkeletonBannerTitle} />
          </div>
        </div>
        <section className={styles.ArticlesSection} aria-label="Loading articles">
          <div className={styles.ArticlesContainer}>
            <div className={styles.ArticlesGrid} role="list">
              {Array.from({ length: 3 }).map((_, index) => (
                <ArticleCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

