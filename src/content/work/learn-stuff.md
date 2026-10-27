---
title: "A Tutor That Refuses to Teach You"
kicker: "A learning tool that withholds answers until the learner asks."
dek: "Learn-Stuff gives one concrete anchor, then waits. If you do not ask, nothing happens, and that silence is the entire design."
period: "2026-07"
category: "Agent tooling"
stack: ["Claude Code", "Markdown", "Obsidian"]
status: "Shipped"
featured: false
order: 5
---

## Every Learning Tool Is a Textbook in a Chat Box

Most AI "learning" tools do one thing: they take a textbook and wrap it in a chat interface. Chapters, worked examples, quizzes. The interactive ones add animation and a game layer. The format changed. The direction of knowledge did not. You receive, the machine sends.

I kept running into my own version of this. I would read an explanation of entropy, feel like I understood it, and then be unable to say what it was in my own words. The feeling of fluency and the fact of understanding had drifted apart, and no amount of re-reading closed the gap. The problem was not access to information. The problem was that nothing in the loop ever made me produce anything.

So on July 27 and 28, 2026 I wrote Learn-Stuff: a Claude Code skill triggered by `/learn-stuff <topic>`. You type `/learn-stuff entropy` and it does not give you a definition. It does not list a knowledge graph. It does not recommend a course. It gives you one concrete anchor and stops.

## What I Did

The skill refuses to explain until you ask. That refusal is the design, not a limitation. A first session on entropy might open like this:

> Imagine a sealed box split down the middle. Hot water on the left, ice on the right. Now pull out the divider. What happens next, and why?

You answer. It asks whether you have ever seen the process run in reverse: a lukewarm box that splits itself into a hot half and a cold half. You say no, that is impossible. It agrees, then points out that energy conservation does not forbid the reverse direction. The total energy is unchanged either way. Physics allows it. It never happens. That gap is what entropy is for.

The anchor is always a closed, physical case: a steam engine, a broken egg, ink diffusing into water. The learner pulls the concept out of the case. The skill never states the concept first.

There is a second persona. If you say "life design," the skill switches to a Stanford d.school *Designing Your Life* coach, working from the Burnett and Evans book. One question per turn, concrete scene questions, and a habit of catching the learner's unexamined rules, like "I have to grab every opportunity," and offering to redefine them. The two modes can run alongside each other.

## How It Works

The loop has four steps and does not skip any of them:

```
anchor → learner question → I answer only that → ask "what would you search?" → next anchor
```

Three rules hold it up.

**You ask, it answers. Never more.** This is not about saving tokens. It comes from cognitive load limits: working memory holds a handful of items, so a five-hundred-word explanation overflows a learner before they have registered the first idea. Structure, not typography, sets the information budget.

**Every concept hangs on an anchor.** You cannot learn entropy in a vacuum. You need the box, the egg, the ink. Confusion inside a concrete case is the fuel.

**"I don't get it" moves down a level. "I get it" moves up.** The skill takes "I don't get it" as the signal to drop to a simpler anchor and change the analogy. It takes "I get it" as the signal to hand over a harder one. No preset difficulty curve. The conversation calibrates itself.

Each round ends with a retrieval prompt: *if you went to look this up yourself, what would you search?* The learner has to name the concepts they just built. When a session ends, the skill writes a short note into Obsidian with a one-sentence summary in the learner's own words, a connection they made, and a question they still cannot answer. It stores the learner's understanding, not the model's output.

Version 1.1, pushed July 29, cleaned up the philosophy section and added a real transcript so the method could be read by people outside the terminal.

## What Broke

The risk is obvious once you see it: a tutor that refuses to answer can slide into theater. Withholding a definition looks like Socratic teaching and is easy to fake. If the anchor is weak or the learner's answer is already close, the pause is a move, not a lesson. The skill can read as smug. I have not found a rule that tells the difference from the inside, and I do not think the skill can either.

The second problem is harder. The whole design assumes the learner has enough energy to ask. The loop's engine is the question, and a question costs effort at exactly the moment someone is least likely to have it. A tired learner types `/learn-stuff X`, gets an anchor, does not form a question, and the session dies. A tool that hands out a definition at least leaves them with the definition. Learn-Stuff leaves them with a box of hot water and ice. Sometimes that is the point. Sometimes it is just friction dressed up as pedagogy.

Underneath both is a bet: that the friction is the learning, not the tax on it. The methodology document leans on the generation effect, the self-explanation effect, and Bloom's finding that one-on-one tutoring outperforms classroom teaching by two standard deviations. The argument is plausible. It is not the same as knowing the loop works. A plausible mechanism is not a measured result.

## Limits and Next

Learn-Stuff is text-only. It cannot show a merge animation or a data flow the way a visual can, and for some concepts that is a real loss. There is no scoring, so understanding is judged by the two parties in the conversation and nobody else. It needs a human on the other end, so it does not scale past one learner at a time.

The shortfall I keep thinking about is the smugness. The best version I can imagine is the skill noticing when the learner is parched and offering a small drink instead of a box. I have not built that, and I do not yet know what the signal would look like.

What I can say is narrower. The tool will not teach you anything. It will wait for you to teach yourself, and then get out of the way. Whether the waiting is discipline or theater is still open. I suspect the answer depends on the day and the person, which is not the answer I wanted.
