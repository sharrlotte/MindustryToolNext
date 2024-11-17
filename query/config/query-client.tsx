import { cache } from 'react';

import queryClientConfig from '@/query/config/query-config';

import { QueryClient } from '@tanstack/react-query';

const getQueryClient = cache(() => new QueryClient(queryClientConfig));
export default getQueryClient;
