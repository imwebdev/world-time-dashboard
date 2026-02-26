import Breadcrumbs from '@/components/layout/Breadcrumbs';
import AdSlot from '@/components/layout/AdSlot';
import RelatedTools from '@/components/tools/RelatedTools';

interface ToolPageLayoutProps {
  toolName: string;
  toolHref: string;
  children: React.ReactNode;
  seoContent: React.ReactNode;
}

export default function ToolPageLayout({ toolName, toolHref, children, seoContent }: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: 'Tools', href: '/#tools' }, { label: toolName }]} />

        {/* Top ad slot */}
        <AdSlot className="mb-8" />

        {/* Main content area with optional sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div>
            {/* Tool */}
            <div className="mb-10">{children}</div>

            {/* Mid-page ad slot */}
            <AdSlot className="mb-10" />

            {/* SEO content */}
            <div className="prose-stripe">{seoContent}</div>
          </div>

          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block space-y-6">
            <div className="sticky top-24">
              <AdSlot className="mb-6" label="Sidebar Ad" />
              <div className="p-6 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl">
                <h3 className="text-sm font-semibold text-[var(--color-primary)] mb-3">Quick Links</h3>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <a href="#about" className="text-[var(--color-accent)] hover:underline">About this tool</a>
                  </li>
                  <li>
                    <a href="#how-to" className="text-[var(--color-accent)] hover:underline">How to use</a>
                  </li>
                  <li>
                    <a href="#faq" className="text-[var(--color-accent)] hover:underline">FAQs</a>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Related tools */}
        <RelatedTools currentHref={toolHref} />
      </div>
    </div>
  );
}
