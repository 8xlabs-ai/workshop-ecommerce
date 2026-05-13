# ShopStream — Claude Code project memory

## Project rules — read me first

- Stack: Node.js 20 + Express + TypeScript, Angular 17 (standalone), Postgres 15, Redis 7.
- UI: Angular Material 17 (indigo-pink prebuilt theme). Migrated off custom `libs/ui/forms` in app consumers.
- Package manager: pnpm. Use `pnpm --filter <name>` for per-app commands.
- Backend layering: router → service → repository. No SQL outside repositories. No ORM.
- Validation: zod schemas in `<module>.schemas.ts`. Never read `req.body` directly.
- Frontend: standalone components, Reactive Forms, signals for state. No NgModules in new code.
- HTTP from Angular: always through `core/http/api.service.ts`.
- Feature flags: `featureFlags.isEnabled('name')` server-side, `*ffEnabled` directive on the client. Default new flags to OFF.
- Logging: pino via `req.log`. Never `console.log`. Never log request bodies (PII).
- Payments: `payx-sdk` tokenizes in the browser. The server only ever sees `tok_*`. Do not introduce any other payment library.
- Telemetry: wrap external calls in `withSpan(...)`. Reuse the OTel helpers in `lib/telemetry.ts`.
- Tests: Vitest (api), Karma + Jasmine (web), Playwright (e2e). Add tests in the same PR as the change.
- Conventional commits. PR title = `type(scope): subject`.

## Do not

- Introduce an ORM (Prisma, Drizzle, TypeORM).
- Add a new payment library.
- Touch `apps/api/src/modules/payments/payx-client.ts` without a security reviewer.
- Disable the feature flag check "just for testing".
- Log raw card data, raw tokens, or full request bodies.
- Add `console.log` or `any` to new code.

## Useful commands

- `pnpm dev` — run api + web together
- `pnpm --filter @shopstream/api test -- checkout` — focused backend tests
- `pnpm --filter @shopstream/web test --watch=false` — once-through frontend tests
- `pnpm e2e -- --grep guest` — focused e2e
- `pnpm --filter @shopstream/api db:migrate` — apply migrations

## Workshop notes

This repo is **brownfield by design**. The logged-in checkout path works today.
Your guest-checkout slice runs alongside it. Do not modify the logged-in path
unless a reviewer specifically asks you to.

The wall you are punching a door through is `apps/web/src/app/core/auth/auth.guard.ts`
and `apps/api/src/middleware/auth.ts`. Read both before prompting any change.

Feature flag for this work: `guest_checkout_enabled`. Default OFF.

---

# Behavioral guidelines

Reduce common LLM coding mistakes. Merge with project-specific instructions above.

**Tradeoff:** bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.
- Verify the *premise* of the request before solving it. Bug reports often mis-describe symptoms; confirm what's actually happening (state, logs, screenshot, repro) before changing code.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- No new dependencies for a one-off helper — write 10 lines instead.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass."
- "Fix the bug" → "Write a test that reproduces it, then make it pass."
- "Refactor X" → "Ensure tests pass before and after."
- "Build UI" → "Open it in a browser via chrome-devtools MCP and verify the golden path before reporting done."

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

# Tool usage (mandatory)

## Code search & navigation — use Serena MCP

**Serena is the IDE for this project.** Use it instead of grep/ripgrep/Read for ANY code-symbol operation in `apps/`, `libs/`, or `e2e/`.

When to use:
- Finding a class/function/method → `find_symbol(name_path="ClassName/methodName")`
- Tracing where a symbol is used → `find_referencing_symbols(symbol)`
- Understanding a file's structure → `get_symbols_overview(relative_path)`
- Regex/pattern search across the codebase → `search_for_pattern(substring_pattern, relative_path, restrict_search_to_code_files=true)`
- Reading a specific method's body → `find_symbol(..., include_body=True)` (read JUST the method, not the whole file)
- Renaming → `rename_symbol(symbol, new_name)`
- Deleting safely → `safe_delete_symbol(symbol)` (checks references first)
- Editing → `replace_symbol_body` for whole-method swaps, `replace_content` for line-level regex edits, `insert_after_symbol` / `insert_before_symbol` to add new methods.

Activate the project once per session: `activate_project("/path/to/scaffold")`.

Rules:
- ❌ Don't grep/ripgrep/Read for symbols when Serena can resolve them.
- ❌ Don't read whole files when you only need one method.
- ✅ Use `find_referencing_symbols` BEFORE renaming or deleting.
- ✅ Cache understanding via Serena memories (`write_memory` / `read_memory`).

## Semantic search — use Claude-context (vector DB)

When you need *concept-level* search (not exact-name), use claude-context. Right when:
- "Where is payment retry logic?" — concept, not a known symbol name.
- "Find similar checkout error handlers." — semantic, not lexical.
- "Anything related to feature flag rollout?" — fuzzy intent.

Workflow:
1. `mcp__claude-context__index_codebase` — index the repo once per session/branch.
2. `mcp__claude-context__search_code` — query by natural-language phrase or example snippet.
3. Drill into specific files with Serena `find_symbol`.

Heuristic:
- **Serena** = "I know the name, find the references."
- **Claude-context** = "I don't know the name, find the concept."

Don't run both for the same query. Pick one based on whether you have an exact identifier.

## Task tracking — use Beads (`bd`)

**When the user says "use tasks" or "track this", use Beads.** Never use TodoWrite / TaskCreate / markdown checklists for multi-step or cross-session work.

Core commands:
- `bd ready` — show unblocked work.
- `bd create --title="..." --type=task|bug|feature --priority=2` — new issue (priorities 0=critical … 4=backlog).
- `bd update <id> --status=in_progress` — claim it.
- `bd close <id> --reason="..."` — finish it, document outcome.
- `bd dep add <id> <depends-on>` — wire dependencies.
- `bd sync` — push beads state to git remote at session end.

Rules:
- Create the bead BEFORE writing code on a non-trivial change.
- Mark `in_progress` when starting; `close` immediately when done — don't batch.
- Use `bd close` reason field to record findings/root cause — future sessions read this.
- Run `bd sync` before saying "done".

## Browser verification — chrome-devtools MCP

For UI changes, don't claim done until you've opened the page in chrome-devtools MCP and verified:
- The golden path works.
- No new console errors.
- Screenshots match the requested design (compare visually).

Pattern:
1. `mcp__chrome-devtools__new_page` → http://localhost:4200/<route>
2. `take_snapshot` → grab element uids
3. `fill` / `click` to exercise the flow
4. `take_screenshot` to verify visually
5. `list_console_messages` (filter to error/warn) before declaring done

If you can't run the browser, say so explicitly — don't claim success.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, clarifying questions come *before* implementation rather than after mistakes, and Serena/Beads/chrome-devtools usage is the default — not an afterthought.
