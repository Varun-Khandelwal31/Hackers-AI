'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function JudgeRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      router.replace(`/evaluation?projectId=${projectId}`);
    } else {
      router.replace('/evaluation');
    }
  }, [router, searchParams]);

  return <div className="p-8 text-center text-xs text-slate-400">Redirecting to AI Evaluation Hub...</div>;
}

export default function JudgePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading...</div>}>
      <JudgeRedirectContent />
    </Suspense>
  );
}
