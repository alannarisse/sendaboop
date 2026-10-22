import { test, expect } from '@playwright/test';

test.describe('URL Scraper', () => {
  test('should collect all URLs from the app', async ({ page }) => {
    const visitedUrls = new Set<string>();
    const internalLinks = new Set<string>();
    const externalLinks = new Set<string>();
    const baseUrl = 'http://localhost:8081';

    // Known pages in the app
    const pagesToVisit = ['/', '/about', '/contact', '/success', '/verify'];

    for (const pagePath of pagesToVisit) {
      try {
        await page.goto(pagePath, { waitUntil: 'networkidle' });
        visitedUrls.add(pagePath);

        // Get all anchor tags with href
        const anchorLinks = await page.locator('a[href]').all();
        for (const link of anchorLinks) {
          const href = await link.getAttribute('href');
          if (href) {
            if (href.startsWith('mailto:')) {
              externalLinks.add(href);
            } else if (href.startsWith('http') && !href.startsWith(baseUrl) && !href.startsWith('https://sendaboop.app')) {
              externalLinks.add(href);
            } else if (href.startsWith('/') || href.startsWith(baseUrl) || href.startsWith('https://sendaboop.app')) {
              const path = href.replace(baseUrl, '').replace('https://sendaboop.app', '');
              internalLinks.add(path || '/');
            }
          }
        }

        // Also check for any href attributes on other elements (React Native Web)
        const allHrefElements = await page.locator('[href]').all();
        for (const el of allHrefElements) {
          const href = await el.getAttribute('href');
          if (href && href.startsWith('http') && !href.startsWith(baseUrl) && !href.startsWith('https://sendaboop.app')) {
            externalLinks.add(href);
          }
        }
      } catch (error) {
        console.log(`Could not visit ${pagePath}: ${error}`);
      }
    }

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    URL SCRAPER RESULTS                       ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');

    console.log('║ PAGES CRAWLED:                                               ║');
    visitedUrls.forEach((url) => console.log(`║   • ${url.padEnd(57)}║`));

    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║ INTERNAL ROUTES:                                             ║');
    if (internalLinks.size === 0) {
      console.log('║   (none found - app uses programmatic navigation)            ║');
    } else {
      internalLinks.forEach((url) => console.log(`║   • ${url.padEnd(57)}║`));
    }

    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║ EXTERNAL LINKS:                                              ║');
    if (externalLinks.size === 0) {
      console.log('║   (none found)                                               ║');
    } else {
      externalLinks.forEach((url) => {
        const truncated = url.length > 55 ? url.substring(0, 52) + '...' : url;
        console.log(`║   • ${truncated.padEnd(57)}║`);
      });
    }

    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('\n');

    expect(visitedUrls.size).toBeGreaterThan(0);
  });

  test('should verify all internal links are accessible', async ({ page }) => {
    const baseUrl = 'http://localhost:8081';
    const internalPaths = ['/', '/about', '/contact'];
    const results: { path: string; status: string }[] = [];

    for (const path of internalPaths) {
      try {
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        const status = response?.status() || 'unknown';
        results.push({ path, status: status === 200 ? 'OK' : `Error: ${status}` });
      } catch (error) {
        results.push({ path, status: `Failed: ${error}` });
      }
    }

    console.log('\n========== LINK ACCESSIBILITY CHECK ==========\n');
    results.forEach(({ path, status }) => {
      console.log(`  ${path}: ${status}`);
    });
    console.log('\n===============================================\n');

    // Verify all main pages are accessible
    const failedPages = results.filter((r) => !r.status.includes('OK'));
    expect(failedPages.length).toBe(0);
  });

  test('should collect all image URLs', async ({ page }) => {
    const imageUrls = new Set<string>();
    const pagesToVisit = ['/', '/about'];

    for (const pagePath of pagesToVisit) {
      try {
        await page.goto(pagePath, { waitUntil: 'networkidle' });

        // Get all image tags
        const images = await page.locator('img[src]').all();
        for (const img of images) {
          const src = await img.getAttribute('src');
          if (src) {
            imageUrls.add(src);
          }
        }
      } catch (error) {
        console.log(`Could not visit ${pagePath}: ${error}`);
      }
    }

    console.log('\n========== IMAGE URLs ==========\n');
    console.log(`Found ${imageUrls.size} unique images:\n`);
    imageUrls.forEach((url) => console.log(`  - ${url}`));
    console.log('\n================================\n');

    expect(imageUrls.size).toBeGreaterThan(0);
  });

  test('should generate a sitemap of all routes', async ({ page }) => {
    const routes = new Map<string, { title: string; hasForm: boolean; linkCount: number }>();

    const pagesToVisit = [
      { path: '/', name: 'Home' },
      { path: '/about', name: 'About' },
      { path: '/contact', name: 'Contact' },
      { path: '/success?recipientName=Test&animalUid=1&pending=true&senderEmail=test@test.com', name: 'Success (Pending)' },
      { path: '/verify?token=test', name: 'Verify' },
    ];

    for (const { path, name } of pagesToVisit) {
      try {
        await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 5000 });

        // Get page title
        const title = await page.title();

        // Check if page has a form
        const formCount = await page.locator('input, textarea').count();
        const hasForm = formCount > 0;

        // Count links
        const linkCount = await page.locator('a[href]').count();

        routes.set(path.split('?')[0], { title, hasForm, linkCount });
      } catch (error) {
        routes.set(path.split('?')[0], { title: 'Error loading', hasForm: false, linkCount: 0 });
      }
    }

    console.log('\n========== SITEMAP ==========\n');
    routes.forEach((info, path) => {
      console.log(`${path}`);
      console.log(`  Title: ${info.title}`);
      console.log(`  Has Form: ${info.hasForm}`);
      console.log(`  Link Count: ${info.linkCount}`);
      console.log('');
    });
    console.log('=============================\n');

    expect(routes.size).toBeGreaterThan(0);
  });
});
