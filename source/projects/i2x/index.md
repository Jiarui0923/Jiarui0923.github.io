---
layout: project
title: "From Interpretability to Explainability"
date: 2026-03-01
desc: "Explaining the model training procedure that transforms interpretation into explanation."
tags: ["XAI", "Interpretability", "Explainability", "Machine Learning"]
pageicon: "fa-solid fa-diagram-project"
image: "/projects/i2x/images/background.png"
related_papers:
  - WhyLookThere
---

Deep image classifiers are accurate but opaque. This project asks a simple question, "why
does the model look there?", and answers it with structured explanations that localize and
describe the evidence behind a prediction.

## Beyond saliency heatmaps

A single saliency map tells you roughly where a model attends, but not how those regions
combine into a decision. We produce structured explanations that name the relevant regions
and relate them to the predicted class, making the reasoning easier to inspect and to
trust:

<<WhyLookThere>>

The full reference is listed below.
