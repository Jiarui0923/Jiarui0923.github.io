---
layout: paper
has_breadcrumb: true
has_is_mono: true
paper:
  title: "Quantifying Cross-Attention Interaction in Transformers for Interpreting TCR-pMHC Binding"
  publication: "The Fourteenth International Conference on Learning Representations"
  date:
    month: April
    year: 2026
  abbr: "ICLR"
  pubicon: "./images/iclr-navbar-logo.svg"
authors:
  - name: "Jiarui Li"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://www.jiarui-li.com/"
  - name: "Zixiang Yin"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://zachyin.com/"
  - name: "Haley Smith"
    affiliation: "Department of Biochemistry and Molecular Biology, Tulane University School of Medicine"
    link: "https://www.linkedin.com/in/haley-smith-b72640123/"
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
    link: "https://openreview.net/forum?id=S3kSOFhs5m"
    icon: "fa-regular fa-file"
    expand: true
  - name: "arXiv"
    link: "https://arxiv.org/abs/2507.03197"
    icon: "ai ai-arxiv"
  - name: "GitHub"
    link: "https://github.com/Jiarui0923/QCAI"
    icon: "fa-brands fa-github"
  - name: "Poster"
    link: "ICLR2026QCAI_POSTER_20260416_04.pdf"
    icon: "fa-solid fa-image"
  - name: "PDF"
    link: "li2026quantifying.pdf"
    icon: "fa-solid fa-file-pdf"
citations:
  Bibtex: |
    @inproceedings{"li2026quantifying,
      title={Quantifying Cross-Attention Interaction in Transformers for Interpreting TCR-pMHC Binding},
      author={Li, Jiarui and Yin, Zixiang and Smith, Haley and Ding, Zhengming and Landry, Samuel J and Mettu, Ramgopal R},
      booktitle={In Proceedings of The Fourteenth International Conference on Learning Representations},
      pages={1--10},
      year={2026}
    }
  APA: "Li, J., Yin, Z., Smith, H., Ding, Z., Landry, S. J., & Mettu, R. R. (2026). Quantifying Cross-Attention Interaction in Transformers for Interpreting TCR-pMHC Binding. In Proceedings of The Fourteenth International Conference on Learning Representations (pp. 1-10)."
document:
  centered: false
  footer: "CC BY 4.0"
nav:
  Home: "/"
  Papers: "/papers/"
  ICLR 2026: null
---

CD8+ killer T cells and CD4+ helper T cells play a central role in the adaptive immune system by recognizing antigens presented by Major Histocompatibility Complex (pMHC) molecules via T Cell Receptors (TCRs). Modeling binding between T cells and the pMHC complex is fundamental to understanding basic mechanisms of human immune response as well as in developing therapies. While transformer-based  models such as TULIP have achieved impressive performance in this domain, their black-box nature precludes  interpretability and thus limits a deeper mechanistic understanding of T cell response. 
Most existing post-hoc explainable AI (XAI) methods are confined to encoder-only, co-attention, or model-specific architectures and cannot handle encoder-decoder transformers used in TCR-pMHC modeling. To address this gap, we propose Quantifying Cross-Attention Interaction (QCAI), a new post-hoc method designed to interpret the cross-attention mechanisms in transformer decoders. Quantitative evaluation is a challenge for XAI methods; we have compiled TCR-XAI, a benchmark consisting of 274 experimentally determined TCR-pMHC structures to serve as ground truth for binding. Using these structures we compute physical distances between relevant amino acid residues in the TCR-pMHC interaction region and evaluate how well our method and others estimate the importance of residues in this region across the dataset. We show that QCAI achieves state-of-the-art performance on both interpretability and prediction accuracy under the TCR-XAI benchmark. 

![intro](./images/intro.png)
_**Quantifying Cross-Attention Interaction (QCAI)** is a post-hoc explanation method designed for cross-attention mechanisms. In this paper, we show that QCAI enables insight into the structural basis for TCR-pMHC binding._

![poster](./images/ICLR2026QCAI_POSTER_20260416_04.png)