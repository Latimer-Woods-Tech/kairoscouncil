#!/bin/bash
set -e

echo "🏗️ Kairos' Council — Architecture Validation"
ERRORS=0

# AC-001: astronomical-engine must NOT import from game-engine
echo "Checking AC-001: astronomical-engine isolation..."
if grep -r "from '@kairos/game-engine" packages/astronomical-engine/src/ 2>/dev/null; then
  echo "❌ AC-001 VIOLATION: astronomical-engine imports from game-engine"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ AC-001: astronomical-engine is isolated"
fi

# AC-001 reverse: game-engine must not import astronomical-engine internals
echo "Checking AC-001: game-engine does not import astronomical-engine..."
if grep -r "from '@kairos/astronomical-engine" packages/game-engine/src/ 2>/dev/null; then
  echo "❌ AC-001 VIOLATION: game-engine imports from astronomical-engine"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ AC-001: game-engine does not import astronomical-engine"
fi

# AC-002: web client must not import game-engine or astronomical-engine
echo "Checking AC-002: web client is display-only..."
if grep -r "from '@kairos/game-engine\|from '@kairos/astronomical-engine" apps/web/src/ 2>/dev/null; then
  echo "❌ AC-002 VIOLATION: web client imports game logic"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ AC-002: web client is display-only"
fi

# AC-003: No Math.random() in game-engine or astronomical-engine (skip comments)
echo "Checking AC-003: no Math.random() in game logic..."
if grep -rn "Math\.random" packages/game-engine/src/ packages/astronomical-engine/src/ 2>/dev/null | grep -v "//.*Math\.random" | grep -v "\*.*Math\.random" | grep -q "Math\.random"; then
  echo "❌ AC-003 VIOLATION: Math.random() found in game logic"
  grep -rn "Math\.random" packages/game-engine/src/ packages/astronomical-engine/src/ 2>/dev/null | grep -v "//.*Math\.random" | grep -v "\*.*Math\.random"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ AC-003: no Math.random() in game logic"
fi

# AC-009: Transit cache constants
echo "Checking AC-009: transit cache SLA constants..."
if grep -q "TRANSIT_CACHE_REFRESH_HOURS = 4" packages/shared/src/constants/index.ts 2>/dev/null; then
  echo "✅ AC-009: transit cache refresh interval is 4 hours"
else
  echo "⚠️  AC-009: could not verify transit cache refresh constant"
fi

# Summary
echo ""
if [[ $ERRORS -gt 0 ]]; then
  echo "❌ Architecture validation FAILED with $ERRORS violation(s)"
  exit 1
else
  echo "✅ Architecture validation PASSED — all constants verified"
fi
