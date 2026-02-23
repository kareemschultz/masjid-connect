# Task: Buddy Username/Phone Search + Profile Username Setting

## Goal
Allow users to find and add buddies by **@username** or **phone number**, not just email.
Also let users set/view their own username in Settings so others can find them.

## Context
- Better Auth's `username` plugin is already active in `lib/auth.ts` — it enforces uniqueness at DB level automatically
- `username` column already exists in the `user` table (DB migration already done)
- `phoneNumber` is already an additionalField in Better Auth config
- `/app/api/friends/route.ts` POST already handles `{ username }` and `{ phone }` lookups (backend is done)
- The frontend just needs to be updated to use these options

---

## Changes Required

### 1. `lib/auth-client.ts` — Add username plugin to client
Add `usernameClient` plugin so TypeScript knows about `authClient.updateUser({ username })`:

```ts
import { createAuthClient } from 'better-auth/react'
import { usernameClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  plugins: [usernameClient()],
})

export const { signIn, signOut, useSession } = authClient
```

If `usernameClient` import fails or causes issues, just keep the existing export but add `authClient` export too.

### 2. `app/api/user/profile/route.ts` — Return username in GET
Add `username` to the fields returned:

```ts
const { id, email, name, displayName, community, ramadanStart, asrMadhab, phoneNumber, username } = session.user as any
return Response.json({ id, email, name, displayName, community, ramadanStart, asrMadhab, phoneNumber, username })
```

### 3. `app/api/user/preferences/route.ts` — Handle username updates
Add `username` to the allowed update fields:

```ts
const { ramadanStart, asrMadhab, displayName, community, phoneNumber, username } = await request.json()
// ...existing fields...
if (username !== undefined) allowed.username = username
```

Note: Better Auth's username plugin validates uniqueness server-side when `updateUser` is called.

### 4. `app/explore/buddy/page.tsx` — Update "Add Buddy" modal

The modal currently only has an email input and calls `/api/friends/request` (wrong URL!).

**Fix 1:** Change API URL from `/api/friends/request` to `/api/friends`

**Fix 2:** Replace the single email input with a smart multi-mode input:

The modal should have:
- A type selector row with 3 pill buttons: `Email` | `@Username` | `Phone`
- One input field that changes placeholder/type based on selected mode
- Auto-detect on input: if starts with `@` → switch to Username mode; if only digits → switch to Phone mode
- The `addBuddy` function detects the mode and sends the right field to the API

Here's the updated modal content (keep all existing modal chrome/styling, just update the internals):

```tsx
// State additions needed at top of component:
const [addMode, setAddMode] = useState<'email' | 'username' | 'phone'>('email')
const [newBuddyInput, setNewBuddyInput] = useState('')

// Replace newBuddyEmail state with newBuddyInput + addMode

// Smart input change handler:
const handleBuddyInputChange = (val: string) => {
  setNewBuddyInput(val)
  // Auto-detect type
  if (val.startsWith('@')) setAddMode('username')
  else if (/^\+?[0-9\s]{4,}$/.test(val) && !val.includes('@')) setAddMode('phone')
}

// Updated addBuddy function:
const addBuddy = async () => {
  if (!newBuddyInput.trim()) return
  let body: Record<string, string> = {}
  const val = newBuddyInput.trim()
  if (addMode === 'username') {
    body = { username: val.replace(/^@/, '') }
  } else if (addMode === 'phone') {
    body = { phone: val }
  } else {
    body = { email: val }
  }
  try {
    const res = await fetch('/api/friends', {   // <-- Fixed URL!
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (res.ok) {
      showToast(`Request sent to ${data.addressee?.displayName || data.addressee?.name || val}`)
      setNewBuddyInput('')
      setAddMode('email')
      setShowAddModal(false)
      fetchBuddies()
    } else {
      showToast(data.error || 'Failed to send request')
    }
  } catch (e) {
    showToast('Error sending request')
  }
}
```

Modal body (replace the existing modal content inside `showAddModal && (`):
```tsx
<div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
  <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
  <div className="relative w-full max-w-sm rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15">
      <Users className="h-7 w-7 text-blue-400" />
    </div>
    <h3 className="text-center text-lg font-bold text-foreground">Add a Faith Buddy</h3>
    <p className="mt-1 text-center text-sm text-gray-400">Find them by email, @username, or phone</p>
    
    {/* Mode selector */}
    <div className="mt-4 flex gap-1 rounded-xl bg-gray-800 p-1">
      {(['email', 'username', 'phone'] as const).map(mode => (
        <button
          key={mode}
          onClick={() => { setAddMode(mode); setNewBuddyInput('') }}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
            addMode === mode
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-400 active:bg-gray-700'
          }`}
        >
          {mode === 'email' ? 'Email' : mode === 'username' ? '@Username' : 'Phone'}
        </button>
      ))}
    </div>
    
    <input
      type={addMode === 'email' ? 'email' : addMode === 'phone' ? 'tel' : 'text'}
      value={newBuddyInput}
      onChange={(e) => handleBuddyInputChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && addBuddy()}
      placeholder={
        addMode === 'email' ? 'friend@example.com'
        : addMode === 'username' ? '@their_username'
        : '+592 XXX XXXX'
      }
      className="mt-4 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3.5 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50"
    />
    
    {addMode === 'username' && (
      <p className="mt-2 text-[11px] text-gray-500 text-center">
        Ask your buddy to set their @username in Settings
      </p>
    )}
    {addMode === 'phone' && (
      <p className="mt-2 text-[11px] text-gray-500 text-center">
        Include country code, e.g. +592 for Guyana
      </p>
    )}
    
    <div className="mt-4 flex gap-3">
      <button onClick={() => { setShowAddModal(false); setNewBuddyInput(''); setAddMode('email') }}
        className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-medium text-gray-300">
        Cancel
      </button>
      <button onClick={addBuddy} disabled={!newBuddyInput.trim()}
        className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-medium text-white disabled:opacity-50">
        Send Request
      </button>
    </div>
  </div>
