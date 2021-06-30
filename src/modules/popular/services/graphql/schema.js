import { gql } from '@apollo/client';

export const getPopularProducts = gql`
    query($search: String) {
        products(search: $search, sort: {
            relevance: ASC
        }) {
            total_count
            items {
                name
                image{
                    url
                }
                qty_available
            }
        }
    }
`;

export default { getPopularProducts };
