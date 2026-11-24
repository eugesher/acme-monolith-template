#!/usr/bin/env bash
set -euo pipefail

mode="${1:-dev}"

if [[ "$mode" != "dev" && "$mode" != "debug" ]]; then
  echo "Usage: start-dev.sh [dev|debug]" >&2
  exit 1
fi

pids=()

cleanup() {
  for pid in "${pids[@]:-}"; do
    kill -- "-${pid}" 2>/dev/null || true
  done
}
trap cleanup EXIT INT TERM

for app in staff-app customer-app processor-app; do
  setsid yarn "start:${mode}:${app}" &
  pids+=("$!")
done

wait -n
