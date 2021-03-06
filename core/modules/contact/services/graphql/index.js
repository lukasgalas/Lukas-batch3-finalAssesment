import { useMutation, useQuery } from '@apollo/client';
import * as Schema from '@core_modules/contact/services/graphql/schema';

export const contactusFormSubmit = (options) => useMutation(Schema.contactusFormSubmit, { ...options });
export const getCmsBlocks = (variables) => useQuery(Schema.getCmsBlocks, { variables });

export default { contactusFormSubmit, getCmsBlocks };
