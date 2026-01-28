import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Primary Meta Tags */}
        <title>Send a Boop - Brighten Someone's Day with a Cute Dog</title>
        <meta name="title" content="Send a Boop - Brighten Someone's Day with a Cute Dog" />
        <meta name="description" content="Send a free, fun email to a friend featuring an adorable dog and a personal message. No strings attached - just pure joy!" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sendaboop.app/" />
        <meta property="og:title" content="Send a Boop - Brighten Someone's Day with a Cute Dog" />
        <meta property="og:description" content="Send a free, fun email to a friend featuring an adorable dog and a personal message. No strings attached - just pure joy!" />
        <meta property="og:image" content="https://sendaboop.app/images/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://sendaboop.app/" />
        <meta property="twitter:title" content="Send a Boop - Brighten Someone's Day with a Cute Dog" />
        <meta property="twitter:description" content="Send a free, fun email to a friend featuring an adorable dog and a personal message. No strings attached - just pure joy!" />
        <meta property="twitter:image" content="https://sendaboop.app/images/og-image.png" />

        {/* Disable body scrolling on web */}
        <ScrollViewStyleReset />

        {/* Add any additional head elements here */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #root {
            height: 100%;
          }
          body {
            overflow: hidden;
          }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
