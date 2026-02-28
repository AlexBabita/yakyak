# Gemini API setup for YakYak translations

The translator uses **Gemini 2.0 Flash** to turn “dev speak” into PM, QA, and designer language (and optional natural-language translation).

## What you need to share / set up

You **do not** paste the API key in chat or commit it to the repo. You only add it to your local env.

### 1. Get a Gemini API key

1. Open **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2. Sign in with your Google account.
3. Click **Get API key** (or **Create API key**), choose or create a project.
4. Copy the key (it starts with `AIza...`).

### 2. Add it to your env

In the project root, add to **`.env`** or **`.env.local`**:

```env
GEMINI_API_KEY=your_key_here
```

Replace `your_key_here` with the key you copied. Restart the dev server (`npm run dev`) after changing env.

### 3. That’s it

The app uses this key only on the **server** (in the `/api/translate` route). The key is never sent to the browser.

---

**Summary:** You only need to **create a Gemini API key** in Google AI Studio and set **`GEMINI_API_KEY`** in `.env` or `.env.local`. No need to share the key with anyone.
