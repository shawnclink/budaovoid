---
title: "College Advisor: Selection Without a Ranking"
kicker: "A ranking picks a school for you; I wanted the resources to pick it against."
dek: "A Claude Code skill that builds reach/match/safety lists for mainland-Chinese engineering applicants by weighting employment and entrepreneurship over rank."
period: "2026-06"
category: "Agent tooling"
stack: ["Claude Code Skill", "Markdown", "WebFetch", "Common Data Set"]
status: "Shipped"
featured: false
order: 7
---

The failure I was reacting to is simple. A mainland-Chinese student applying to U.S. engineering programs opens a ranking table, sorts by number, picks the top eight names inside their score band, and submits. The table does not know whether there is a semiconductor cluster within an hour of the campus, whether the engineering school runs a co-op program, whether the startup incubator will still be open when the student arrives, or whether the applicant qualifies for the international transfer path that would have cost half as much. It knows the ordering of a magazine.

I started building this on 2026-06-24. It is a Claude Code skill rather than an app. That choice matters for what it can be honest about, which I will come back to.

## What I Built

The skill is a `SKILL.md` file plus a small config folder, installed under `~/.claude/skills/`. It is a prompt contract: a fixed set of questions the agent must ask, a fixed set of sources it must read, a weight for each source class, and a fixed output template. Most of its design work went into the ordering of the questions, not the answers.

It covers traditional engineering and the cross-disciplines around it: computer engineering, electrical, mechanical, aerospace, civil, materials, robotics, engineering physics, energy, engineering management. It excludes chemical, biological, and biomedical engineering on purpose. The exclusion is a scope limit. Those fields have different employment structures, different lab gatekeeping, and the applicant pool self-selects differently. I wanted the tool to speak precisely about one group rather than vaguely about all of them.

The output is a reach/match/safety list of six to eight schools per tier, each with official admission data, same-background community cases, an employment and entrepreneurship score, and a budget match. A second module handles the community-college-to-UC transfer path: which UCs honor TAG for engineering, which CCs feed which campuses, and the cost and time comparison against applying directly.

## How It Works

The skill's core is a source hierarchy. Sixty percent of its weight sits on official sources: the Common Data Set, engineering school pages, US News's engineering-specific ranking, and public feedback from admissions officers through blogs and AMAs. Twenty-five percent sits on community cases — Reddit's r/ApplyingToCollege, College Confidential, Xiaohongshu, CUUS — and fifteen on trend sources. The 60/25/15 split is a stance. It says community anecdotes are useful but should not drive the conclusion, and a single viral post is worth nothing on its own. The skill has an explicit rule: no conclusion from one post, one ranking, or one blogger.

The employment weighting sits on top of that. When two schools score within noise of each other on admissions difficulty, one of them has a co-op program that places undergraduates, a cluster of relevant employers nearby, an incubator with money, and an alumni network in the target industry. The other has a nice campus. The skill ranks by resources and treats the ranking table as a tiebreaker.

The differentiation module is where the design gets opinionated. It recommends cross-disciplines like robotics over pure CS, on the reasoning that the applicant pool is thinnest there. It recommends mid-country and southern engineering schools with strong employer ties as an escape from coastal competition. These are strategies, not measurements.

## What Broke

The skill cannot tell you how much it is laundering. This is the part I keep coming back to.

Community cases are biased samples. The person who posts about being admitted with average stats is not representative; the person who posts at all is not representative. Reddit and College Confidential skew toward people who find those forums, which is not the applicant pool.

Employment data is lagging. The co-op placement rate a school published for the last three years reflects the labor market three years ago. The ranking of an incubator that just lost its director looks the same as one that just got a new fund. The skill weights current-season admissions data higher than older data. It has no equivalent rule for employment structures, partly because there is no clean number for "will there be jobs in this field when the student graduates in four years."

"Fit" is partly unmeasurable. Whether a student will actually show up to the robotics club, whether the weather at a school in the midwest will affect their motivation, whether the professor they matched with will leave after their second year — the tool cannot model any of that. It scores on proxies and pretends, in its output, that the proxies are the thing itself.

The biggest risk is not the missing data. It is that the tool can dress up preferences as measurements. If I weight employment heavily, the tool's output will favor high-employment schools, and a student reading the output may conclude those schools are better for them. The tool's design decided their priorities for them. A list sorted by a magazine number at least has the honesty of being a single number. A list sorted by six resources and three modules looks evidence-based and is perhaps just my preferences with better formatting.

## Limits and Next

The tool covers only the majors listed above. It does not know the applicant's actual family resources or how they want to work after graduation. Those inputs come from the skill's questions, but it cannot verify the answers.

The community-college-to-UC module is a special case: many of the strongest feeder CCs and TAG terms change from year to year, so the file has to be checked against the current terms before each application season. If the skill file is stale, the module is wrong.

I do not claim the tool gets the admissions outcomes right. I do not claim its ranking of resources is correct, or neutral. It is my ranking, with a transparent weight. I use it as a decision aid, not an oracle. The applicant is supposed to look at the output, argue with it, and tell the agent where it is wrong. The tool is small and should stay that way, because a bigger version would be harder to argue with.
