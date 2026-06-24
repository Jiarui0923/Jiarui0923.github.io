---
layout: paper
has_breadcrumb: true
has_is_mono: true
pageicon: "fa-solid fa-file-lines"
desc: "Learning Meaningful Representations of Life (LMRL) Workshop at ICLR 2026"
tags: ["XAI", "Immunology", "TCR-pMHC", "Prototype Learning", "Ante-hoc", "Computational Biology", "Machine Learning"]
paper:
  title: "TCR-EML: Explainable Model Layers for TCR-pMHC Prediction"
  publication: "Learning Meaningful Representations of Life (LMRL) Workshop at ICLR 2026"
  date:
    month: April
    year: 2026
  abbr: "LMRL"
  pubicon: "./images/iclr-navbar-logo.svg"
authors:
  - name: "Jiarui Li"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://www.jiarui-li.com/"
  - name: "Zixiang Yin"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://zachyin.com/"
  - name: "Zhengming Ding"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://www.cs.tulane.edu/~zding1/"
  - name: "Samuel J. Landry"
    affiliation: "Department of Biochemistry and Molecular Biology, Tulane University School of Medicine"
    link: "https://medicine.tulane.edu/departments/biochemistry-molecular-biology-tulane-cancer-center-debakey/faculty/samuel-j-landry-phd"
  - name: "Ramgopal R. Mettu"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://ramgopalmettu.org/"
    corresponding: true
links:
  - name: "Paper"
    link: "https://openreview.net/forum?id=lBS6Kg648t"
    icon: "fa-regular fa-file"
    expand: true
  - name: "arXiv"
    link: "https://arxiv.org/abs/2510.04377"
    icon: "ai ai-arxiv"
  - name: "GitHub"
    link: "https://github.com/Tulane-Mettu-Landry-Lab/tcr-eml"
    icon: "fa-brands fa-github"
  - name: "HuggingFace"
    link: "https://huggingface.co/jli78/TCR-EML/"
    icon: "fa-brands fa-hugging-face"
  - name: "Poster"
    link: "LMRL2026TCREML_POSTER_20260416_02.pdf"
    icon: "fa-solid fa-image"
  - name: "PDF"
    link: "li2026tcreml.pdf"
    icon: "fa-solid fa-file-pdf"
citations:
  Bibtex: |
    @inproceedings{"li2026tcreml,
      title={TCR-EML: Explainable Model Layers for TCR-pMHC Prediction},
      author={Li, Jiarui and Yin, Zixiang and Ding, Zhengming and Landry, Samuel J and Mettu, Ramgopal R},
      booktitle={Learning Meaningful Representations of Life (LMRL) Workshop at ICLR 2026},
      pages={1--10},
      year={2026}
    }
  APA: "Li, J., Yin, Z., Ding, Z., Landry, S. J., & Mettu, R. R. (2026). TCR-EML: Explainable Model Layers for TCR-pMHC Prediction. Learning Meaningful Representations of Life (LMRL) Workshop at ICLR 2026 (pp. 1-10)."
document:
  centered: false
  footer: "CC BY 4.0"
nav:
  Home: "/"
  Papers: "/papers/"
  LMRL 2026: null
---

T cell receptor (TCR) recognition of peptide-MHC (pMHC) complexes is a central component of adaptive immunity, with implications for vaccine design, cancer immunotherapy, and autoimmune disease. While recent advances in machine learning have improved prediction of TCR-pMHC binding, the most effective approaches are black-box transformer models that cannot provide a rationale for predictions. Post-hoc explanation methods can provide insight with respect to the input but do not explicitly model biochemical mechanisms (e.g. known binding regions), as in TCR-pMHC binding. "Explain-by-design" models (i.e., with architectural components that can be examined directly after training) have been explored in other domains, but have not been used for TCR-pMHC binding. We propose explainable model layers (TCR-EML) that can be incorporated into protein-language model backbones for TCR-pMHC modeling. Our approach uses prototype layers for amino acid residue contacts drawn from known TCR-pMHC binding mechanisms, enabling high-quality explanations for predicted TCR-pMHC binding. Experiments of our proposed method on large-scale datasets demonstrate competitive predictive accuracy and generalization, and evaluation on the TCR-XAI benchmark demonstrates improved explainability compared with existing approaches.

![intro](./images/intro.png)
_**Explainable Model Layers (TCR-EML)** include a Feature Enhancement and Fusion (FEF) block and contact prototype layers, which not only predict TCR-pMHC binding but also provide contact scores corresponding to contact distances. In the absence of experimental TCR-pMHC structures, the contact prototype illuminates TCR-pMHC binding patterns._

![poster](./images/LMRL2026TCREML_POSTER_20260416_02.png)