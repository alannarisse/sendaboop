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
        <title>Send a Boop - Cute Dog Emails to Your Friends</title>
        <meta name="title" content="Send a Boop - Brighten Someone's Day with a Cute Dog Email" />
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
        <meta name="author" content="Alanna Risse" />
        <meta name="publish_date" property="og:publish_date" content="2026-01-28T00:00:00-0600" />
        <meta property="og:image:secure_url" content="https://sendaboop.app/images/og-image.png" /> 
        <meta property="og:image:type" content="image/png" /> 
        <meta property="og:image:width" content="1200" /> 
        <meta property="og:image:height" content="630" />
        {/* PWA / Add to Homescreen */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Send A Boop" />
        <link rel="apple-touch-icon" href="/images/homescreen-icon-192.png" />
        <link rel="apple-touch-icon" href="/images/touch-icon-152.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/images/homescreen-icon-72.png" sizes="72x72" />
        <link rel="apple-touch-icon" sizes="180x180" href="touch-icon-180.png"/>
        <link rel="apple-touch-icon" sizes="167x167" href="touch-icon-167x167.png"/>
        <link rel="apple-touch-startup-image" href="images/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>

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
