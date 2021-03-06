/* eslint-disable import/prefer-default-export */
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import schema, { getCmsBlocks as getCmsBlocksSchema } from '@core_modules/theme/services/graphql/schema';

export const getCategories = () => useQuery(schema.categories);
export const getCategoryByName = (name) => useLazyQuery(schema.getCategoryByName(name));
export const getProduct = (key) => useLazyQuery(schema.getProduct(key));
export const getVesMenu = (options) => useQuery(schema.vesMenu, options);
export const getCurrency = () => useQuery(schema.getCurrencySchema);

export const getCustomer = () => useQuery(schema.getCustomer, {
    context: {
        request: 'internal',
        skip: typeof window === 'undefined',
    },
    fetchPolicy: 'no-cache',
});

export const removeToken = () => useMutation(schema.removeToken, {
    context: {
        request: 'internal',
    },
});

export const getCmsBlocks = (variables) => useQuery(getCmsBlocksSchema, { variables });

export default {
    getCmsBlocks,
    getCategories,
    getCustomer,
    removeToken,
    getVesMenu,
    getProduct,
    getCategoryByName,
    getCurrency,
};
