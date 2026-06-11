---
layout: paper
has_breadcrumb: true
has_is_mono: true
paper:
  title: "GPU Acceleration of Conformational Stability Computation for CD4+ T-cell Epitope Prediction"
  publication: "International Conference on Bioinformatics and Biomedicine"
  date:
    month: December
    year: 2024
  abbr: "BIBM"
  pubicon: "images/IEEEBIBM-2024-logo-color.jpg"
authors:
  - name: "Jiarui Li"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://www.jiarui-li.com/"
  - name: "Samuel J. Landry"
    affiliation: "Department of Biochemistry and Molecular Biology, Tulane University School of Medicine"
    link: "https://www2.tulane.edu/~biochem/faculty/landry.htm"
  - name: "Ramgopal R. Mettu"
    affiliation: "Department of Computer Science, Tulane University"
    link: "http://www.cs.tulane.edu/~mettu"
    corresponding: true
links:
  - name: "Paper"
    link: "https://ieeexplore.ieee.org/abstract/document/10821831"
    icon: "ai ai-ieee"
    expand: true
  - name: "PDF"
    link: "li2024gpu.pdf"
    icon: "fa-solid fa-file-pdf"
  - name: "GitHub"
    link: "https://github.com/Jiarui0923/gpuCOREX"
    icon: "fa-brands fa-github"
citations:
  Bibtex: |
    @inproceedings{li2024gpu,
      title={GPU Acceleration of Conformational Stability Computation for CD4+ T-cell Epitope Prediction},
      author={Li, Jiarui and Landry, Samuel J and Mettu, Ramgopal R},
      booktitle={2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)},
      pages={191--196},
      year={2024},
      organization={IEEE}
    }
  APA: "Li, J., Landry, S. J., & Mettu, R. R. (2024, December). GPU Acceleration of Conformational Stability Computation for CD4+ T-cell Epitope Prediction. In 2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM) (pp. 191-196). IEEE."
  MLA: "Li, Jiarui, Samuel J. Landry, and Ramgopal R. Mettu. \"GPU Acceleration of Conformational Stability Computation for CD4+ T-cell Epitope Prediction.\" 2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM). IEEE, 2024."
  GBT7714: "Li J, Landry S J, Mettu R R. GPU Acceleration of Conformational Stability Computation for CD4+ T-cell Epitope Prediction[C]//2024 IEEE International Conference on Bioinformatics and Biomedicine (BIBM). IEEE, 2024: 191-196."
document:
  centered: false
  footer: "CC BY 4.0"
nav:
  Home: "/"
  Papers: "/papers/"
  BIBM 2024: null
---

CD4+ T cells play a crucial role in adaptive immunity and are a significant component of immunological response in many settings. Computational prediction of which antigenic peptides are presented and bind to T cells is a problem that has been studied for several decades. Current efforts apply supervised learning methods to predict peptide-MHCII binding, but do not incorporate the role of antigen processing. To address this, our group developed the Antigen Processing Likelihood (APL) algorithm, which relies on a free energy-based conformational stability metric known as COREX. COREX requires the analysis of a potentially large conformational ensemble and is thus computationally intensive. In recent prior work, we parallelized this analysis with an algorithm we called pCOREX. pCOREX reduced the computation time from hours/days to minutes, demonstrating a near-ideal speedup on 192 CPU cores. In this paper, we achieve an even more substantial acceleration of the COREX algorithm by making use of GPU cores, and demonstrate a reduction in computation time from minutes to seconds

![corexpipeline](./images/corex_pipeline.png)

The GPUCOREX can be installed use command:
```shell
pip install gpucorex @ git+https://github.com/Jiarui0923/gpuCOREX@0.0.2
```
