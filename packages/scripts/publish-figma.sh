#!/usr/bin/env sh
# Publish @mcafee-eng/assemble to your organization's Figma-hosted private npm
# registry, so it can be used in a Figma Make kit.
#
# Prerequisite (one-time, done by a Figma org admin):
#   In Figma: Admin > Resources > npm registry
#     1. Manage scopes > add the @mcafee-eng scope
#     2. View configuration > copy the snippet into: packages/.npmrc.figma
#   That file is gitignored because it contains an auth token.
#
# npm ignores a workspace package's own .npmrc, so we pass the Figma config via
# --userconfig. With no root .npmrc present, nothing overrides it, and the
# @mcafee-eng scope resolves to the Figma registry (verified with --dry-run).
set -e

cd "$(dirname "$0")/../.." # -> repo root
FIGMA_NPMRC="$PWD/packages/.npmrc.figma"

if [ ! -f "$FIGMA_NPMRC" ]; then
  echo "Error: packages/.npmrc.figma not found."
  echo "In Figma: Admin > Resources > npm registry > Manage scopes (add @mcafee-eng),"
  echo "then View configuration and paste the snippet into packages/.npmrc.figma"
  exit 1
fi

# The package's prepublishOnly script runs the build automatically.
npm publish -w packages --userconfig "$FIGMA_NPMRC"
