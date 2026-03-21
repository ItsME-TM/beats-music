# Seek Bar Debug Guide

## What I Added

I've added comprehensive logging to the SongPlayer component to help diagnose why the seek bar isn't working. All logs are prefixed with 🎯 for seek-related events and 🎵 for player events.

## How to Test

1. Open your browser's Developer Console (F12)
2. Play a song in the app
3. Try to interact with the seek bar (click, drag, or touch)
4. Watch the console logs

## What to Look For

### 1. **Is the seek bar disabled?**
Look for logs like:
```
🎯 SEEK MOUSEDOWN - Starting seek { disabled: true, ... }
```
If `disabled: true`, the seek bar won't work because either:
- `mediaSrc` is missing (no audio/video source)
- `playerReady` is false (player hasn't loaded yet)

### 2. **Are events firing?**
When you click/drag the seek bar, you should see:
```
🎯 SEEK MOUSEDOWN - Starting seek
🎯 SEEK ONCHANGE - Preview update
🎯 SEEK MOUSEUP - Committing seek
🎯 SEEKTO CALLED
```

If you don't see these, the input element might be blocked by CSS or another element.

### 3. **Is the player ready?**
Look for:
```
🎵 ReactPlayer READY { hasSeekTo: true }
```
If `hasSeekTo: false`, the player ref doesn't have the seekTo method.

### 4. **Is duration set correctly?**
Check:
```
🎵 ReactPlayer DURATION received { parsed: 180.5, ... }
```
If duration is 0 or 1, the seek bar range will be wrong.

### 5. **Is seeking actually working?**
After clicking the seek bar, look for:
```
✅ seek successful
```
or
```
❌ seek failed
```

## Common Issues & Fixes

### Issue 1: Seek bar is disabled
**Symptom:** Seek bar is grayed out and won't respond
**Fix:** Wait for the player to load. Check that `mediaSrc` is valid.

### Issue 2: Events not firing
**Symptom:** No logs when clicking seek bar
**Possible causes:**
- Another element is overlaying the seek bar (check z-index)
- CSS pointer-events is set to none
- Input is actually disabled

### Issue 3: Seek happens but playback doesn't change
**Symptom:** Logs show "✅ seek successful" but audio doesn't jump
**Possible causes:**
- ReactPlayer seekTo is not working for this media type
- YouTube player needs special handling
- Media source is streaming and doesn't support seeking

### Issue 4: Seek bar jumps back immediately
**Symptom:** You drag the seek bar but it snaps back
**Cause:** The `isSeekingRef` flag isn't preventing progress updates
**Check logs for:** "Ignoring progress update during seek"

## Next Steps

After reviewing the console logs, you'll know exactly where the problem is. Common fixes:

1. **If disabled:** Ensure media loads properly and playerReady becomes true
2. **If events don't fire:** Check CSS and DOM structure for overlays
3. **If seekTo fails:** May need to handle YouTube differently or check media format
4. **If duration is wrong:** Check the media source and onDuration callback

Let me know what you see in the console and I can help fix the specific issue!
