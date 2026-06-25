---
layout: project
title: "Antigen Processing Prediction Acceleration"
date: 2024-12-01
desc: "GPU-accelerated modeling of antigen processing to predict CD4+ T-cell epitopes."
tags: ["Immunology", "Antigen Processing", "Algorithm Acceleration", "Computational Biology"]
pageicon: "fa-solid fa-diagram-project"
image: "/projects/apl/images/background.png"
related_papers:
  - BIBM2024GPUCOREX
  - AIMLSYS2024GPUMCMC
  - APLSuite
---

Before a T cell can recognize an antigen, that antigen must be processed and presented as a
peptide on an MHC molecule. Modeling this antigen processing pathway lets us predict which
peptides become **CD4+ T-cell epitopes**, yet the underlying biophysical computations are
expensive. This project makes epitope prediction practical by accelerating the core
calculations on the GPU and packaging them into an easy-to-use suite.

## Faster conformational stability

CD4+ epitope prediction depends on conformational stability calculations that dominate the
runtime. We re-engineered this computation for the GPU and achieved large speedups:

<<BIBM2024GPUCOREX>>

## Accelerated sampling

The same pipeline relies on Markov Chain Monte Carlo sampling. We built a GPU
implementation that delivers substantial gains over the CPU baseline:

<<AIMLSYS2024GPUMCMC>>

## An integrated suite

Finally, we packaged antigen processing likelihood and epitope prediction into a single
application so others can run the full workflow end to end:

<<APLSuite>>

All related publications are listed below.
