# Drafted Claude Code Plugin

> *Because staring at a spinner is a waste of a perfectly good brain.*

Keep learning with hands-on tasks at: [joindrafted.com/student](https://joindrafted.com/student)

A Claude Code plugin that teaches you AI/ML while Claude is thinking. Every time you hit enter, a fact from the frontier appears in your terminal. Tokenization, transformers, RLHF, agent architecture, the works.

94 facts. Zero extra time required. You were going to wait anyway.

```
  ╔══════════════════════════════════════════════════════════════╗
  ║ DRAFTED FACT #028: TRANSFORMERS & LLMS                       ║
  ╠══════════════════════════════════════════════════════════════╣
  ║                                                              ║
  ║ RLHF (Reinforcement Learning from Human Feedback)            ║
  ║ fine-tunes a base LLM using human preference rankings,       ║
  ║ making outputs more aligned and helpful. Used in             ║
  ║ ChatGPT and Claude.                                          ║
  ║                                                              ║
  ║ Learn more at joindrafted.com/student                        ║
  ╚══════════════════════════════════════════════════════════════╝
```

---

## Install

You need Claude Code. If you don't have it: [claude.ai/code](https://claude.ai/code).

Then run these two commands:

```bash
claude /plugin marketplace add draftedlabs/drafted-learn
claude /plugin install drafted-learn@drafted-learn
```

That's it. Start a new session and send any message. The box appears.

**To uninstall:**
```bash
claude /plugin uninstall drafted-learn
```

---

## What you'll learn

94 facts across 8 categories, rotating randomly:

| Category | What's covered |
|---|---|
| **Foundations** | Tokens, context windows, temperature, overfitting, inference |
| **Neural Networks** | Backprop, gradient descent, CNNs, RNNs, dropout, ResNets |
| **Transformers & LLMs** | Self-attention, BERT, GPT, RLHF, KV-cache, MoE, fine-tuning |
| **AI Agents** | Agentic loops, tool use, ReAct, MCP, multi-agent systems |
| **AI History** | Turing (1950) through OpenAI o1 (2024) |
| **Training Data** | Annotation, IAA, synthetic data, scaling laws, eval hygiene |
| **Practical ML Engineering** | Loss, RAG, embeddings, cosine similarity, precision/recall |
| **Ethics & Safety** | Hallucination, alignment, prompt injection, red-teaming |

By the time you finish a project, you'll have absorbed more AI fundamentals than most online courses teach in weeks.

---

## Why we built this

**[Drafted](https://joindrafted.com)** connects university students to real AI work for frontier AI labs building the next generation of models.

We built drafted-learn because we kept seeing the same thing: students who could *use* AI tools but couldn't explain what was happening under the hood. They'd open Claude Code, ship something, and close it without ever knowing what a token is, what RLHF did to the model they just prompted, or why hallucinations happen.

That felt like a missed opportunity. You're already here. The spinner is already spinning. Might as well learn something.

The students who understand the stack, not just the surface, are the ones who get hired to build it. That's what Drafted is for.

---

## Want to keep learning with hands-on tasks?

Drafted places students in real AI work. If you want to go from *understanding* RLHF to *doing* RLHF, we have a spot for you.

**Keep learning with hands-on tasks at:**
[joindrafted.com/student](https://joindrafted.com/student)

You'll work on real tasks, learn more in one project than a semester of coursework, and build a track record doing actual AI work.

University partners: USC, UChicago, Georgetown, U Miami and growing.

---

## Add your own facts

Edit `data/ai-facts.json` and add an entry:

```json
{
  "id": "095",
  "category": "agents",
  "difficulty": "intermediate",
  "text": "Your fact here. Keep it under 200 chars so it fits cleanly.",
  "source": "Your name or paper",
  "tags": ["relevant", "tags"]
}
```

PRs welcome. If you know something worth knowing, share it.

---

## Technical details

- Hook: `UserPromptSubmit` fires on every prompt, before Claude responds
- Output: writes directly to `/dev/tty` so it never interferes with Claude's output
- Width: auto-adapts to your terminal width (min 40, max 120)
- Clickable CTA: OSC 8 hyperlink, works in iTerm2, Ghostty, WezTerm
- No dependencies. Just Node.js, which you already have.

---

Built by [Drafted Labs](https://joindrafted.com) · MIT License
