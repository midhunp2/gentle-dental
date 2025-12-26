import Navbar from "@/app/components/Navbar/page"
import Footer from "@/app/components/Footer/page"
import styles from "../articles.module.css"

export default function ArticleDetailLoading() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className={styles.ArticleDetailSection}>
          <div className={styles.ArticleDetailContainer}>
            <div className={styles.SkeletonDetailImage} />
            <div className={styles.SkeletonLine} style={{ width: '200px', height: '20px', marginBottom: '16px' }} />
            <div className={styles.SkeletonLine} style={{ width: '80%', height: '40px', marginBottom: '24px' }} />
            <div style={{ marginTop: '20px' }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={styles.SkeletonLine}
                  style={{
                    height: '16px',
                    width: index === 7 ? '60%' : '100%',
                    marginBottom: '12px',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

