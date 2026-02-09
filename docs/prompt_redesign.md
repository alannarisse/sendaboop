# History of Design Prompts given to Claude

## to do after the email verification is set
Create a dark mode. Add a toggle that turns the screen to a dark mode design. The toggle should live in the top nav to the right of 'Contact'.

Create a design system once I created the dark mode.

## 2/9
Updated playwright test scripts

removed italic fonts from _layout.tsx
'QuattrocentoSans-Italic': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-Italic.ttf'),
'QuattrocentoSans-BoldItalic': require('@/assets/fonts/Quattrocento_Sans/QuattrocentoSans-BoldItalic.ttf'),

Added PWA icons 

iOS: Tap Share → "Add to Home Screen"
Android: Tap the menu → "Add to Home Screen" (or they may get an automatic prompt)

## 2/8
Instead of sending the email straight from tyhe website, I would like to send the sender a verification email. That verification email would have a link in it that would verify the sender is using a real email that they have access to. When they click the link, it would send their boop to their friend and send their email that confirms their boop was sent.


Todo List Update:
✅ Add dependencies to server (jose, express-rate-limit)
✅ Update /server/api.ts with verification endpoints and email template
✅ Add verifyBoop() to /lib/api.ts
✅ Create /app/verify.tsx verification page
🔄 Update /app/success.tsx for pending state
⏳ Update /app/index.tsx navigation params
⏳ Test full flow locally
⏳ Deploy to production



## Files to Modify

### 1. `/server/api.ts` - Backend API

**Changes:**
- Add `jose` package for JWT signing/verification
- Add `express-rate-limit` for abuse prevention
- Create `createVerificationToken()` function
- Create `createVerificationEmail()` template function
- Modify `POST /api/send-boop`:
- Generate signed JWT with boop data
- Send verification email to sender (not the boop yet)
- Return `{ success: true, pendingVerification: true }`
- Add `GET /api/verify-boop/:token`:
- Verify JWT signature and expiration
- Check token hasn't been used (in-memory Set)
- Send boop email to recipient
- Send confirmation email to sender
- Mark token as used
- Return success/error response

### 2. `/lib/api.ts` - Frontend API Client

**Add new function:**
```typescript
export async function verifyBoop(token: string): Promise<{
success: boolean;
recipientName?: string;
dogId?: string;
error?: string;
}>;
```

### 3. `/app/verify.tsx` - New Verification Page

**Create new page with three states:**
- **Loading**: Spinner + "Verifying your boop..."
- **Success**: Heart icon, "Boop Sent!", dog image, "Send Another Boop" button
- **Error**: Error message based on type (expired/used/invalid), "Try Again" button

**Styling:** Match existing app design (gradient background, Quattrocento fonts, coral accents)

### 4. `/app/success.tsx` - Update Success Page

**Add conditional UI:**
- If `pending=true` param: Show "Check Your Email!" with instructions
- If no pending param: Show existing "Boop Sent!" confirmation (for after verification)

### 5. `/app/index.tsx` - Update Form Submission

**Change navigation params:**
```typescript
router.push({
pathname: '/success',
params: {
recipientName: formData.recipientName,
dogId: selectedDog.id,
pending: 'true',
senderEmail: formData.senderEmail,
},
});
```

---

## New Email Template: Verification Email

**To:** Sender's email
**Subject:** `Verify your boop to {recipientName}`

**Content:**
- Greeting with sender's name
- Preview of dog image they're sending
- "Send This Boop!" button with verification link
- Note that link expires in 24 hours
- Footer: "Didn't request this? Ignore this email."

---

## Security Measures

1. **JWT Signing**: HS256 prevents token tampering
2. **Token Expiration**: 24 hours
3. **Single Use**: Token IDs tracked to prevent reuse
4. **Rate Limiting**:
- `/api/send-boop`: 10 requests per 15 minutes per IP
- `/api/verify-boop`: 20 requests per minute per IP

---

## Dependencies to Add

**Server (`/server/package.json`):**
```json
{
"jose": "^5.2.0",
"express-rate-limit": "^7.1.0"
}
```

---

## Implementation Order

1. Add dependencies to server
2. Update `/server/api.ts` with new endpoints and email template
3. Add `verifyBoop()` to `/lib/api.ts`
4. Create `/app/verify.tsx` page
5. Update `/app/success.tsx` for pending state
6. Update `/app/index.tsx` navigation
7. Test full flow locally
8. Deploy to production

