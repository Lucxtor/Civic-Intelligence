'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useMockStore } from '@/store/useMockStore';

export function GlobalNav() {
  const pathname = usePathname();
  const proposals = useMockStore((state) => state.proposals);

  if (pathname === '/' || pathname === '/proposals') return null;

  // Derive dynamic breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  const isProposalsRoute = segments[0] === 'proposals';
  const proposalId = isProposalsRoute ? segments[1] : null;

  let activeTitle = '';
  if (proposalId) {
    const p = proposals.find(pr => pr.id === proposalId);
    if (p) activeTitle = p.title;
    else if (proposalId !== 'new') activeTitle = 'Proposal Profile';
  } else if (segments[0] === 'admin' && segments[1] === 'analytics') {
     activeTitle = 'Civic Telemetry Hub';
  } else if (segments[0] === 'admin') {
     activeTitle = 'Proposal Forge';
  }

  return (
    <nav className="hidden md:flex items-center text-sm text-muted-foreground mr-6">
      <Link href="/proposals" className="hover:text-ipe-green transition-colors">Directory</Link>
      <ChevronRight className="w-4 h-4 mx-1" />
      <span className="font-medium text-foreground truncate max-w-[200px] lg:max-w-md">
        {activeTitle}
      </span>
      {segments.length > 2 && (
        <>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-bold text-ipe-yellow capitalize">{segments[2]}</span>
        </>
      )}
    </nav>
  );
}
