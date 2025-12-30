"use client";

import { useSearchStore, SearchResult } from '@/app/store/useSearchStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick?: () => void;
  isLoading?: boolean;
}

export default function SearchResults({ results, onResultClick, isLoading }: SearchResultsProps) {
  const router = useRouter();
  const clearSearch = useSearchStore((state) => state.clearSearch);
  const setIsOpen = useSearchStore((state) => state.setIsOpen);

  if (isLoading) {
    return (
      <div className={styles.searchResults}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={styles.searchResults}>
        <div className={styles.noResults}>
          <p>No results found</p>
        </div>
      </div>
    );
  }

  const handleResultClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    // Clear search state
    clearSearch();
    setIsOpen(false);
    // Close search UI
    if (onResultClick) {
      onResultClick();
    }
    // Navigate to the result
    router.push(url);
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'dental-office':
        return 'Locations';
      case 'article':
        return 'Articles';
      case 'page':
        return 'Pages';
      default:
        return 'Other';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dental-office':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'article':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'page':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.searchResults}>
      {Object.entries(groupedResults).map(([type, typeResults]) => (
        <div key={type} className={styles.resultGroup}>
          <div className={styles.resultGroupHeader}>
            {getTypeIcon(type)}
            <span className={styles.resultGroupTitle}>{getTypeLabel(type)}</span>
            <span className={styles.resultCount}>({typeResults.length})</span>
          </div>
          <ul className={styles.resultList}>
            {typeResults.map((result) => (
              <li key={result.id} className={styles.resultItem}>
                <Link
                  href={result.url}
                  className={styles.resultLink}
                  onClick={(e) => handleResultClick(e, result.url)}
                >
                  <div className={styles.resultContent}>
                    <div className={styles.resultTitle}>{result.title}</div>
                    {result.description && (
                      <div className={styles.resultDescription}>{result.description}</div>
                    )}
                    {result.metadata?.address && (
                      <div className={styles.resultMetadata}>
                        <span>{result.metadata.address}</span>
                        {result.metadata.phone && (
                          <span className={styles.resultPhone}>{result.metadata.phone}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

