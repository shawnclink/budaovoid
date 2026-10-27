---
title: "Fricless: Cutting Every Layer You Don't Need"
kicker: "A framework that audits the layers between a human and a goal, and removes the ones that only exist to be endured."
dek: "Paper has one layer. An iPad has four. A drain has a person wading into floodwater. The same question applies to all three."
period: "2026-07"
category: "Framework"
stack: ["Systems engineering", "Simplify theory", "Mutual aid", "Audit heuristics"]
status: "In progress"
featured: false
order: 6
---

## The Failure

I built a device that clears urban drains during floods without sending anyone into the water. The old system had a person in it, wading out in a storm to lift a grate by hand. The device replaces him with a sensor, a controller, and a motor — three layers doing the work of one person who should not have been there.

Once I saw that, I started counting layers everywhere. Paper needs a pen and your hand, and that is it. An iPad needs a screen, a digitizer, an operating system, and an app before your finger becomes a mark. Each layer fails somewhere, and each one translates your intent, losing a little.

We inherit layers and then defend them as if they were the work itself.

Fricless is my name for the audit. The claim is blunt: every unnecessary intermediate layer between a human and their goal is structural violence. A form that exists to satisfy a bureaucracy you cannot see. A checkout with four confirmation steps. These cost you time, attention, and a little of your trust that the goal is reachable at all.

## Three Origins

Three lines that were not talking:

The first is what I called Simplify Theory. Count the layers between a person and the result. Prefer the design with fewer. It is a count, not a taste. Fewer layers means fewer points of failure and fewer places for intent to leak.

The second is Qian Xuesen's systems engineering, applied to a life instead of a machine. His argument is that a system does not move because someone inside it tries hard. It moves because its inertia carries it. Applied to a person, this turns willpower into a second-rate strategy. System inertia beats conscious effort. You build the morning so the habit is the path of least resistance, rather than gritting your teeth every day. Fricless is that move applied outward: make friction impossible to meet.

The third is Kropotkin. In *Mutual Aid*, the organisms that thrive are the ones whose members cooperate with the least internal friction. Hierarchy and forced authority are not givens. They are layers somebody inserted, each a place where trust has to route through someone else. Strip them and cooperation becomes the default.

Three fields, one refrain: the extra layer is the problem.

## The Audit

The framework is one distinction, applied recursively. Ask of every layer whether it does work that cannot be done elsewhere.

A necessary structure carries a real function: a compiler you cannot remove, a check that stops an irreversible error. Those earn their place.

Unnecessary friction exists to be lived with: the approval step nobody can explain, the second email confirming the first. Those get cut.

The work is not the cutting. The work is telling them apart. That is where every version of this idea fails.

## What Broke

The audit is easy to state and hard to run, because the same layer can look like both at once. Some friction is load-bearing. Effort that forces you to sit with a problem long enough for it to make sense teaches you something a shortcut cannot. A wait before an answer builds a trust an instant answer spends. Difficulty that resists you is sometimes what makes the goal worth having.

Remove every layer and you can remove the thing you were reaching for. A relationship with no friction is not trust; it is absence of testing. A framework that says fewer layers, always, eventually hands back a goal you have forgotten how to want.

I do not have a clean fix. What I have is a sharper question. Friction is load-bearing when it produces something the destination cannot produce alone: understanding, trust, competence, a sense of having earned it. It is gratuitous when it produces only endurance. So the audit has to ask what each layer produces. That turns the framework from a count into a judgment, which is slower and less satisfying and probably correct.

The repository is honest about itself. Fricless is a manifesto and an early framework, not a shipped product. The scales in my notes — a skill, a search layer, a vertical product — are descriptions, not implementations. What exists is the thesis and the audit.

## Limits and Next

Three problems remain.

First, the framework cannot tell a layer that produces understanding from one that only produces delay without a model of what the user already knows. A beginner's friction is a master's friction. The same step that teaches one person insults another.

Second, a philosophy that calls every unnecessary layer violence has no stopping rule. "Unnecessary" is a claim about the whole system, and no one sees the whole system. Organizational scale is hardest, because the layers I want to remove are often the ones holding the thing together for people who cannot see the whole picture either.

Third, none of it has been tested against a real system end to end.

How I would test it: take a bounded workflow I can observe completely, small enough to see all the layers and large enough to have real ones. Map every step between the goal and the person, and write down what each one produces. Run it as an ablation: remove one layer, then measure what the user learns or trusts or can do afterward, and whether the task finished faster. Keep the layers whose removal makes the result worse.

If the audit keeps finding layers whose answer is "worse, but the goal is still reachable," I have found the boundary. If it keeps finding layers whose answer is "the user learns more and the task is the same," I have found what can be cut.

That is the test. It will probably show me I have been wrong about which friction is which. The framework survives on whether it can tell the difference.
