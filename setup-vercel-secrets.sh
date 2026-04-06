#!/usr/bin/env bash
set -euo pipefail

REPO="tlindow/espresso"

echo "=== Vercel Secrets Setup for $REPO ==="
echo ""

read -rp "Enter VERCEL_TOKEN: " VERCEL_TOKEN
read -rp "Enter VERCEL_ORG_ID: " VERCEL_ORG_ID
read -rp "Enter VERCEL_PROJECT_ID: " VERCEL_PROJECT_ID

echo ""
echo "Setting GitHub Actions secrets..."

gh secret set VERCEL_TOKEN --repo "$REPO" --body "$VERCEL_TOKEN"
gh secret set VERCEL_ORG_ID --repo "$REPO" --body "$VERCEL_ORG_ID"
gh secret set VERCEL_PROJECT_ID --repo "$REPO" --body "$VERCEL_PROJECT_ID"

echo ""
echo "Done! All 3 secrets have been set on $REPO."
