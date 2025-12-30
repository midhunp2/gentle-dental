import { SearchResult } from '@/app/store/useSearchStore';
import { dentalOffices, DentalOffice } from '@/app/dental-offices/data';
import { fetchArticles } from '@/app/lib/queries/query';

// Helper function to strip HTML tags
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Search dental offices
export const searchDentalOffices = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  dentalOffices.forEach((office: DentalOffice) => {
    const nameMatch = office.name.toLowerCase().includes(lowerQuery);
    const addressMatch = office.address.toLowerCase().includes(lowerQuery);
    const phoneMatch = office.phone.toLowerCase().includes(lowerQuery);

    if (nameMatch || addressMatch || phoneMatch) {
      results.push({
        id: `office-${office.id}`,
        type: 'dental-office',
        title: office.name,
        description: office.address,
        url: `/dental-offices?p=${encodeURIComponent(office.name)}`,
        metadata: {
          address: office.address,
          phone: office.phone,
        },
      });
    }
  });

  return results;
};

// Search articles
export const searchArticles = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  try {
    const data = await fetchArticles();
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    data.paragraphArticleCards.nodes.forEach((card: any, index: number) => {
      const title = card.title?.value || '';
      const description = stripHtml(
        card.description?.processed || card.description?.value || ''
      );
      const titleMatch = title.toLowerCase().includes(lowerQuery);
      const descriptionMatch = description.toLowerCase().includes(lowerQuery);

      if (titleMatch || descriptionMatch) {
        const slug = generateSlug(title);
        results.push({
          id: `article-${index}`,
          type: 'article',
          title,
          description: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
          url: card.ctaLink?.url || `/patient-resources/articles/${slug}`,
          metadata: {
            image: card.image?.mediaImage?.url,
          },
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
};

// Search pages
export const searchPages = (query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const pages = [
    {
      title: 'Locations',
      description: 'Find a Gentle Dental location near you',
      url: '/locations',
      keywords: ['locations', 'location', 'find', 'office', 'offices', 'near me'],
    },
    {
      title: 'Dental Services',
      description: 'Comprehensive dental services we offer',
      url: '/services',
      keywords: ['services', 'service', 'dental services', 'treatment', 'treatments'],
    },
    {
      title: 'Payment Options',
      description: 'Learn about our payment and insurance options',
      url: '/payment',
      keywords: ['payment', 'payments', 'insurance', 'financing', 'options'],
    },
    {
      title: 'Patient Resources',
      description: 'Articles and resources for patients',
      url: '/patient-resources/articles',
      keywords: ['patient', 'resources', 'articles', 'article', 'blog', 'information'],
    },
    {
      title: 'About Us',
      description: 'Learn more about Gentle Dental',
      url: '/about',
      keywords: ['about', 'about us', 'company', 'gentle dental'],
    },
  ];

  const results: SearchResult[] = [];

  pages.forEach((page) => {
    const titleMatch = page.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = page.description.toLowerCase().includes(lowerQuery);
    const keywordMatch = page.keywords.some((keyword) =>
      keyword.toLowerCase().includes(lowerQuery)
    );

    if (titleMatch || descriptionMatch || keywordMatch) {
      results.push({
        id: `page-${page.url}`,
        type: 'page',
        title: page.title,
        description: page.description,
        url: page.url,
      });
    }
  });

  return results;
};

// Main search function
export const performGlobalSearch = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];

  const [dentalOfficesResults, articlesResults, pagesResults] = await Promise.all([
    Promise.resolve(searchDentalOffices(query)),
    searchArticles(query),
    Promise.resolve(searchPages(query)),
  ]);

  // Combine and limit results (prioritize matches)
  const allResults = [
    ...dentalOfficesResults,
    ...articlesResults,
    ...pagesResults,
  ];

  // Sort by relevance (exact title matches first, then partial matches)
  const sortedResults = allResults.sort((a, b) => {
    const aTitleLower = a.title.toLowerCase();
    const bTitleLower = b.title.toLowerCase();
    const queryLower = query.toLowerCase();

    // Exact title match gets highest priority
    if (aTitleLower === queryLower && bTitleLower !== queryLower) return -1;
    if (bTitleLower === queryLower && aTitleLower !== queryLower) return 1;

    // Title starts with query gets second priority
    if (aTitleLower.startsWith(queryLower) && !bTitleLower.startsWith(queryLower))
      return -1;
    if (bTitleLower.startsWith(queryLower) && !aTitleLower.startsWith(queryLower))
      return 1;

    // Then alphabetical
    return aTitleLower.localeCompare(bTitleLower);
  });

  // Limit to top 20 results
  return sortedResults.slice(0, 20);
};

