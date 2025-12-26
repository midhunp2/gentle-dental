import { GraphQLClient, gql } from "graphql-request";
// import { cacheTag, cacheLife } from "next/cache";

const endpoint = "https://dev-headlessd10.pantheonsite.io/graphql";
export const client = new GraphQLClient(endpoint, {
  fetch: (url: string | URL | Request, options?: RequestInit) =>
    fetch(url, { ...options, next: { revalidate: 1 } } as RequestInit),
});

export const PageByRouteQuery = gql`
  query PageByRoute($path: String!) {
    route(path: $path) {
      ... on RouteInternal {
        url
        entity {
          ... on NodeHomepage {
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
            }
          }
        }
      }
    }
  }
`;

// Legacy query for backward compatibility
export const MyQuery = gql`
  query MyQuery {
    paragraphHeroSections(first: 10) {
      nodes {
        backgroundImage {
          id
          mediaImage {
            alt
            title
            url
          }
        }
        ctaText
        headingLarge
        headingSmall
        searchPlaceholder
      }
    }
  }
`;

export async function fetchPageByRoute(path: string = "/node/7") {
  try {
    const data = await client.request(PageByRouteQuery, { path });
    return data;
  } catch (error) {
    console.error("Error fetching page by route:", error);
    throw error;
  }
}

export async function fetchHeroSections() {
  try {
    const data = await client.request(MyQuery);
    return data;
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    throw error;
  }
}