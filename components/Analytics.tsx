/**
 * Analytics placeholder. Replace with your GA/PostHog script.
 * Example: Google Analytics 4
 * - Add NEXT_PUBLIC_GA_ID to env
 * - Load gtag and send page_view / events (nomination_start, nomination_complete, cta_click)
 */

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  );
}
