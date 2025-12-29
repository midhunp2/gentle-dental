import { GraphQLClient, gql } from "graphql-request";
// import { cacheTag, cacheLife } from "next/cache";

const endpoint = "https://dev-headlessd10.pantheonsite.io/graphql";
export const client = new GraphQLClient(endpoint, {
  fetch: (url: string | URL | Request, options?: RequestInit) =>
    fetch(url, { ...options, next: { revalidate: 1 } } as RequestInit),
});

export const HomePageQuery = gql`
  query HomePage($path: String!) {
    route(path: $path) {
      ... on RouteInternal {
        url
        entity {
          ... on NodeHomepage {
            title
            sections {
              ... on ParagraphHeroSection {
                id
                backgroundImage {
                  mediaImage {
                    alt
                    url
                  }
                }
                headingLarge
                headingSmall
                searchPlaceholder
              }
              ... on ParagraphIconCardsSection {
                id
                cards {
                  icontitle
                  icondescription
                  icon {
                    mediaImage {
                      alt
                      url
                    }
                  }
                }
              }
              ... on ParagraphTextImageSection {
                id
                heading
                sectiondescription
                image {
                  mediaImage {
                    alt
                    url
                  }
                }
                ctaText
                ctaLink {
                  url
                  title
                }
                stats {
                  number
                  label
                }
              }
              ... on ParagraphServiceCard {
                id
                image {
                  mediaImage {
                    alt
                    title
                    url
                  }
                }
                title {
                  value
                }
                link {
                  url
                }
              }
              ... on ParagraphStatItem {
                id
                number
              }
              ... on ParagraphTestimonialSection {
                id
                title {
                  value
                }
                testimonialCards {
                  name
                  rating
                  review
                  status
                }
              }
              ... on ParagraphInsuranceSection {
                id
                ctaLink {
                  url
                  title
                }
                ctaText
                description {
                  value
                }
                logosSection {
                  logo {
                    name
                    mediaImage {
                      alt
                      url
                    }
                  }
                }
              }
              ... on ParagraphLocationCard {
                id
                link {
                  url
                  title
                }
                locationCard
              }
              ... on ParagraphOfferBanner {
                id
                ctaLink {
                  url
                  title
                }
                ctaText
                description {
                  value
                }
                heading
                price
              }
              ... on ParagraphHoverText {
                id
                ctaText
                ctaLink {
                  url
                }
                description {
                  value
                }
                title {
                  value
                }
              }
              ... on ParagraphTestimonial {
                id
                name
                rating
                review
              }
              ... on ParagraphLocationsSection {
                id
                ctaLink {
                  title
                  url
                }
                ctaText
                status
                locationCarousel {
                  image {
                    mediaImage {
                      alt
                      url
                    }
                  }
                  link {
                    url
                    title
                  }
                  locationCard
                }
              }
              ... on ParagraphInsuranceLogo {
                id
                name
              }
              ... on ParagraphIconCard {
                id
                icondescription
                icontitle
                icon {
                  mediaImage {
                    alt
                    url
                  }
                }
              }
              ... on ParagraphServicesGrid {
                id
                sectionTitle
                services {
                  ... on ParagraphServiceCard {
                    id
                    image {
                      mediaImage {
                        alt
                        url
                        title
                      }
                    }
                    title {
                      value
                    }
                  }
                  ... on ParagraphHoverText {
                    id
                    ctaLink {
                      url
                      title
                    }
                    ctaText
                    description {
                      value
                    }
                    title {
                      value
                    }
                  }
                }
              }
              ... on ParagraphDentistCard {
                id
                description {
                  value
                }
                image {
                  mediaImage {
                    alt
                    url
                  }
                  name
                }
                title {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchHomePage(path: string = "/node/7") {
  try {
    const data = await client.request(HomePageQuery, { path });
    return data;
  } catch (error) {
    console.error("Error fetching home page:", error);
    throw error;
  }
}

export const ArticlesQuery = gql`
  query ArticlesQuery {
    paragraphArticleCards(first: 100) {
      nodes {
        title {
          value
        }
        description {
          processed
          value
        }
        image {
          mediaImage {
            alt
            url
          }
        }
        ctaLink {
          url
          title
        }
        ctaText
      }
    }
    paragraphArticleBanners(first: 1) {
      nodes {
        bannerImage {
          mediaImage {
            alt
            url
          }
        }
        bannerHeading
      }
    }
  }
`;

export async function fetchArticles() {
  try {
    const data = await client.request(ArticlesQuery);
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}