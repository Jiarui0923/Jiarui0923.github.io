---
layout: paper
has_breadcrumb: true
has_is_mono: true
paper:
  title: "Rational Multi-Modal Transformers for TCR-pMHC Prediction"
  publication: "The ACM Conference on Bioinformatics, Computational Biology, and Health Informatics"
  date:
    month: December
    year: 2025
  abbr: "ACM BCB"
  pubicon: "images/ACMBCB-2025.jpg"
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
    link: "https://dl.acm.org/doi/10.1145/3765612.3767194"
    icon: "ai ai-acm"
    expand: true
  - name: "PubMed"
    link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12486057/"
    icon: "ai ai-pubmed"
    expand: false
  - name: "GitHub"
    link: "https://github.com/Tulane-Mettu-Landry-Lab/tcr-rational"
    icon: "fa-brands fa-github"
  - name: "HuggingFace"
    link: "https://huggingface.co/jli78/EGM/"
    icon: "fa-brands fa-hugging-face"
  - name: "arXiv"
    link: "https://arxiv.org/abs/2509.17305"
    icon: "ai ai-arxiv"
  - name: "PDF"
    link: "li2025rational.pdf"
    icon: "fa-solid fa-file-pdf"
citations:
  Bibtex: |
    @inproceedings{li2025rational,
      title={Rational Multi-Modal Transformers for TCR-pMHC Prediction},
      author={Li, Jiarui and Yin, Zixiang and Ding, Zhengming and Landry, Samuel J and Mettu, Ramgopal R},
      booktitle={Proceedings of the 16th ACM International Conference on Bioinformatics, Computational Biology and Health Informatics},
      pages={1--10},
      year={2025}
    }
  APA: "Li, J., Yin, Z., Ding, Z., Landry, S. J., & Mettu, R. R. (2025). Rational Multi-Modal Transformers for TCR-pMHC Prediction. In Proceedings of the 16th ACM International Conference on Bioinformatics, Computational Biology and Health Informatics (pp. 1-10)."
document:
  centered: false
  footer: "CC BY 4.0"
nav:
  Home: "/"
  Papers: "/papers/"
  ACM BCB 2025: null
---

T cell receptor (TCR) recognition of peptide-MHC (pMHC) complexes is central to immunity and T cell-based therapies. We introduce an explanation-driven framework that uses a new post-hoc analysis method to guide the design of a novel encoder-decoder transformer for TCR-pMHC prediction. By revealing the most informative TCR-epitope features, our method optimizes cross-attention design, auxiliary objectives, and an explanation-based early-stopping strategy. The resulting model achieves state-of-the-art accuracy with improved robustness and interpretability, offering new insight into sequence-level binding mechanisms.

![pipeline-intro](./images/intro.png)
_The overall pipline of development of a multi-modal transformer model for TCR-pMHC binding prediction._