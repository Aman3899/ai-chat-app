'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import { ReactNode, useState } from 'react';

export function withTRPC(Component: any) {
    return function TRPCProviderWrapper(props: any) {
        const [queryClient] = useState(() => new QueryClient());
        const [trpcClient] = useState(() =>
            trpc.createClient({
                links: [
                    httpBatchLink({
                        url: '/api/trpc',
                    }),
                ],
            })
        );

        return (
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <Component {...props} />
                </QueryClientProvider>
            </trpc.Provider>
        );
    };
}