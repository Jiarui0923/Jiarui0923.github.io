---
layout: paper
has_breadcrumb: true
has_is_mono: true
pageicon: "fa-solid fa-file-lines"
desc: "Machine Learning in Computational Biology"
tags: ["XAI", "Immunology", "TCR-pMHC", "Ante-hoc", "Structure Prediction", "Computational Biology", "Machine Learning"]
awards: ["Oral"]
paper:
  title: "Structure-Regularized Interpretable TCR-Epitope Prediction"
  publication: "Machine Learning in Computational Biology"
  date:
    month: November
    year: 2026
  abbr: "MLCB"
authors:
  - name: "Jiarui Li"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://www.jiarui-li.com/"
  - name: "Zixiang Yin"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://zachyin.com/"
  - name: "Yunbei Zhang"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://yunbeizhang.github.io/"
  - name: "Janet Wang"
    affiliation: "Department of Computer Science, Tulane University"
  - name: "Samuel J. Landry"
    affiliation: "Department of Biochemistry and Molecular Biology, Tulane University School of Medicine"
    link: "https://medicine.tulane.edu/departments/biochemistry-molecular-biology-tulane-cancer-center-debakey/faculty/samuel-j-landry-phd"
  - name: "Zhengming Ding"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://www.cs.tulane.edu/~zding1/"
  - name: "Ramgopal R. Mettu"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://ramgopalmettu.org/"
    corresponding: true
links:
  - name: "PDF"
    link: "MLCB_2026_TCR_SRIM.pdf"
    icon: "fa-solid fa-file-pdf"
    expand: true
  - name: "arXiv"
    link: "https://arxiv.org/abs/2606.30902"
    icon: "ai ai-arxiv"
  - name: "GitHub"
    link: "https://github.com/Tulane-Mettu-Landry-Lab/tcr-sr"
    icon: "fa-brands fa-github"
citations:
  Bibtex: |
    @inproceedings{li2026tcrsrim,
      title={Structure-Regularized Interpretable TCR-Epitope Prediction},
      author={Li, Jiarui and Yin, Zixiang and Zhang, Yunbei and Wang, Janet and Landry, Samuel J and Ding, Zhengming and Mettu, Ramgopal R},
      booktitle={Machine Learning in Computational Biology (MLCB)},
      pages={1--10},
      year={2026}
    }
  APA: "Li, J., Yin, Z., Zhang, Y., Wang, J., Landry, S. J., Ding, Z., & Mettu, R. R. (2026). Structure-Regularized Interpretable TCR-Epitope Prediction. Machine Learning in Computational Biology (MLCB) (pp. 1-10)."
document:
  centered: false
  footer: "CC BY 4.0"
nav:
  Home: "/"
  Papers: "/papers/"
  MLCB 2026: null
---

T cell receptor (TCR)-epitope binding prediction is essential for understanding adaptive immunity and developing immunotherapies. Existing sequence- and structure-based models often generalize poorly to unseen epitopes and provide limited interpretability. Furthermore, the impact of generated structures on model learning remains unclear. We present TCR-SRIM, a structure-regularized interpretable-by-design model that combines protein language model embeddings with interpretable contact prototypes to capture residue-level TCR-epitope interactions. TCR-SRIM achieves state-of-the-art predictive performance and improved interpretation quality on the TCR-XAI benchmark. Using its inherent interpretability, we further evaluate the effect of generated structures on model learning. While structures predicted by AlphaFold3, TCRModel2, and tFold-TCR yield competitive performance, they lead to less accurate interaction patterns and reduced binding-site diversity than experimentally-resolved structures. Our results highlight limitations of current structure prediction models for TCR-epitope learning and demonstrate the value of interpretable-by-design models for studying generated biological structures.
