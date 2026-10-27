---
title: "Fund Dashboard: A Signal Is Not a Decision"
kicker: "I built a dashboard and learned it could manufacture confidence I did not have."
dek: "A Python collector pulls fund NAV from AKShare, computes more than twenty indicators, scores a small set of thematic funds, and renders them in Next.js."
period: "2026-06"
category: "Software"
stack: ["Next.js 15", "React 19", "TypeScript", "Recharts", "Python", "AKShare", "Pandas"]
status: "Shipped"
featured: true
order: 2
---

Chinese fund platforms already show daily NAV, returns, and holdings. What they did not give me was one consistent way to compare three thematic funds — optical modules, semiconductor equipment, global tech QDII. I was reading scattered pages and forming opinions that changed with whatever chart I opened last.

I put the first version online on 19 June 2026.

## What I Built

Next.js 15 with React 19 and TypeScript on the front, Recharts for sparklines. A Python collector calls AKShare, computes indicators, scores each fund, and writes a JSON file. The Next.js server reads that file at render time. No database; the JSON is the contract between the halves.

Three funds were hardcoded at first: 010238 for optical modules, 017811 for semiconductor equipment, and a global tech QDII. The current configuration has grown to seven funds. The frontend mirrors the codes and theme labels.

## How It Works

The collector runs each fund through a thread pool of three workers. For each it calls `ak.fund_open_fund_info_em` twice — once for cumulative NAV history, once for basic info — behind a retry wrapper with linear backoff, both wrapped in a file cache keyed by a hash of the request with a 24-hour TTL.

On the NAV series the indicator module computes moving averages at 5, 10, 20, 60, 120, and 200 days, MACD on EMA12 and EMA26, Wilder RSI over 14 periods, a 9-period KDJ, and the Weinstein stage. KDJ normally needs high, low, and close; a fund has one daily price, so NAV stands in for all three. The Weinstein stage check uses price against MA200 and the slope of MA200 to classify accumulation, advance, topping, or decline.

The scoring engine weighs three sub-scores: technical, valuation, and momentum, at 50, 35, and 15 percent. Technical points come from MA alignment, MACD state, RSI zone, Weinstein stage, and a KDJ bonus when J drops below zero. Valuation is the weak one. Funds carry no clean price-to-earnings number, so that score is built from momentum windows, a QDII bonus, and a fixed theme premium. Momentum checks whether 1m, 3m, and 6m returns point the same way, whether 1m is accelerating, and how far the fund sits below its year high. The composite maps to five labels: strong buy, buy, hold, reduce, sell.

A diff engine compares the current run against the most recent history snapshot, looking back up to seven days to skip weekends. It reports NAV change, score change, action flips, MA alignment changes, MACD crosses, stage transitions, and RSI zone migrations.

Auto-refresh is a small hook. Market open: poll every five minutes. Closed: every thirty. Market status is computed in Python from A-share hours and shipped in the JSON. The refresh button calls an API route that shells out to the collector through a child process, with a 120-second timeout.

A Telegram script reads the same snapshot, pulls recent headlines by theme keyword, and sends a daily summary.

## What Broke

Data-source fragility came first. AKShare wraps public endpoints, not a formal API. Column names move. Responses come back empty. A site update can change the schema. Retries and the cache absorb some of this; they do not fix a source that quietly changed shape, and the indicator math then runs on whatever survived the parser.

Stale NAV is the quiet bug. A closed market means the latest NAV is yesterday's. A page that says "updated 10:30" and means "collected at 10:30, data from yesterday" is not lying in the code, but it is lying in the reading.

Caching has its own trap. A 24-hour TTL is fine on a quiet Tuesday. On a day when I want to see the move, the cache hides the update and the diff engine compares the numbers to themselves. A skip-cache flag exists for that. It is a workaround, not a design.

Indicator overfitting stuck with me most. RSI is legitimate. MACD is legitimate. Once I assign weights and thresholds, though, I am not measuring the market, I am measuring my own assumptions. The theme premium in the valuation score — optical modules 10, semiconductor equipment 8, global tech 5 — is a preference I wrote down and fed back to myself as a number. The score looked rigorous because it had decimals and a 0-to-100 range. The weights were mine, chosen without out-of-sample testing.

## What I Learned

A signal is a number computed from the past. A decision involves position size, time horizon, cash flow, and conviction. The engine emits the first; I was consuming it as the second. A hold at 45 and a hold at 74 are the same label on the page and mean nothing without the rest of the decision.

A dashboard creates false confidence faster than it creates understanding. It compresses a slow judgment into a glanceable card — that is the point, and that is the failure mode. The equal-weight portfolio summary averages funds that are not equal in size in my actual holdings. The number on the hero card describes a portfolio I do not have.

## What I Would Rebuild

I would not start with indicators. I would start with a position ledger: what I hold, in what amounts, entered by hand. Without position data, every portfolio aggregate is fiction. I would drop the valuation sub-score and either pull real holdings for a bottom-up number or label the output as technical only. I would keep the diff engine; it reports change rather than judgment, which is the part I still trust. I would put the actual as-of date, not the collection time, loud on every card. And I would cut the indicator list to the ones I can defend in one sentence each.

The dashboard is a personal tool, not a product. The verdict I trust now is smaller: does the architecture survive a broken source, are the numbers dated, and am I reading a label instead of making a decision.
