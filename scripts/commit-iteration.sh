#!/bin/bash
set -e

MSG="${1:-feat: iteration update}"

# Generate fresh API docs (if generator exists)
if command -v typedoc &> /dev/null && [[ -f "typedoc.json" ]]; then
  pnpm docs:generate 2>/dev/null || true
fi

# Stage everything including generated docs
git add -A

# Commit with generated docs included
git commit -m "$MSG

Auto-generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)
Session: ${SESSION_ID:-unknown}"

# Push
git push origin HEAD

echo "✅ Committed and pushed"
