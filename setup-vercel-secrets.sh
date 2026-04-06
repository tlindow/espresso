#!/usr/bin/env bash
set -euo pipefail

REPO="tlindow/espresso"
PROJECT_JSON=".vercel/project.json"

echo "=== Vercel Secrets Setup for $REPO ==="
echo ""

# Link project if .vercel/project.json doesn't exist
if [ ! -f "$PROJECT_JSON" ]; then
  echo "No $PROJECT_JSON found. Running 'vercel link'..."
  vercel link
  echo ""
fi

if [ ! -f "$PROJECT_JSON" ]; then
  echo "Error: $PROJECT_JSON still not found. Vercel link may have failed." >&2
  exit 1
fi

# Read org and project IDs from .vercel/project.json
VERCEL_ORG_ID=$(jq -r '.orgId' "$PROJECT_JSON")
VERCEL_PROJECT_ID=$(jq -r '.projectId' "$PROJECT_JSON")

if [ -z "$VERCEL_ORG_ID" ] || [ "$VERCEL_ORG_ID" = "null" ]; then
  echo "Error: Could not read orgId from $PROJECT_JSON" >&2
  exit 1
fi

if [ -z "$VERCEL_PROJECT_ID" ] || [ "$VERCEL_PROJECT_ID" = "null" ]; then
  echo "Error: Could not read projectId from $PROJECT_JSON" >&2
  exit 1
fi

echo "Read from $PROJECT_JSON:"
echo "  VERCEL_ORG_ID:     $VERCEL_ORG_ID"
echo "  VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo ""

# Get token from Vercel CLI config or prompt
VERCEL_TOKEN=""
VERCEL_AUTH="$HOME/.local/share/com.vercel.cli/auth.json"
if [ -f "$VERCEL_AUTH" ]; then
  VERCEL_TOKEN=$(jq -r '.token // empty' "$VERCEL_AUTH")
fi

if [ -z "$VERCEL_TOKEN" ]; then
  read -rp "Enter VERCEL_TOKEN (create one at https://vercel.com/account/tokens): " VERCEL_TOKEN
fi

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Error: No Vercel token provided." >&2
  exit 1
fi

echo ""
echo "Setting GitHub Actions secrets..."

gh secret set VERCEL_TOKEN --repo "$REPO" --body "$VERCEL_TOKEN"
gh secret set VERCEL_ORG_ID --repo "$REPO" --body "$VERCEL_ORG_ID"
gh secret set VERCEL_PROJECT_ID --repo "$REPO" --body "$VERCEL_PROJECT_ID"

echo ""
echo "Done! All 3 secrets have been set on $REPO."
