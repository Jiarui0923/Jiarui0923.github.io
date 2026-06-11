---
layout: paper
has_breadcrumb: true
paper:
  title: "GPU Acceleration for Markov Chain Monte Carlo Sampling"
  publication: "Proceedings of the 4th International Conference on AI-ML Systems"
  date:
    month: October
    year: 2024
  abbr: "AIMLSys"
  pubicon: "images/AIML_logo.png"
authors:
  - name: "Jiarui Li"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://www.jiarui-li.com/"
  - name: "Samuel J. Landry"
    affiliation: "Department of Biochemistry and Molecular Biology, Tulane University School of Medicine"
    link: "https://medicine.tulane.edu/departments/biochemistry-molecular-biology-tulane-cancer-center-debakey/faculty/samuel-j-landry-phd"
  - name: "Ramgopal R. Mettu"
    affiliation: "Department of Computer Science, Tulane University"
    link: "https://ramgopalmettu.org/"
    corresponding: true
links:
  - name: "Paper"
    link: "https://dl.acm.org/doi/abs/10.1145/3703412.3703428"
    icon: "ai ai-acm"
    expand: true
  - name: "PDF"
    link: "li2025gpumcmc.pdf"
    icon: "fa-solid fa-file-pdf"
citations:
  Bibtex: |
    @inproceedings{li2024gpu,
      title={GPU Acceleration for Markov Chain Monte Carlo Sampling},
      author={Li, Jiarui and Landry, Samuel J. and Mettu, Ramgopal R.},
      booktitle={Proceedings of the 4th International Conference on AI-ML Systems (AIMLSystems 2024)},
      pages={14:1--14:8},
      year={2024},
      publisher={ACM},
      doi={10.1145/3703412.3703428}
    }
  APA: "Li, J., Landry, S. J., & Mettu, R. R. (2024). GPU Acceleration for Markov Chain Monte Carlo Sampling. In Proceedings of the 4th International Conference on AI-ML Systems (AIMLSystems 2024) (pp. 14:1–14:8). ACM. https://doi.org/10.1145/3703412.3703428"
document:
  centered: false
  footer: "CC BY 4.0"
nav:
  Home: "/"
  Papers: "/papers/"
  AIMLSys 2024: null
---

In areas such as molecular biology, computer vision, and natural language processing, graphs are commonly used to represent the structure of probability distributions (or their equivalents) that are too large to consider explicitly. In these settings, we are commonly interested in sampling from the distribution for various inference tasks. A typical approach is the use of Markov Chain Monte Carlo (MCMC) methods. The classic, uniprocessor, approach to MCMC still results in poor performance. While parallel approaches on CPU or GPU devices have been proposed, they are often designed for specific tasks and/or do not effectively utilize the inter-device communication capabilities of GPUs. We propose a novel, GPU-parallelizable MCMC method for this setting. Our approach makes use of a partitioning approach to divide the graph and dispatch the resulting sub-graphs to GPUs. Using the communication capabilities of GPUs (e.g., NVLink), we give a way to coordinate information between the computations over adjacent subgraphs and subsequently merge them. This approach takes advantage of the high degree of GPU parallelism while maintaining the generality of MCMC sampling. We demonstrate the performance of our approach for estimating protein conformational stability. Over four different benchmarks and two GPU platforms we show that our method achieves up to a 400% speedup over an adaptive Monte Carlo sampling method.

![pipeline-intro](./images/intro.jpg)
_Schematic of our approach._