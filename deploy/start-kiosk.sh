#!/bin/bash
# Launches Chromium in kiosk mode pointing at the local Smart Order app.
# Put this in /usr/local/bin/start-kiosk.sh and make it executable.

APP_URL="${KIOSK_URL:-http://localhost}"

# Wait until the app is up
until curl -sf "$APP_URL" > /dev/null; do
  echo "Waiting for Smart Order to start..."
  sleep 2
done

# Chromium flags for kiosk / self-service terminal
exec chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-translate \
  --disable-features=TranslateUI \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-default-apps \
  --disable-extensions \
  --disable-sync \
  --touch-events=enabled \
  --enable-touch-drag-drop \
  "$APP_URL"