---

## Verification

**Test locally:**
1. Start server: `cd server && npm run dev`
2. Start app: `npx expo start --web`
3. Fill form and submit
4. Check that success page shows "Check your email"
5. Check server logs for verification email content (or use real email)
6. Copy verification link and open in browser
7. Verify boop is sent and confirmation shown

**Test edge cases:**
- Expired token (wait 24h or manually set short expiration)
- Reused token (click same link twice)
- Invalid/tampered token
- Rate limiting (rapid requests)
" onclick="toggleExpand(this)">collapse


# Email Verification Implementation Plan

## Overview

Add sender email verification to Send a Boop. Instead of sending boops immediately, senders must first verify their email by clicking a link. This prevents spam and ensures senders have access to the email they provide.

## New User Flow

1. User fills form and clicks "Send Boop"
2. Verification email sent to **sender** with unique link
3. Success page shows "Check your email!" message
4. Sender clicks verification link in email
5. Verification page loads, validates token, and:
- Sends actual boop to recipient
- Sends confirmation email to sender
6. Verification page shows "Boop Sent!" confirmation

## Technical Approach

### Storage: Signed JWT Tokens

Use **signed JWT tokens** that encode all boop data directly in the token. No database needed.

- Token contains: dog info, sender/recipient details, message, expiration, unique ID
- Signed with HS256 to prevent tampering
- 24-hour expiration built into token
- Used token IDs stored in-memory Map (can upgrade to Vercel KV later for persistence)

**Why JWT over database:**
- No new infrastructure needed
- Stateless verification
- All data travels with the token
- Simple to implement

### New Environment Variable

```
JWT_SECRET=
```

---

## Files to Modify

### 1. `/server/api.ts` - Backend API

**Changes:**
- Add `jose` package for JWT signing/verification
- Add `express-rate-limit` for abuse prevention
- Create `createVerificationToken()` function
- Create `createVerificationEmail()` template function
- Modify `POST /api/send-boop`:
- Generate signed JWT with boop data
- Send verification email to sender (not the boop yet)
- Return `{ success: true, pendingVerification: true }`
- Add `GET /api/verify-boop/:token`:
- Verify JWT signature and expiration
- Check token hasn't been used (in-memory Set)
- Send boop email to recipient
- Send confirmation email to sender
- Mark token as used
- Return success/error response

### 2. `/lib/api.ts` - Frontend API Client

**Add new function:**
```typescript
export async function verifyBoop(token: string): Promise<{
success: boolean;
recipientName?: string;
dogId?: string;
error?: string;
}>;
```

### 3. `/app/verify.tsx` - New Verification Page

**Create new page with three states:**
- **Loading**: Spinner + "Verifying your boop..."
- **Success**: Heart icon, "Boop Sent!", dog image, "Send Another Boop" button
- **Error**: Error message based on type (expired/used/invalid), "Try Again" button

**Styling:** Match existing app design (gradient background, Quattrocento fonts, coral accents)

### 4. `/app/success.tsx` - Update Success Page

**Add conditional UI:**
- If `pending=true` param: Show "Check Your Email!" with instructions
- If no pending param: Show existing "Boop Sent!" confirmation (for after verification)

### 5. `/app/index.tsx` - Update Form Submission

**Change navigation params:**
```typescript
router.push({
pathname: '/success',
params: {
recipientName: formData.recipientName,
dogId: selectedDog.id,
pending: 'true',
senderEmail: formData.senderEmail,
},
});
```

---

## New Email Template: Verification Email

**To:** Sender's email
**Subject:** `Verify your boop to {recipientName}`

**Content:**
- Greeting with sender's name
- Preview of dog image they're sending
- "Send This Boop!" button with verification link
- Note that link expires in 24 hours
- Footer: "Didn't request this? Ignore this email."

---

## Security Measures

1. **JWT Signing**: HS256 prevents token tampering
2. **Token Expiration**: 24 hours
3. **Single Use**: Token IDs tracked to prevent reuse
4. **Rate Limiting**:
- `/api/send-boop`: 10 requests per 15 minutes per IP
- `/api/verify-boop`: 20 requests per minute per IP

---

## Dependencies to Add

**Server (`/server/package.json`):**
```json
{
"jose": "^5.2.0",
"express-rate-limit": "^7.1.0"
}
```

---

## Implementation Order

