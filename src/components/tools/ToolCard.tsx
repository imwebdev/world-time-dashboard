'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface ToolCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  href: string;
  index?: number;
}

export default function ToolCard({ icon, name, description, href, index = 0 }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} className="group block h-full">
        <div className="h-full p-7 bg-white border border-[var(--color-border)] rounded-xl shadow-sm hover:shadow-md hover:border-[var(--color-accent)]/30 transition-all duration-300">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border-light)] flex items-center justify-center mb-5 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors duration-300">
            {icon}
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
            {name}
          </h3>
          <p className="text-sm text-[var(--color-secondary)] leading-relaxed mb-5">
            {description}
          </p>

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] group-hover:gap-2.5 transition-all">
            Try it free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
