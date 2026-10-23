# Send a Boop

Send a little kindness to someone's inbox. Send a Boop lets you choose a cute dog or cat photo, add a personal message, and email it to a friend.

![Send a Boop social preview](public/images/og-image.png)

[Visit Send a Boop](https://sendaboop.app) · [Expo project](https://expo.dev/accounts/alannarisse/projects/sendaboop)

## How it works

1. Pick an animal photo.
2. Enter your name and email, and your friend's name and email.
3. Add an optional message of up to 280 characters.
4. Tap **Send Boop**, then check your inbox for a verification email.
5. Follow the verification link to deliver the boop to your friend.

Sender verification links expire after 24 hours. The app also includes a contact form, an About page, and links that let recipients send a boop back. On iPhone, the form has a **Done** button for dismissing the keyboard, keyboard-aware scrolling, and navigation that respects the status-bar safe area.

One Expo project provides the web app and native mobile interface. The iOS app is being tested through TestFlight; Android configuration is also included in the project.

## Stack

| Layer | Technology |
| --- | --- |
| App framework | Expo SDK 54, React Native 0.81, React 19, TypeScript |
| Routing | Expo Router 6 |
| Web | React Native Web, Metro static export |
| UI | React Native styles, Expo Linear Gradient, React Native SVG, safe-area context |
| Fonts | Quattrocento and Quattrocento Sans, loaded with Expo Font |
| API | Node.js, Express 4, TypeScript |
| Email | Resend |
| Verification | Signed JWTs using `jose`, with 24-hour expiration |
| Request limits | `express-rate-limit` on sending and verification endpoints |
| Checks | Playwright, ESLint, TypeScript |
| Hosting and distribution | Vercel for the website, Railway for the API, Expo EAS for iOS builds and uploads |

The current API does not use a database. Used verification-token IDs are tracked in memory, so that replay protection resets when the server restarts and is not shared across server instances.

## Install for local development

You need Node.js **20.19.4 or newer** and npm. For native development, use Xcode and the iOS Simulator on macOS, or Android Studio and an Android emulator. A physical phone can also connect to the Expo development server.

From the repository root:

```bash
npm ci
npm --prefix server install
cp .env.example .env
```

The separate server installation supplies API dependencies such as `jose` and `express-rate-limit`.

Edit the root `.env` file:

```dotenv
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=replace_with_a_long_random_secret
APP_URL=http://localhost:8081
EXPO_PUBLIC_API_URL=http://localhost:3001
PORT=3001
```

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-only key for sending verification, boop, and contact emails |
| `JWT_SECRET` | Server-only secret for signing and validating verification tokens |
| `APP_URL` | Frontend URL used to construct email verification links |
| `EXPO_PUBLIC_API_URL` | API origin used by the web and mobile clients |
| `PORT` | Express port; defaults to `3001` |

Keep `.env` out of Git. Only `EXPO_PUBLIC_API_URL` belongs in the client; never put email-provider keys or signing secrets in an `EXPO_PUBLIC_` variable.

Real email delivery requires a Resend account authorized to send from the configured sender domain. The sender address is currently set in `server/api.ts` to `sendaboopmain@sendaboop.app`; change the sender configuration if you use your own domain. The contact form's destination is also configured in that file.

## Run locally

Start the API from the repository root in one terminal:

```bash
npm run server
```

In another terminal, start the web app:

```bash
npm run web -- --port 8081
```

Open [localhost:8081](http://localhost:8081). The API health endpoint is [localhost:3001/api/health](http://localhost:3001/api/health).

For mobile development:

```bash
npm start
```

Follow the Expo terminal prompts to open a device or simulator. You can also launch directly with:

```bash
npm run ios
npm run android
```

On a physical phone, `localhost` refers to the phone. Set `EXPO_PUBLIC_API_URL` to your computer's LAN address, such as `http://192.168.1.20:3001`, and use a reachable frontend URL for `APP_URL`. Keep the phone and computer on the same network. Android Emulator normally reaches the host through `http://10.0.2.2:3001`. Restart Expo after changing client environment variables.

For local verification emails, remember that the link opens on whichever device reads the email. The current email templates and animal-image URLs also contain production links; see `server/api.ts` and `lib/animals.ts` when adapting the project to another domain.

## Checks and browser tests

```bash
npx tsc --noEmit
npm run lint
npx playwright install chromium
npm test
```

For the interactive Playwright runner:

```bash
npm run test:ui
```

Playwright starts or reuses the web app on port `8081`. The suite includes form validation, mocked sending and verification responses, and a URL inventory. Browser tests do not validate the native iOS keyboard or safe-area layout; check those on a simulator or physical phone.

## Web and API deployment

Vercel runs the web export configured in `vercel.json`:

```bash
npx expo export --platform web
```

The generated website is written to `dist/`. Set `EXPO_PUBLIC_API_URL` in the frontend deployment environment before building.

Railway uses `railway.json` to install and compile the separate server package, then runs `node server/dist/api.js`. Set `RESEND_API_KEY`, a strong `JWT_SECRET`, and the production `APP_URL` in the server environment. The API's current production origin is `https://sendaboop-production.up.railway.app`.

## iOS builds and TestFlight

The project is linked to Expo account **alannarisse** with bundle identifier **com.sendaboop.app**. Native distribution requires access to the Expo project and an active Apple Developer Program membership.

Authenticate, then create a production build:

```bash
npx eas-cli login
npx eas-cli build --platform ios --profile production
```

After the build succeeds, upload it to App Store Connect:

```bash
npx eas-cli submit --platform ios --profile production
```

Select the completed build when prompted. Once Apple finishes processing it, install it through TestFlight using your tester invitation. Uploading to TestFlight does not publish the app to the App Store; the store listing and App Review submission are separate steps.

The production profile automatically increments the iOS build number. Both profiles in `eas.json` currently point to the production Railway API. A preview build therefore uses the live service too.

See [the iOS release guide](docs/ios-release.md) for signing, testing, and submission details.

## Project structure

```text
app/                 Expo Router screens and root layout
components/          Navigation, animal picker, form, and reusable UI
lib/                 API client, animal catalog, and shared theme
assets/              Bundled fonts, app icons, and mobile images
public/              Static web assets and publicly hosted email images
  images/og-image.png  Social sharing preview shown above
server/              Express API, email templates, and verification logic
e2e/                 Playwright browser tests
docs/                Design notes and iOS release instructions
app.json             Expo app identity and platform configuration
eas.json             Native build and submission profiles
```

## Privacy

Send a Boop is intended to use the names, email addresses, and message you enter to deliver your boop, rather than build a mailing list. The API passes this information to Resend for delivery, and verification links contain a signed token with the boop details. A signed token is not encrypted. Email-provider retention and infrastructure logging also need to be considered when describing how data is handled.

The in-app privacy statement is on the About page. Review it against the deployed service and provider settings before completing App Store privacy disclosures. Use the contact form to get in touch about the service.

## About the creator

I'm Alanna Risse, a web developer and adjunct instructor in the design program at Portland State University in Portland, Oregon. Send a Boop began as a UX/UI teaching concept and became a working Expo/React Native app, built with help from Claude Code and Codex.

Learn more at [alannarisse.com](https://alannarisse.com).
