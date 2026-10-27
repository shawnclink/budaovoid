---
title: "Open-Source Self: A Memory System That Learns Me"
kicker: "I have been handing an AI files about myself so it stops starting from zero."
dek: "A private git repository holding a profile, a memory folder, and agent skills turns each new session into continuity instead of a reset."
period: "2026–"
category: "Agent tooling"
stack: ["Obsidian", "Markdown", "Git", "Claude Code", "Python"]
status: "Ongoing"
featured: true
order: 3
---

Every conversation with an AI assistant used to start the same way: me explaining who I was, what I was working on, how I wanted the answer to sound. A week later I explained again and got slightly different help. The work was not the problem. The reset was.

My thinking about myself also lived in two places that never touched. Long transcripts where I had worked out what I believed, and the daily drudgery of files and half-built projects. Nothing connected them, and the transcripts only existed because some platform had kept them.

## What I Built

On 2026-07-06 I made a private git repository and called it Open-Source Self. The name is a promise, not a description. Nothing in it is served over the network. It is a file tree under version control, and the version control is the point. Every change has a date and a diff. I can open any file and see what I believed in July and what I believe now.

The material inside it falls into a few kinds:

- A personal profile, written to be read by a machine: my background, the frames I actually use, how I learn. Consolidated on 2026-08-14, so the current version supersedes the first commit.
- A memory directory, one small Markdown file per durable fact. When something I said got promoted to a rule, the reason travelled with it.
- A skills directory, dozens of folders, each a set of instructions an agent can load. Some I wrote; some I installed. Fund data, research routing, IELTS, news, web access, text cleanup. The heavy ones are domain tools. The interesting ones are small and opinionated: how to review a skill after it fails, how to keep a correction from becoming a rule.
- An archive of my own history. At the time I archived it: sixty-three Claude Code sessions, roughly 104 MB, plus thirty-five Telegram notes I sent myself. I saved it because I had no other copy.

The flow runs one way. Raw conversations go in, a structured profile comes out, the profile and memory files compile into context at session start, and the session produces new raw material: writing, a new skill, a correction to the profile. The loop is the artifact. Any single file is disposable relative to it.

## How It Actually Works

The profile is plain Markdown with numbered sections. Section four is the project list, seven is how I want to be talked to, nine is a timeline. Not elegant, and deliberate. An agent reads top to bottom and knows where to look.

Loading happens in two tiers. The profile is read at session start as background. The memory files are optional. An entry that says "when writing for the public site, keep the anonymous handle" is short, dated, and carries its own reason. The reason is the part that survives. Rules without reasons get applied to the wrong case.

The working files are local. The Obsidian vault sits in iCloud, which is a sync service I accept as a tradeoff. The repository is on disk. A profile this dense is the most sensitive document I own, and I do not hand it to a new service without a reason.

Output is selective. In mid-August I started a public site under the handle buDaoVoid. It publishes method and selected writing. The profile, the memory directory, the raw transcripts, and accounts of other people's lives all stay in.

## What Broke

The first failure was the map replacing the territory. A profile that describes how I think is easier to update than how I actually think is to change. I edited the description and felt it was progress. The profile drifted into being a theory of myself, and for a while the theory outran the person. The profile is a cache now. When it disagrees with a conversation, the conversation wins.

The second was self-surveillance. Keeping a dated folder of every preference, including the ones I am not proud of, changes what I write in it. I caught myself shaping a preference to look good in the file. I have no full fix. I write faster now and accept that some of it will be ugly.

The third was the profile becoming a persona. An assistant reading the same summary of me for weeks starts repeating the summary back. One reply sounded less like help and more like an imitation of my own vocabulary. The instruction I keep giving is: challenge the description, do not perform it.

The fourth was retrieval flattering the record. Searching my history for a decision I half remember, I find the confident sentence where I was right. The hedging came two turns later and did not get indexed. A searchable past can become a machine for confirming what I already wanted.

The fifth is unresolved. The profile describes real people, sometimes in enough detail to be recognized. Writing about a conversation with someone who never agreed to be written about is a question the system has no answer for. My rule is boring: describe what happened, cut anything that would let a stranger follow the thread back. I do not always follow it.

## Limits

The system does not make me remember better. It makes it cheaper for an assistant to be told. I still restart projects and explain the same thing twice to an assistant that did not read the file. The repository is a hand-off format, not memory.

Most of the transcripts sit unindexed. A scanner I ran once to pull philosophical material matched skill documentation and other people's text by mistake. Sorting that out was the real work, so it sits there.

There is also a version problem. The profile is written for the tools I have now. If the models change, parts of it may be tuned for one that no longer exists. I have no plan for that beyond rereading it every few months.

## The Boundary

Most of the archive was not written for an audience. It was written to be useful to one assistant in one moment, and that moment is gone. Publishing it would turn it into a performance competing with the history itself.

So the method goes public, along with the writing I finish. The rest stays in a folder on a laptop.
