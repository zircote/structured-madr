#!/usr/bin/env bash
# PostToolUse(Write|Edit) advisory hook: when an ADR under the configured adrPath
# is written/edited, validate just that file against the MIF level in
# .github/config.yml and surface any non-conformance as a reminder.
#
# Advisory by default (warns, never blocks). Set MIF_HOOK_STRICT=1 to block.

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_input.path // ""')
[ -z "$file" ] && exit 0

# Resolve repo root (the dir holding the MIF config), walking up from the file.
# Support both the new (.github/config.yml) and legacy (.github/mif/config.yml) paths.
dir=$(cd "$(dirname "$file")" 2>/dev/null && pwd || echo "")
root=""; cfg=""
d="$dir"
while [ -n "$d" ] && [ "$d" != "/" ]; do
  if [ -f "$d/.github/config.yml" ]; then root="$d"; cfg="$d/.github/config.yml"; break; fi
  if [ -f "$d/.github/mif/config.yml" ]; then root="$d"; cfg="$d/.github/mif/config.yml"; break; fi
  d=$(dirname "$d")
done
[ -z "$root" ] && exit 0

adrPath=$(grep -E '^adrPath:' "$cfg" 2>/dev/null | sed 's/^adrPath:[[:space:]]*//; s/[[:space:]]*#.*$//; s/[[:space:]]*$//' | tr -d '"' )
adrPath="${adrPath:-docs/decisions}"
case "$file" in
  *"$adrPath"/*.md) : ;;   # an ADR under the configured path
  *) exit 0 ;;
esac

base=$(basename "$file")
# Pick a validator that actually exists: the installed plugin's copy
# (CLAUDE_PLUGIN_ROOT) when present, else this repo's new or legacy path. If none
# is found, this advisory hook stays silent rather than erroring.
validator=""
if [ -n "$CLAUDE_PLUGIN_ROOT" ] && [ -f "$CLAUDE_PLUGIN_ROOT/bin/mif-validate.js" ]; then
  validator="$CLAUDE_PLUGIN_ROOT/bin/mif-validate.js"
elif [ -f "$root/.github/bin/mif-validate.js" ]; then
  validator="$root/.github/bin/mif-validate.js"
elif [ -f "$root/.github/mif/bin/mif-validate.js" ]; then
  validator="$root/.github/mif/bin/mif-validate.js"
else
  exit 0
fi
out=$(cd "$root" && node "$validator" --config "$cfg" --path "$adrPath" --pattern "**/$base" 2>&1)
rc=$?
if [ "$rc" != "0" ]; then
  details=$(printf '%s' "$out" | grep -F '::error' | sed 's/.*:://' | head -3 | paste -sd'; ' -)
  reason="MIF conformance: ${base} does not yet project clean at the configured level — ${details}"
  # Build JSON with jq so quotes/newlines/backslashes in $reason are escaped.
  if [ "${MIF_HOOK_STRICT:-0}" = "1" ]; then
    jq -nc --arg r "$reason" '{decision:"block",reason:$r}'
  else
    jq -nc --arg r "$reason" '{systemMessage:$r}'
  fi
fi
exit 0
