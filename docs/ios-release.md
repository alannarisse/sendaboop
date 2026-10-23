# iOS release

Expo owner: `alannarisse`  
Bundle identifier: `com.sendaboop.app`

## Connect the project

From the project directory, authenticate in your own terminal:

```sh
npx eas-cli login
npx eas-cli whoami
npx eas-cli init
```

Use an existing Send a Boop project if one exists under this account. Otherwise,
create it under `alannarisse`. EAS init writes the real project ID to app.json;
do not substitute the account name for that ID.

## Build for TestFlight

```sh
npx expo install --check
npx eas-cli build --platform ios --profile production
```

The production profile increments the remote iOS build number. Both build
profiles use the public Railway API URL in eas.json. Keep Resend and JWT secrets
on the server; they must never be added to the mobile build.

Follow EAS prompts to select the Apple Developer team and configure signing.
Confirm that `com.sendaboop.app` is available to that team. Sign into Apple
yourself when prompted.

After a successful build, upload it to App Store Connect:

```sh
npx eas-cli submit --platform ios --profile production
```

Uploading makes the build available for processing and TestFlight; the store
listing and App Review submission are separate steps in App Store Connect.

## Before App Review

- Test on real iPhone hardware: animal selection, form validation, sending,
  sender verification, error handling, contact form, and external links.
- Test iPad layouts because app.json enables tablet support.
- Confirm the production API and hosted animal images are reachable.
- Review the privacy policy against actual server and email-provider handling,
  then complete Apple's privacy disclosures and age rating.
- Review the in-app Ko-fi tip links against applicable App Review rules.
- Prepare screenshots, description, support URL, privacy URL, and review notes
  explaining the sender verification email flow.
- Confirm the selected EAS build image meets Apple's SDK requirements at the
  time of submission.

References:
- https://docs.expo.dev/tutorial/eas/ios-production-build/
- https://developer.apple.com/app-store/submitting/

## App-only email verification links

The iOS client sends `clientPlatform: 'ios'` when creating a boop. The API uses
`https://sendaboop.app/app-verify?token=...` for those requests. Web, Android, and
older clients continue to receive `/verify?token=...`. The platform field is a
routing preference, not an authentication mechanism.

Only `/app-verify` is registered for Universal Links. Both routes render the same
verification screen, preserving a browser fallback. If an iOS-created email is
opened on another device with the app installed, that device may open the app
too; routing follows the link and the device opening it.

Release in this order:

1. Deploy the website to Vercel. Confirm
   `https://sendaboop.app/.well-known/apple-app-site-association` returns HTTP 200
   directly, with JSON content type and app ID `6ZV8WRZJBG.com.sendaboop.app`.
   Confirm `/app-verify` loads the verification screen in a browser.
2. Deploy the API to Railway so it recognizes `clientPlatform`.
3. Create a new production iOS build and submit it to TestFlight. EAS should
   synchronize the Associated Domains capability and signing profile. Install
   the updated build after deploying the association file.
4. Send a boop from the updated app, then tap the verification button in Mail.
   Check both a cold launch and an already-running app. Create a separate boop
   on the website and confirm its verification link stays in the browser.

If Resend click tracking is enabled, disable it for verification emails so it
doesn't replace the direct associated-domain link with a tracking redirect.
Mail-client handling and the user's preference to open links in a browser can
still affect whether iOS opens the app. Apple caches domain associations, so
changes may take time to propagate. These links require a signed native build;
Expo Go is not a substitute for testing them.

Focused local checks:

```sh
node --import tsx --test tests/verification-links.test.ts
npx playwright test e2e/app-verification.spec.ts
```

Reference: https://docs.expo.dev/linking/ios-universal-links/
