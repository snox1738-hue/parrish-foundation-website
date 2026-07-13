#!/usr/bin/env bash
# Parrish Foundation website auto-deploy daemon.
# Runs every 30s via launchd (com.parrish.autodeploy).
# If the working tree is dirty -> commit everything. Then push.
# A push to GitHub triggers Netlify's build automatically, so any change
# made here is live within ~a minute, no manual step.
set -uo pipefail

REPO="/Users/clawbot/Projects/command-center/PARRISH FOUNDATION WEBSITE"
cd "$REPO" || exit 0

# nothing to do if not a git repo
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# 1) commit any uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -q -m "auto-deploy $(date '+%Y-%m-%d %H:%M:%S')" \
    -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" || true
fi

# 2) push if we're ahead of the remote (covers both fresh commits and
#    any earlier commit that never got pushed)
LOCAL="$(git rev-parse @ 2>/dev/null)"
REMOTE="$(git rev-parse @{u} 2>/dev/null || echo none)"
if [ "$LOCAL" != "$REMOTE" ]; then
  # the remote can gain commits we don't have (e.g. GitHub writes CNAME
  # commits when Pages domain settings change) — integrate them first or
  # every push silently bounces forever
  git pull --rebase -q origin main || true
  git push -q origin main || true
fi
