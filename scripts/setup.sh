#!/bin/bash
set -e

echo "🌌 Kairos' Council — Environment Setup"

# Node version manager
if ! command -v fnm &> /dev/null; then
  curl -fsSL https://fnm.vercel.app/install | bash
fi
fnm use --install-if-missing 20

# Package manager
npm install -g pnpm@latest

# Cloudflare
npm install -g wrangler@latest
echo "Wrangler version: $(wrangler --version)"

# Neon CLI
npm install -g neonctl@latest
echo "Neon CLI version: $(neonctl --version)"

# Stripe CLI
if [[ "$OSTYPE" == "darwin"* ]]; then
  brew install stripe/stripe-cli/stripe
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg > /dev/null
  echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee /etc/apt/sources.list.d/stripe.list
  sudo apt update && sudo apt install -y stripe
fi
echo "Stripe CLI version: $(stripe --version)"

# Turbo
npm install -g turbo@latest

# TypeScript
npm install -g typescript@latest tsx@latest

# Testing
npm install -g vitest@latest

# Documentation
npm install -g typedoc@latest

# Validation
echo "✅ All CLIs installed"
echo "Next: Run 'wrangler login' and 'neonctl auth' to authenticate"
