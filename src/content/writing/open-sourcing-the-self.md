---
title: "Open-Sourcing the Self"
dek: "A structured record of how a mind works is more useful to strangers than another post about what it concluded."
date: 2026-09-05
category: "Systems"
readingTime: "6 min"
pullQuote: "A blog stores conclusions. A commit history lets someone rerun the experiment and find out you were wrong."
source: "Adapted from a project vision document and the rules I wrote for a long-running assistant, September 2026"
---

Every time I walk away from a project, a working setup gets erased. Not the file — the file survives. What disappears is the reasoning behind each choice: why this library and not that one, why I rejected the obvious architecture, which mistake cost time. I have built enough assistants to know they wake up blank unless I hand them the reasoning first. So I hand it to them, in files. Identity, constraints, voice, the things I refuse to do.

Those files are, in effect, me. They are also messier than anything I would ever post.

Most publishing records outcomes. A person writes up the finished thing, polishes it, and files it under the date they got it right. The process — the part where you change your mind three times, contradict yesterday's self, abandon a line of thought halfway — stays private. This is a reasonable deal for the author and a bad one for anyone trying to learn from them. You get a conclusion with its scaffolding stripped out.

The alternative is to publish the scaffolding: not what I think, but the shape of the machine that does the thinking. Constraints, decision log, rejected options, open contradictions.

## Why Open Source, Not Blog

"Blog" is the wrong word because a blog is a feed. It rewards frequency, recency, the hot take. "Wiki" is closer, but a wiki pretends toward a finished reference page — neutral, assembled after the fact. Neither holds the part I care about, which is the diff.

Open source is the better metaphor for three specific reasons. It is structured, so the same record can be queried by a stranger, a search engine, or a scripted assistant without a human walking them through it. It has version history, so the change is as visible as the state. And it has an explicit license — a boundary that is stated up front rather than discovered by accident.

The vision document I wrote for this project called it something grander than a wiki. The grand version claimed that if everyone published their internal structure, misunderstanding between people would dissolve and civilization would stop repeating itself. I still think the direction is right. I no longer believe the size of the claim. One person publishing their method does not fix how strangers read each other. It gives a few of them a working example, and a way to correct me in public, which is more than any essay does.

## The Boundary

Open source does not mean everything in the repository is public. It means the method is public and the history behind it is scoped by an explicit decision.

The rule I settled on is simple to state and hard to keep: open the method, keep certain material closed. The files that shape how I work — how to be useful without being a sycophant, how to search, how to disagree, how to keep a decision without re-litigating it — belong on the record. Anyone reading them can rebuild the same constraints and measure their own work against them. That is the point of a license.

Things that stay private: anything that only matters to people who live in a specific place and house, anything that would hurt someone who did not get a vote, anything I am still inside of and cannot yet describe from the outside. The test is not whether there is a dramatic reason to hide it. The test is whether publishing it changes the record of a decision I already made, or just turns a wound into public property.

## The Strongest Objection

A self optimized for legibility can become a performance. This is the bug in the whole idea and I do not have a clean fix for it.

If the measure of a record is whether outside systems can parse it, then the person writing it learns, fast, to write for the parser. The messier parts of a mind — the detours, the things you are not proud of, the arguments you lose to yourself and forget by morning — do not have a slot. They get smoothed. And a smoothed account of how a person thinks is worse than no account, because it looks complete.

I have noticed myself reaching for the version of a position that would read well, while the genuinely held-but-unpopular version quietly backs out of the room.

The fix is not to keep the record "authentic," which is its own brand of performance. The fix is narrower: keep the failures in. Log the abandoned ideas next to the live ones. Make "I do not know yet" an allowed state in the schema rather than a blank left to be filled with prose.

That is all this is. It does not outlast anything. It keeps a handful of decisions where someone can find them, and it keeps me honest enough to notice when the record stops matching the person writing it.
