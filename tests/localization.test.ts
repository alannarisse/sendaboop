import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ko } from '../lib/ko';
import { translate } from '../lib/translations';
import { createVerificationEmail, createRecipientEmail, createSenderEmail } from '../server/email-templates';
import { emailText, normalizeEmailLanguage } from '../server/email-localization';
import { createVerificationUrl } from '../server/verification-links';

const boop = {
  locale: 'ko', senderName: '민지 & Alex', senderEmail: 'sender@example.com',
  recipientName: '지수', recipientEmail: 'friend@example.com',
  message: 'This message stays English. 안녕! <3',
  animal: { url: 'https://example.com/cat.png', alt: 'Photo: Photographer' },
};

test('Korean translations retain every named interpolation value', () => {
  const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  for (const [source, korean] of Object.entries(ko)) {
    assert.ok(korean.trim(), source);
    assert.deepEqual(placeholders(source), placeholders(korean), source);
  }
  assert.equal(translate('ko', '{name} is going to love this!', { name: 'Alex {someone}' }), 'Alex {someone}님이 무척 좋아하실 거예요!');
  assert.equal(translate('en', 'Your name'), 'Your name');
  assert.equal(translate('ko', 'Unknown server message'), 'Unknown server message');
});

test('Korean email templates localize fixed copy and preserve names and personal messages', () => {
  const verification = createVerificationEmail(boop, 'https://sendaboop.app/app-verify?token=test&lang=ko');
  assert.match(verification, /lang="ko"/);
  assert.match(verification, /부프 전송 확인/);
  assert.match(verification, /민지 &amp; Alex님, 안녕하세요!/);
  assert.match(verification, /This message stays English\. 안녕! &lt;3/);
  assert.match(verification, /href="https:\/\/sendaboop.app\/app-verify\?token=test&lang=ko"/);
  const recipient = createRecipientEmail(boop);
  assert.match(recipient, /부프가 도착했어요!/);
  assert.match(recipient, /지수님, 안녕하세요!/);
  assert.ok(recipient.includes(`toName=${encodeURIComponent(boop.senderName)}&lang=ko`));
  assert.match(createSenderEmail(boop), /지수<\/strong>님에게 부프를 보냈습니다!/);
  assert.equal(emailText('ko', 'Verify your boop to {name}', { name: '지수' }), '지수님에게 보낼 부프를 확인해 주세요');
});

test('old tokens and unsupported email locales keep English emails', () => {
  const old = { ...boop, locale: undefined };
  assert.match(createVerificationEmail(old, 'https://example.com/verify'), /lang="en"/);
  assert.match(createSenderEmail(old), /Your Boop was sent!/);
  assert.match(createRecipientEmail({ ...old, locale: 'fr' }), /You got a Boop!/);
  assert.equal(normalizeEmailLanguage('ko-KR'), 'ko');
  assert.equal(normalizeEmailLanguage('kok'), 'en');
});

test('Korean email links retain both the token and a language hint', () => {
  for (const platform of ['ios', 'web']) {
    const url = new URL(createVerificationUrl('https://sendaboop.app', 'token+value', platform, 'ko'));
    assert.equal(url.searchParams.get('token'), 'token+value');
    assert.equal(url.searchParams.get('lang'), 'ko');
    assert.equal(url.pathname, platform === 'ios' ? '/app-verify' : '/verify');
  }
});
