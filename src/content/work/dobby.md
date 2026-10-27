---
title: "Dobby: Glosses That Stay Inside the Page"
kicker: "Translation replaces the page; a gloss keeps you in it."
dek: "A Chrome extension and a local Python server put small Chinese glosses above unfamiliar words, then quiet down as you learn them."
period: "2026-06"
category: "Agent tooling"
stack: ["Chrome Manifest V3", "JavaScript", "Python stdlib", "DeepSeek API", "Chrome storage"]
status: "Shipped"
featured: false
order: 4
---

## The Failure in the World

Open a long English article, hit an unfamiliar word, and the reading stops. It does not matter how much of the sentence is legible. One word pulls the eye off the line, you highlight it, you right-click, you paste it into a translator, you come back. The paragraph is cold by the time you return.

The cheapest fix is to translate the whole thing. Paste the page into a translator and read Chinese. It works, in the sense that you understand the content. But you have also spent the session reading no English. A second fix is the browser's built-in word lookup, a popup that covers the paragraph you were reading and asks for a click to dismiss. Both fixes move you out of the text.

What I wanted was a gloss that lives inside the paragraph. The Chinese sits above the English word in small type. The English line stays where it was. You read one line, you understand it, you keep going.

## What I Built

Dobby is a Chrome extension plus a local Python server. The extension is Manifest V3; the server is standard-library Python only, listening on port 8848. The server sends the visible text to the DeepSeek API with a prompt that selects words worth glossing and returns short Chinese translations. The extension inserts those glosses above the words. The page itself is not rewritten.

The known-word list stays on the machine. There is no account and no analytics. The tradeoff is real: every paragraph you glow is sent to a hosted model. I would not use Dobby on confidential text.

The main gesture is small. Hover a paragraph, click Glow, and the paragraph is annotated. Every selected word gets a short Chinese gloss above it, in the space between lines. The English remains in place. Click later and the paragraph goes back to plain text.

There is also a document mode. Upload a PDF, the server extracts the text, and the whole document gets annotated the same way. Batch processing is slower, and image-only PDFs or complex layouts will lose structure.

## How the Memory Works

The interesting part is what Dobby does over time. Every annotated word goes into a vocabulary store held by the extension. When you have seen a word three times across your reading, Dobby marks it known and stops glossing it. The argument is that a third encounter is a strong enough signal that the word has landed, or that the gloss is becoming decoration and can be retired. Either way, the paragraph gets less crowded as you read more.

A level setting controls which words get glossed in the first place. Beginner marks more words, Intermediate is the default, and Advanced restricts the glosses to rare academic and technical vocabulary. The three levels exist because a fixed "unfamiliar word" list is wrong for everyone. What is overexplained for one reader is invisible for another.

## What Broke

The first thing that broke was over-annotation. On a paragraph dense with unfamiliar words, Beginner-level glossing turned the page into a stack of Chinese text with English buried under it. The glosses had stopped being aids and started being the content. The fix was partly the level setting and partly the three-exposure rule: fewer glosses, at the cost of leaving some words unexplained. Choosing which words to leave alone is harder than choosing which to gloss.

The second thing was less technical. I noticed myself reading through the glosses instead of through the English. The comprehension improved, but the learning did not. You can finish an article this way and have absorbed almost no vocabulary. I am not sure there is a design fix; the tool is genuinely doing what its name says, helping you read past a word. The risk is that the tool becomes a comfort that removes the friction that produces learning.

The third issue is operational. If the server is not running, the extension cannot annotate; it shows a retry state, but the server is still a prerequisite a normal user has to understand. A persistent server is fine for me, since I treat it like a desktop app, but it is not fine for someone who installed the extension from a link and does not know what `python3 server.py` means.

The fourth is a bug I should not have shipped. The current version hardcodes the DeepSeek API key in `server.py`. A public repository with a key in it is a key that has to be revoked. The fix is an environment variable and a small proxy, and it is the first thing I would change.

## Limits and Next

Dobby only works in Chrome. Only on a machine where I have Python installed. The gloss quality depends on the model and the prompt, and the API costs money per page. PDFs with images, columns, or scanned pages produce garbled text after extraction.

There is also an unresolved tension in the product itself. The tool is best when it makes reading easy, and easy reading over time is a way to not learn. A reader could stay on Intermediate forever and run through Dobby without retaining much. I have no measurement that tells me whether the glosses aid retention or substitute for it, so I will not claim they do.

The honest description: Dobby is a good tool for getting through a long text with attention intact. Whether it makes a better reader is a different question, and I am still reading into it.
