import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/services/query-client';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Provides application-wide infrastructure such as React Query and toasts.
 *
 * @component
 * @param {ProvidersProps} props - Provider contents.
 * @param {ReactNode} props.children - Application tree.
 * @returns {JSX.Element} The application provider tree.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster offset={{ top: 64 }} position="top-left" theme="light" richColors dir="rtl" closeButton toastOptions={{ closeButtonAriaLabel: 'بستن اعلان' }} />
    </QueryClientProvider>
  );
}
