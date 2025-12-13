import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner';
import { SearchResults } from './SearchResults';

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">Search</h1>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
