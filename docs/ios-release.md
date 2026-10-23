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
