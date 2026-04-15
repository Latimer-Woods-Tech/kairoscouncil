#!/bin/bash
set -e

echo "📄 Kairos' Council — Generate Documentation"

# TypeDoc for API reference
if command -v typedoc &> /dev/null; then
  echo "Generating API docs with TypeDoc..."
  typedoc --out docs/generated packages/shared/src/index.ts packages/astronomical-engine/src/index.ts packages/game-engine/src/index.ts 2>/dev/null || echo "TypeDoc generation skipped — no implementation code yet"
else
  echo "TypeDoc not installed. Run scripts/setup.sh first."
fi

echo "✅ Documentation generation complete"
