'use client';

import Script from 'next/script';

export default function GoogleAnalyticsComponent() {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-HC1GMR7WTG`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HC1GMR7WTG');
          `,
        }}
      />
    </>
  );
}