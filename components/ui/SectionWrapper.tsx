"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionWrapperProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
}

export function SectionWrapper({
  id,
  title,
  subtitle,
  children,
  cta,
  className,
  contentClassName,
  headerClassName,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("py-24 md:py-32 px-6 md:px-24 border-t border-[#EAE6E1]/5 bg-[#131210]", className)}
    >
      <div className={cn("max-w-7xl mx-auto", contentClassName)}>
        {(title || subtitle) && (
          <header className={cn("mb-16 md:mb-20", headerClassName)}>
            {title && (
              <div className="overflow-hidden mb-4">
                <motion.h2
                  initial={{ y: "100%", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter uppercase"
                >
                  {title}
                </motion.h2>
              </div>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-[9px] uppercase tracking-[0.2em] font-medium text-[#EAE6E1]/40 max-w-xl leading-loose"
              >
                {subtitle}
              </motion.p>
            )}
            {cta && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-8"
              >
                {cta}
              </motion.div>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
