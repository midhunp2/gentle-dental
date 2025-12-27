import Navbar from "@/app/components/Navbar/page"
import Footer from "@/app/components/Footer/page"
import styles from "../articles.module.css"
import { SkeletonBox, SkeletonText } from "@/app/components/Ui/Skeleton/Skeleton"

export default function ArticleDetailLoading() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className={styles.ArticleDetailSection}>
          <div className={styles.ArticleDetailContainer}>
            <SkeletonBox height={400} width="100%" className={styles.SkeletonDetailImage} />
            <SkeletonBox height={20} width="200px" className={styles.skeletonDate} />
            <SkeletonBox height={40} width="80%" className={styles.skeletonTitle} />
            <div className={styles.skeletonContent}>
              <SkeletonText lines={8} height={16} className={styles.skeletonParagraph} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

