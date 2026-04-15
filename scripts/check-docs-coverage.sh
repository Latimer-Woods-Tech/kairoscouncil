#!/bin/bash
set -e

echo "📄 Kairos' Council — JSDoc Coverage Check"

# Count exported functions
TOTAL=$(grep -rn "^export function\|^export async function\|^export const.*=.*=>" packages/*/src/ apps/*/src/ 2>/dev/null | wc -l)

# Count documented exports (JSDoc comment before export)
DOCUMENTED=$(grep -B1 "^export function\|^export async function\|^export const.*=.*=>" packages/*/src/ apps/*/src/ 2>/dev/null | grep -c "\*/" || true)

if [[ $TOTAL -eq 0 ]]; then
  echo "✅ No exported functions to document yet"
  exit 0
fi

COVERAGE=$((DOCUMENTED * 100 / TOTAL))
echo "JSDoc coverage: $DOCUMENTED/$TOTAL ($COVERAGE%)"

if [[ $COVERAGE -lt 90 ]]; then
  echo "❌ JSDoc coverage below 90% requirement"
  exit 1
else
  echo "✅ JSDoc coverage meets 90% requirement"
fi
