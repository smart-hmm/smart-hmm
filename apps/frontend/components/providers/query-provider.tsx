"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface Props {
    children: React.ReactNode
}

const ReactQueryProvider: React.FC<Props> = ({ children }) => {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
            }
        }
    })
    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}

export default ReactQueryProvider