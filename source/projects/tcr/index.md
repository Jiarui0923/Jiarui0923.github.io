---
layout: project
title: "Interpretable TCR-Epitope Prediction"
date: 2026-04-01
desc: "Interpretable models for predicting and interpreting how T-cell receptors recognize peptide-MHC complexes."
tags: ["Immunology", "TCR-pMHC", "XAI", "Machine Learning", "Computational Biology"]
pageicon: "fa-solid fa-diagram-project"
image: "/projects/tcr/images/background.png"
related_papers:
  - ICLR2026QCAI
  - LMRL2026TCREML
  - BCB2025EGM
---

T cells orchestrate the adaptive immune response by recognizing antigens presented as
**peptide-MHC (pMHC)** complexes through the **T-cell receptor (TCR)**. Accurately
predicting, and just as importantly explaining, TCR-pMHC binding is fundamental to
understanding immune recognition and to designing immunotherapies. This project develops a
family of transformer-based models that are both accurate and interpretable.

## Motivation

State-of-the-art predictors such as transformer encoder/decoder models achieve strong
performance, but their black-box nature limits mechanistic insight. Our goal is to make
TCR-pMHC models **explainable**, recovering the structural basis of binding without
sacrificing predictive accuracy.

## Interpreting attention

Our flagship post-hoc method quantifies cross-attention interaction to reveal which
residues drive binding, benchmarked against experimentally determined structures:

<<ICLR2026QCAI>>

## Building explainability into the model

We also designed *ante-hoc* explainable model layers, so interpretability is intrinsic to
the architecture rather than added after the fact:

<<LMRL2026TCREML>>

## Rational multi-modal prediction

Beyond interpretability, we improved prediction itself with rational multi-modal
transformers that fuse sequence and structural signals. Together with our work on
accelerating the underlying biophysical computations, these efforts form a complete
pipeline from epitope processing to TCR recognition.

<<BCB2025EGM>>