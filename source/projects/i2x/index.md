---
layout: project
title: "From Interpretability to Explainability"
date: 2026-03-01
desc: "Explaining how a model learns, so it becomes easier for people to understand and easier to optimize."
tags: ["XAI", "Interpretability", "Explainability", "Training Dynamics", "Prototype Learning", "AI4S", "Machine Learning"]
pageicon: "fa-solid fa-diagram-project"
image: "/projects/i2x/images/background.png"
related_papers:
  - WhyLookThere
---

Most explainable AI today stops at interpretability. It can point to where a model attends, through a saliency map or an attention weight, but it rarely tells you why the model settled on that evidence or how it got there in the first place. A heatmap shows a location. It does not tell a story a person can follow. This project argues that the more useful goal is explainability, and that the most direct way to reach it is to explain the one process that actually shapes a model's reasoning: its training.

## From interpretability to explainability

Interpretability answers "where does the model look." Explainability should answer something closer to "why does it look there, and what does that region mean for the decision." The gap between the two matters. Many methods try to close it by handing a saliency map to an external model, such as a large language model, and asking it to narrate an explanation. That narration can read well while drifting away from what the classifier actually computed.

We take a different route. Our framework, Interpretability to Explainability (I2X), converts raw interpretability signals such as GradCAM saliency into **structured, prototype-based explanations**, without borrowing any outside model. Each explanation is expressed in terms of prototypes the classifier itself relies on, and it is organized into an intra-class and inter-class view, so you can see not only what supports a prediction but also what separates one class from another. Because everything is grounded in the original model, the explanation stays faithful to it.

## Explaining the training procedure

The idea we care about most is that a model's reasoning is not fixed. It is built, gradually, over the course of training. So instead of explaining only the final weights, I2X follows prototypes across checkpoints as the model learns. This turns a single static snapshot into a developmental account, one that shows how the evidence a model trusts forms, sharpens, and sometimes shifts. Watching that process is what makes the model's behavior genuinely human understandable, rather than merely visible.

## Explanation that makes the model better

Once you can see how training unfolds, explanation stops being a passive readout and becomes a lever. I2X surfaces which prototypes remain uncertain, and then acts on them, using targeted perturbations during fine-tuning to steer the model toward cleaner, more reliable evidence. The result is a loop in which understanding the model and improving it are the same activity: explaining training helps the model optimize faster and reach higher accuracy. We validate both the explanations and these gains on standard image benchmarks.

<<WhyLookThere>>

## Toward AI for Science

We see this direction as a foundation for AI for Science. In scientific settings a prediction is only as valuable as the mechanism behind it, and a black box that is right for unknown reasons is hard to trust and harder to build on. A method that explains how a model learns, and that lets those explanations guide training, fits that need naturally. Our longer term aim is to carry I2X into scientific discovery, where the point is not just to predict an outcome but to understand why it holds.
