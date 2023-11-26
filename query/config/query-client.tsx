import queryClientConfig from '@/query/config/query-config';
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

const getQueryClient = cache(() => new QueryClient(queryClientConfig));
export default getQueryClient;
