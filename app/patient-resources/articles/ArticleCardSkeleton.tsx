import styles from "./articles.module.css"

export default function ArticleCardSkeleton() {
  return (
    <div className={styles.ArticleCard}>
      <div className={styles.ArticleImageWrapper}>
        <div className={styles.SkeletonImage} />
      </div>
      <div className={styles.ArticleContent}>
        <div className={styles.SkeletonLine} style={{ width: '90%', height: '24px', marginBottom: '16px' }} />
        <div className={styles.SkeletonLine} style={{ width: '100%', height: '16px', marginBottom: '12px' }} />
        <div className={styles.SkeletonLine} style={{ width: '85%', height: '16px', marginBottom: '12px' }} />
        <div className={styles.SkeletonLine} style={{ width: '70%', height: '16px', marginBottom: '20px' }} />
        <div className={styles.SkeletonButton} />
      </div>
    </div>
  )
}