</div>
```

### 5. `app/settings/page.tsx` — Add username field in Account section

In the Account section (where the Google Sign-In / sign-out is), add a username input card BELOW the account card.

This should:
- Load the user's current username from `/api/user/profile` (GET)
- Show an input with `@` prefix visual indicator
- Save button that calls PATCH `/api/user/preferences` with `{ username: newValue }`
- Show success/error toast
- Note: only visible when user is signed in (`session?.user` exists)

Add these states:
```tsx
const [username, setUsername] = useState('')
const [usernameInput, setUsernameInput] = useState('')
const [usernameSaving, setUsernameSaving] = useState(false)
const [usernameMsg, setUsernameMsg] = useState('')
```

Load username alongside the session check (in the useEffect that fetches session):
```tsx
fetch('/api/user/profile', { credentials: 'include' })
  .then(r => r.ok ? r.json() : null)
  .then(data => {
    if (data?.username) {
      setUsername(data.username)
      setUsernameInput(data.username)
    }
  })
  .catch(() => {})
```

Save handler:
```tsx
const saveUsername = async () => {
  if (!usernameInput.trim()) return
  const val = usernameInput.trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '')
  setUsernameSaving(true)
  setUsernameMsg('')
  try {
    const res = await fetch('/api/user/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: val })
    })
    const data = await res.json()
    if (res.ok) {
      setUsername(val)
      setUsernameInput(val)
      setUsernameMsg('Username saved!')
    } else {
      setUsernameMsg(data.error || 'Failed to save')
    }
  } catch {
    setUsernameMsg('Error saving username')
  } finally {
    setUsernameSaving(false)
    setTimeout(() => setUsernameMsg(''), 3000)
  }
}
```

Add the username card in the Account section (after the account card, before prayer settings), only shown when `session?.user`:
```tsx
{session?.user && (
  <SettingGroup label="Your Profile Handle" accentColor="bg-blue-500">
    <div className="p-4 space-y-3">
      <p className="text-xs text-gray-400">
        Set a @username so Faith Buddies can find you without needing your email.
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-400">@</span>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value.replace(/[^a-z0-9_]/gi, '').toLowerCase())}
            placeholder="your_username"
            maxLength={30}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 pl-7 pr-4 py-3 text-sm text-foreground placeholder-gray-500 outline-none focus:border-blue-500/50"
          />
        </div>
        <button
          onClick={saveUsername}
          disabled={usernameSaving || !usernameInput.trim() || usernameInput === username}
          className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {usernameSaving ? '...' : 'Save'}
        </button>
      </div>
      {usernameMsg && (
        <p className={`text-xs ${usernameMsg.includes('saved') ? 'text-emerald-400' : 'text-red-400'}`}>
          {usernameMsg}
        </p>
      )}
      {username && (
        <p className="text-[11px] text-gray-500">
          Others can find you by searching <span className="text-blue-400 font-medium">@{username}</span> in the buddy search.
        </p>
      )}
    </div>
  </SettingGroup>
)}
```

---

## Important Notes
- The `username` Better Auth plugin enforces uniqueness at the DB level — if someone tries to save a taken username, `updateUser` will throw an error. The catch block handles this.
- Sanitize username to lowercase alphanumeric + underscore only (no spaces, no special chars)
- The phone lookup in the API auto-prefixes 592 for 7-digit Guyanese numbers
- Do NOT touch anything else — prayer settings, Quran settings, notification settings, etc. are untouched

## After All Changes
1. Run `npm run build` in the project root — fix any TypeScript errors
2. If build passes, rebuild Docker container:
```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest .
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod
docker run -d --name kt-masjidconnect-prod --restart always \
  --network pangolin --ip 172.20.0.24 \
  --env-file .env.local \
  ghcr.io/kareemschultz/v0-masjid-connect-gy:latest
docker network connect kt-net-apps kt-masjidconnect-prod
docker network connect kt-net-databases kt-masjidconnect-prod
```
3. Verify container is healthy: `docker ps | grep masjidconnect`
4. Commit all changes: `git add -A && git commit -m "feat: buddy username/phone search + profile username setting"`
5. Run this to notify when done:
   openclaw --profile alfred system event --text "Done: Buddy username/phone search + Settings username save built and deployed" --mode now
