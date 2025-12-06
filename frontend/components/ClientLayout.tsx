'use client';

/**
 * Client Layout Wrapper
 * Handles client-side features
 */

import { ReactNode } from 'react';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <>{children}</>;
}
