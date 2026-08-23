---
layout: project
title: "Interpretable TCR-Epitope Prediction"
date: 2026-04-01
desc: "Interpretable models for predicting and interpreting how T-cell receptors recognize peptide-MHC complexes."
tags: ["Immunology", "TCR-pMHC", "XAI", "Machine Learning", "Computational Biology"]
pageicon: "fa-solid fa-diagram-project"
image: "/projects/tcr/images/background.png"
related_papers:
  - MLCB2026TCRSRIM
  - ICLR2026QCAI
  - LMRL2026TCREML
  - BCB2025EGM
---

T cells patrol the body by reading antigens that are displayed as **peptide-MHC (pMHC)** complexes, and they do it through the **T-cell receptor (TCR)**. Whether a given TCR binds a given pMHC is one of the central questions in immunology, and getting the answer right underpins everything from vaccine design to cancer immunotherapy. It is also stubbornly hard to predict. The sequence space is enormous, binding turns on a handful of subtle residue contacts, and the strongest deep learning models behave as black boxes: they can score a pair, but they cannot tell us why.

That "why" is what this project is really after. We treat explainability not as a decoration on top of a predictor, but as a scientific instrument. Used well, interpretability can show us where today's models struggle, expose the structural logic behind recognition, and point directly at how to build better ones. Our work follows that thread from post-hoc explanation, through interpretation that is baked into the architecture, and finally back to model design, with every step measured against the same benchmark of experimental structures.

## Post-hoc interpretation, grounded in experiment

Before you can trust an explanation, you need a way to check it. So we built **TCR-XAI**, a benchmark of 274 experimentally determined TCR-pMHC structures that act as ground truth for which residues actually meet across the binding interface. By comparing the residues a model claims are important against the contacts measured in the lab, we can score interpretation quality directly instead of taking it on faith. This benchmark grounds every method that follows.

Our first method, **QCAI**, is a post-hoc technique that quantifies cross-attention interaction inside transformer decoders, the encoder and decoder architecture that leading TCR-pMHC predictors are built on and that off-the-shelf explainability tools cannot handle. It reads the attention a trained model already computes and turns it into a residue-level account of what drove a prediction, reaching state of the art on both accuracy and interpretability.

<<ICLR2026QCAI>>

## Building interpretation into the model

A post-hoc method explains a model after it is trained, so the explanation is always a reconstruction of a decision that was already made. We wanted interpretation to be part of the model itself. In **TCR-EML** we introduced explainable model layers built from prototypes: learnable components that correspond to genuine residue contacts drawn from known TCR-pMHC binding mechanisms, sitting directly on a protein language model backbone. Because the interpretable pieces are the model rather than a lens held up to it, the explanations are faithful by construction, and the model stays competitive with black-box predictors on large datasets while scoring higher on TCR-XAI.

<<LMRL2026TCREML>>

We carried this explain-by-design idea further with **TCR-SRIM**, which pairs protein language embeddings with interpretable contact prototypes and adds structural regularization. Being interpretable by design let us use the model as a probe, and it turned up a genuinely mechanistic result. When the structures a model learns from come from predictors like AlphaFold3, TCRModel2, and tFold-TCR rather than from experiment, prediction scores stay competitive, yet the interaction patterns become less accurate and the binding sites less diverse than those learned from experimentally resolved structures. Put plainly, a model can look right while learning the wrong contacts, and only an interpretable model makes that slip visible.

<<MLCB2026TCRSRIM>>

## From explanation back to better models

If explanations can tell us where a model goes wrong, they can also tell us how to build it better. **Rational Multi-Modal Transformers** closes that loop. Instead of picking an architecture by intuition, we let a post-hoc explainability method drive the design. It guided which TCR and epitope inputs to combine, how to shape cross-attention, which auxiliary objectives to add, and even a new early stopping rule keyed to explanation quality rather than validation loss alone. The payoff is a model that reaches state of the art on prediction while becoming more explainable, more robust, and better at generalizing, evidence that explanation-driven design earns its keep in accuracy and not only in transparency.

<<BCB2025EGM>>

Taken together, these four efforts trace a single arc: measure interpretation honestly, use it to read existing models, make it intrinsic to new ones, and then feed what we learn back into better architectures. Along the way they sketch a clearer picture of what actually makes a TCR recognize its target. The papers behind each step are listed below.