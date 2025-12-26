import { GraphQLClient, gql } from "graphql-request";
// import { cacheTag, cacheLife } from "next/cache";

const endpoint = "https://dev-headlessd10.pantheonsite.io/graphql";
export const client = new GraphQLClient(endpoint, {
  fetch: (url: string | URL | Request, options?: RequestInit) =>
    fetch(url, { ...options, next: { revalidate: 1 } } as RequestInit),
});

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

export async function fetchHeroSections() {
  try {
    const data = await client.request(MyQuery);
    return data;
  } catch (error) {
    console.error("Error fetching hero sections:", error);
    throw error;
  }
}