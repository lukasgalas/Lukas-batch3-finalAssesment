import { useQuery } from '@apollo/client';
import * as Schema from '@core_modules/popular/services/graphql/schema';

export const getPopularProducts = (variables) => useQuery(Schema.getPopularProducts, { variables });

export default { getPopularProducts };