1. Add dependencies to server
2. Update `/server/api.ts` with new endpoints and email template
3. Add `verifyBoop()` to `/lib/api.ts`
4. Create `/app/verify.tsx` page
5. Update `/app/success.tsx` for pending state
6. Update `/app/index.tsx` navigation
7. Test full flow locally
8. Deploy to production

---

## Verification

**Test locally:**
1. Start server: `cd server && npm run dev`
2. Start app: `npx expo start --web`
3. Fill form and submit
4. Check that success page shows "Check your email"
5. Check server logs for verification email content (or use real email)
6. Copy verification link and open in browser
7. Verify boop is sent and confirmation shown

**Test edge cases:**
- Expired token (wait 24h or manually set short expiration)
- Reused token (click same link twice)
- Invalid/tampered token
- Rate limiting (rapid requests)






-==--------------
## Add sass and convert css to scss √
note: just refactored to keep ios and android compat.

https://dev.to/gihanrangana/how-to-use-a-sassscss-with-expo-sdk-v48-and-typescript-3nef

I would like convert the css to scss using sass and to refactor the styles to live mostly in separate scss files that get compiled into one global css file. 

NOTE! Claude Code Chat plugin in vs code doesn't work with AskUserQuestion

Claude gave me options based on what would work on ios and android. I decided reactnative but refactored would be best. claudes response when I ran out of tokens:

claude:
"This is a significant architectural change for an Expo/React Native project. I need to clarify something important before proceeding.


React Native uses the StyleSheet.create() API which is fundamentally different from CSS/SCSS. The styles in this project aren't CSS - they're JavaScript objects that React Native converts to native styling on iOS/Android/Web.


Converting to SCSS would only work for the web platform, and would require a different approach for native platforms.


Before I plan this out, I have a few questions:


I'll refactor the styles to use a central theme file with shared design tokens while keeping the React Native StyleSheet approach. This will make the styles more maintainable and consistent across components.

Todo List Update:
🔄 Create theme.ts with colors, typography, spacing, and common styles
⏳ Refactor Nav component to use theme
⏳ Refactor Header component to use theme
⏳ Refactor BoopForm component to use theme
⏳ Refactor DogSelector component to use theme
⏳ Refactor page components to use theme
"
----------------


## Complerted 2/7/26

Please move the top navigation bar which includes DogLogo, about and contact to it's own component called Nav.tsx. I would like the hero container to scroll with the form, but the nav bar to stay fixed to the top. I have also changed the code so that the DogLogo is on every page. Can you clean up my code changes?
----------------
Create a tool tip that appears when the user hovers over a sendButton that is greyed out that says "There's some missing info. Make sure you've selected a dog and filled out the name and email fields. Once the form is filled out correctly, this button will be clickable."
----------------
On both the BoopForm and the contact page, append the labels of all required fields with an '*' that is this color: #f87171.
----------------
On all pages, including the homepage, add a thin menu bar at the top with the about and contact links.
----------------
On the about page, in the "Who am I?" section, Add this photo above the text: assets/images/general/bio-pic.jpeg. Style it with rounded corners the same radius as the dog pics.
----------------
On the BoopPreview page, add this image: assets/images/general/support_me_on_kofi_beige.png' below the words : "Appreciate this app? Leave a tip at Ko-fi!"  Add a link to the button that also goes to 'https://ko-fi.com/alannarisse'. Keep the existing link in the text as well.
----------------
In a new section at the bottom of the about page, add the words:  "Appreciate this app? Leave a tip at Ko-fi!" and underneath it add this image: 'assets/images/general/support_me_on_kofi_beige.png' both the words "Leave a tip at Ko-fi!" and the image should link to 'https://ko-fi.com/alannarisse'. The alt text for the image should say "Support Alanna on Ko-fi".  

----------------

## Completed 2/6/26

Use the attached screenshot as the basis for a UI redesign.
Redesign the application's **visual style, layout, spacing, and component expression** to match the **theme and design language** shown in the image. The heart icon on the image will replace the checkmark in the current design and can be animated when clicked. 

**Important constraints**
* Presenve the application's **existing structure, hierarchy, and functionality** - how the app works should remain the same. 

* Focus on **UI and interaction design**, not new features or workflows.

* Any imagery, illustrations, photos, or complex visual assets in the screenshot may be ** approximated, simplified, or ignored** if source assets are unavailable.

The goal is to re-theme the application as closely as possible to the provided design **using realistic, buildable UI components**, while maintaining usability and clarity.