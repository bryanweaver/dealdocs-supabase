# Fixing Anvil CSP (Content Security Policy) Issues

Since the iframe works on your Windows computer but not on your Mac (both using Chrome), and `localhost:5173` is properly whitelisted in your Anvil account, this is likely a browser cache issue.

## Quick Fix Steps:

1. **Clear Chrome's CSP Cache:**
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Check "Disable cache" checkbox
   - Hard refresh the page (Cmd+Shift+R on Mac)

2. **Clear All Site Data:**
   - Open Chrome DevTools
   - Go to Application tab
   - Click "Clear site data" under Storage
   - Refresh the page

3. **Try Incognito Mode:**
   - Open an incognito window (Cmd+Shift+N)
   - Navigate to `http://localhost:5173`
   - Try generating and signing a contract

4. **Alternative: Force Reload with Cache Bypass:**
   ```bash
   # In Chrome, you can also:
   # 1. Open DevTools
   # 2. Right-click the refresh button
   # 3. Select "Empty Cache and Hard Reload"
   ```

## If the above doesn't work:

The app now has fallback options when CSP errors are detected:
- **Open in New Tab**: Opens the signing interface in a separate tab (works around CSP)
- **Copy Signing Link**: Copies the URL so you can paste it in another browser

## Technical Details:

The CSP error `Refused to frame 'https://app.useanvil.com/' because an ancestor violates the following Content Security Policy directive: "frame-ancestors 'none'"` means Chrome has cached a restrictive CSP header.

Your Anvil settings are correct with `http://localhost:5173` whitelisted. The issue is browser-specific caching on this Mac.