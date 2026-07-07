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

Before a CD4+ T cell can respond to a threat, the antigen it recognizes has to be broken down inside the cell and displayed as a short peptide on an MHC class II molecule. Which peptides survive that journey, and therefore which ones become **epitopes**, depends heavily on the physical properties of the parent protein. The **Antigen Processing Likelihood (APL)** model captures exactly this. Rather than learning epitope patterns from labels alone, APL reasons about the biophysics of processing by combining four complementary signals: crystallographic B-factors, solvent accessible surface area, sequence entropy, and conformational stability from COREX. The result is a prediction grounded in structure instead of correlation.

There is a catch. APL is accurate, but it has never been easy to run. The conformational stability step at its heart is expensive, historically taking hours or even days for a single protein, and the surrounding pipeline was a loose collection of scripts that assumed a command line expert. In practice this kept a genuinely useful method out of the hands of the immunologists who could benefit from it most.

This project set out to fix both problems at once: make the slow parts fast, and make the whole thing something a biologist can actually use.

## Making conformational stability fast

The single largest cost in APL is COREX, a free energy calculation that estimates how stable each region of a protein is by weighing a large ensemble of partially unfolded states. It is accurate but brutal to compute. We rebuilt COREX from the ground up for the GPU, expressing the ensemble energetics as batched tensor operations in PyTorch so that thousands of conformational states are evaluated in parallel. Work that once demanded a large CPU cluster now runs comfortably on a single commodity GPU, bringing the runtime down from hours to minutes.

<<BIBM2024GPUCOREX>>

## Accelerating the sampling

COREX leans on Markov Chain Monte Carlo sampling to explore that conformational ensemble, and this too was a bottleneck. We designed a GPU native MCMC sampler that keeps the chains resident on the device and advances them in parallel rather than one step at a time. Across our pathogen, melanoma, and immunopeptidomics benchmarks it delivers up to a 4x speedup over the previous sampler, and on an everyday two GPU workstation the median time to process a protein drops from roughly three minutes to about a minute and a half. The gains hold on both a modest desktop and a high performance server, so faster results do not require exotic hardware.

<<AIMLSYS2024GPUMCMC>>

## Putting it all within reach: APLSuite

Speed alone does not make a method usable. To close that gap we built **APLSuite**, a complete system that wraps the accelerated APL pipeline in an interface people will actually touch. At its core is a browser based graphical interface that takes a researcher from a protein to a ranked set of predicted CD4+ epitopes without writing a single line of code. Underneath, a set of distributed RESTful services, a Python client, and a data science toolkit expose the same pipeline for scripting and larger studies, and the entire suite runs either on a laptop or in the cloud through guided or fully customizable workflows. A computation that used to be expert only is now a few clicks and a few minutes.

<<APLSuite>>

Taken together, these pieces turn APL from a promising but impractical idea into a fast, approachable tool for epitope discovery and immunotherapy research. The publications behind each step are listed below.
