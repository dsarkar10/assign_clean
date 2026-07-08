#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
echo -e "${CYAN}┌──────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│  Clear Energy — launching all services        │${NC}"
echo -e "${CYAN}└──────────────────────────────────────────────┘${NC}"
echo ""

if ! npx --yes json-server --version &>/dev/null; then
  echo -e "${YELLOW}⚠  json-server not found — installing once…${NC}"
fi

echo -e "${GREEN}▶  Mock API  →  http://localhost:4000${NC}"
echo -e "${GREEN}▶  Customer  →  scan QR or press 'w' in its pane${NC}"
echo -e "${GREEN}▶  Driver    →  scan QR or press 'w' in its pane${NC}"
echo -e "${GREEN}▶  Admin     →  scan QR or press 'w' in its pane${NC}"
echo ""
echo -e "Press ${YELLOW}Ctrl+C${NC} to stop all processes."
echo ""

npx --yes concurrently \
  --prefix-colors "cyan,green,yellow,magenta" \
  --names "API,CUSTOMER,DRIVER,ADMIN" \
  --prefix "[{name}]" \
  "npx json-server mock-api.json --port 4000" \
  "npm start --workspace=apps/customer -- --port 8081" \
  "npm start --workspace=apps/driver -- --port 8082" \
  "npm start --workspace=apps/admin-mobile -- --port 8083"
