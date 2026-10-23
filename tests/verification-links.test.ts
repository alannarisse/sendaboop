import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createVerificationUrl } from '../server/verification-links';

test('iOS verification links preserve the token and use the app-associated path', () => {
  const token = 'test+token/with?reserved=&characters';
  const url = new URL(createVerificationUrl('https://sendaboop.app/', token, 'ios'));
  assert.equal(url.pathname, '/app-verify');
  assert.equal(url.searchParams.get('token'), token);
});

test('web, Android, old clients, and unknown clients keep browser verification', () => {
  for (const platform of ['web', 'android', undefined, 'unknown']) {
    assert.equal(new URL(createVerificationUrl('https://sendaboop.app', 'token', platform)).pathname, '/verify');
  }
});

test('Apple association matches the configured app and only the iOS verification route', () => {
  const association = JSON.parse(readFileSync('public/.well-known/apple-app-site-association', 'utf8'));
  const config = JSON.parse(readFileSync('app.json', 'utf8'));
  const detail = association.applinks.details[0];
  assert.equal(detail.appID, `6ZV8WRZJBG.${config.expo.ios.bundleIdentifier}`);
  assert.deepEqual(detail.paths, ['/app-verify']);
  assert.ok(config.expo.ios.associatedDomains.includes('applinks:sendaboop.app'));
});
