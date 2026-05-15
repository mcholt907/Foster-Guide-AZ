---
name: pr
description: Build, commit, push, and open a PR with auto-merge. Use when the user asks to ship current changes, open a PR, or wraps up a feature ready for review.
---

# /pr - Build, commit, push, and open PR

1. Run `npm run build` and fix any TS errors before proceeding.
2. Review `git status` and `git diff`; group related changes into logical commits with conventional commit messages.
3. Push the branch with `git push -u origin HEAD`.
4. Open PR with `gh pr create --fill` and then `gh pr merge --auto --squash`.
5. Report the PR URL.
