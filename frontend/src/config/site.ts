// Centralized configuration and portfolio data for MANAS MISHRA
// Purely truthful: only verified education, actual projects, real certifications, and real skills.

export interface ProjectItem {
  slug: string;
  number: string;
  title: string;
  tagline: string;
  category: "Machine Learning" | "Data Science" | "Full-Stack Web" | "Creative Tech" | "Systems";
  year: string;
  status: "Completed" | "In Active Development" | "Research Prototype";
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  description: string;
  architecture: string;
  keyFeatures: string[];
  technicalChallenges: string;
  metrics?: { label: string; value: string }[];
  accentColor: string;
  imageUrl?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  category: "Data & Analytics" | "Databases" | "Software Engineering" | "Systems";
  skillsCovered: string[];
  verified: boolean;
  highlight: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  description: string;
  year: string;
  badgeType: string;
}

export interface NoteItem {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
  content: string;
}

export const SITE_CONFIG = {
  name: "MANAS MISHRA",
  firstName: "Manas",
  lastName: "Mishra",
  handle: "manasmishra16",
  tagline: "DATA → INTELLIGENCE → APPLICATION",
  headline: "Computer Science Engineer building intelligent ML systems, data architectures, and immersive web experiences.",
  email: "manasmishra16@gmail.com",
  github: "https://github.com/manasmishra16",
  linkedin: "https://linkedin.com/in/manasmishra16",
  education: {
    degree: "Bachelor of Engineering in Computer Science & Engineering",
    institution: "KS Institute of Technology",
    location: "Bengaluru, Karnataka, India",
    coordinates: "12°58'N 77°35'E",
    expectedGraduation: "2027",
    cgpa: "7.72",
    status: "Undergraduate (3rd Year)",
  },
  roles: [
    "Software Developer",
    "Data / ML Engineer",
    "Full-Stack Developer",
    "Creative Technologist",
  ],
  statusMessage: "OPEN FOR INTERNSHIPS & COLLABORATIONS // 2026—2027",
};

export const SKILLS_CONFIG = {
  programming: [
    { name: "Java", level: "Advanced", description: "OOPs, Data Structures, Collections, System Design" },
    { name: "Python", level: "Advanced", description: "NumPy, Pandas, Scikit-learn, TensorFlow, Scripting" },
    { name: "JavaScript / TypeScript", level: "Proficient", description: "ES6+, Async I/O, Strong Type Systems" },
    { name: "C / C++", level: "Intermediate", description: "Memory Management, Low-level Algorithms" },
  ],
  dataAndML: [
    { name: "TensorFlow", level: "Proficient", description: "Deep Learning, CNN & LSTM neural network architectures" },
    { name: "Scikit-learn", level: "Advanced", description: "Classification, Regression, Clustering, Pipelines" },
    { name: "Pandas & NumPy", level: "Advanced", description: "Data Wrangling, High-throughput Feature Engineering" },
    { name: "Machine Learning", level: "Advanced", description: "Model Evaluation, Cross-validation, Hyperparameter Tuning" },
    { name: "R Programming", level: "Intermediate", description: "Statistical Computing, Exploratory Data Analysis" },
  ],
  webAndFrontend: [
    { name: "React 19", level: "Advanced", description: "Hooks, Concurrent Rendering, Component Architecture" },
    { name: "Next.js (App Router)", level: "Advanced", description: "Server Components, Route Handlers, SSR/SSG" },
    { name: "Three.js / React Three Fiber", level: "Proficient", description: "WebGL Shaders, 3D Mathematics, 60fps Performance" },
    { name: "Tailwind CSS", level: "Advanced", description: "Responsive Systems, Fluid Typography, Design Tokens" },
    { name: "HTML5 / CSS3", level: "Advanced", description: "Semantic Accessibility, Layout Engines, Animation" },
  ],
  backendAndAPIs: [
    { name: "FastAPI", level: "Proficient", description: "Asynchronous REST Endpoints, Pydantic, OpenAPI Specs" },
    { name: "Flask", level: "Proficient", description: "Microservices, ML Model Inference Serving" },
    { name: "RESTful API Design", level: "Advanced", description: "Stateless Arch, Status Codes, CORS, Authentication" },
  ],
  databaseAndCloud: [
    { name: "PostgreSQL", level: "Proficient", description: "Relational Schemas, Constraints, Window Functions" },
    { name: "Supabase", level: "Proficient", description: "Row-Level Security, Realtime Subscriptions, Auth" },
    { name: "SQL", level: "Advanced", description: "Complex Queries, Aggregations, Joins, Query Optimization" },
  ],
  toolsAndWorkflow: [
    { name: "Git & GitHub", level: "Advanced", description: "Version Control, Feature Branching, Open Source" },
    { name: "Linux / Unix OS", level: "Proficient", description: "Shell Scripting, CLI Environments, Process Control" },
    { name: "PowerShell", level: "Intermediate", description: "Windows Automation, Build Pipelines" },
    { name: "Vercel", level: "Proficient", description: "CI/CD Deployment, Edge Function Orchestration" },
  ],
};

export const CERTIFICATIONS_DATA: CertificationItem[] = [
  {
    id: "cert-google-analytics",
    title: "Google Data Analytics Professional",
    issuer: "Google",
    category: "Data & Analytics",
    skillsCovered: ["Data Analysis", "Spreadsheets", "SQL", "Tableau", "R Programming"],
    verified: true,
    highlight: "Comprehensive 8-course credential covering end-to-end data preparation, statistical analysis, and visual storytelling.",
  },
  {
    id: "cert-ibm-sql",
    title: "IBM Databases and SQL for Data Science",
    issuer: "IBM",
    category: "Databases",
    skillsCovered: ["Relational Databases", "SQL", "Database Design", "Stored Procedures"],
    verified: true,
    highlight: "Practical expertise in relational database architecture, multi-table joins, subqueries, and database performance tuning.",
  },
  {
    id: "cert-infosys-java",
    title: "Java Object-Oriented Programming (OOPs)",
    issuer: "Infosys Springboard",
    category: "Software Engineering",
    skillsCovered: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction", "Collections"],
    verified: true,
    highlight: "Rigorous certification covering modular software design patterns and robust object-oriented architecture in Java.",
  },
  {
    id: "cert-infosys-r",
    title: "R Programming for Data Science",
    issuer: "Infosys Springboard",
    category: "Data & Analytics",
    skillsCovered: ["R Syntax", "Vectorized Operations", "Dataframes", "Statistical Visualization"],
    verified: true,
    highlight: "Hands-on mastery in statistical computing, data transformation pipelines, and exploratory data analysis using R.",
  },
  {
    id: "cert-infosys-linux",
    title: "Unix / Linux Operating System Fundamentals",
    issuer: "Infosys Springboard",
    category: "Systems",
    skillsCovered: ["POSIX Shell", "File Systems", "Permissions", "Process Scheduling", "Bash Scripting"],
    verified: true,
    highlight: "In-depth understanding of operating system internals, command-line toolchain, shell scripting, and server administration.",
  },
];

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: "ach-google-cloud",
    title: "Google Cloud Arcade Milestones",
    organization: "Google Cloud",
    description: "Earned hands-on technical skill badges across Google Cloud computing, identity management, compute engines, and cloud architecture labs.",
    year: "2024—2025",
    badgeType: "Cloud Computing & DevOps",
  },
  {
    id: "ach-academic-merit",
    title: "Consistent Academic Standing (7.72 CGPA)",
    organization: "KS Institute of Technology, Bengaluru",
    description: "Maintained strong academic performance in core Computer Science subjects including Algorithms, Operating Systems, Database Management, and Mathematics.",
    year: "2023—Present",
    badgeType: "Academic Performance",
  },
  {
    id: "ach-open-source",
    title: "Open Source ML & Full-Stack Projects",
    organization: "GitHub (@manasmishra16)",
    description: "Actively authoring and publishing reproducible machine learning models, custom full-stack allocation systems, and experimental 3D spatial web architectures.",
    year: "2024—Present",
    badgeType: "Open Source Engineering",
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: "heart-disease-prediction",
    number: "01",
    title: "Heart Disease Prediction",
    tagline: "Hybrid CNN-LSTM Deep Learning & Flask Clinical Risk Inference Pipeline",
    category: "Machine Learning",
    year: "2024",
    status: "Completed",
    technologies: ["TensorFlow", "CNN", "LSTM", "Flask", "Python", "NumPy", "Pandas"],
    githubUrl: "https://github.com/manasmishra16/Heart-disease-prediction",
    description:
      "A clinical risk assessment platform powered by hybrid neural network architectures. Combines Convolutional Neural Networks (CNNs) for spatial feature extraction across cardiovascular indicators with Long Short-Term Memory (LSTM) layers to model temporal sequence dependencies. Deployed via a lightweight, low-latency Flask inference server.",
    architecture:
      "Data Preprocessing & Standard Scaling → 1D CNN Spatial Conv Layers → Bidirectional LSTM Temporal Memory Units → Dense Sigmoid Classification Layer → REST API Endpoint via Flask.",
    keyFeatures: [
      "Hybrid deep learning architecture combining convolutional and recurrent neural units",
      "Automated clinical data normalization, outlier clipping, and missing indicator imputation",
      "Stateless REST inference API exposing sub-20ms prediction latency",
      "Interpretable prediction output with probability score metrics",
    ],
    technicalChallenges:
      "Preventing overfitting on tabular clinical datasets by introducing batch normalization, tuned dropout rates, and L2 weight regularization.",
    metrics: [
      { label: "Architecture", value: "CNN + LSTM" },
      { label: "Backend", value: "Flask Microservice" },
      { label: "Framework", value: "TensorFlow 2.x" },
    ],
    accentColor: "#ff5a1f",
    imageUrl: "/images/projects/heart-disease-prediction.jpg",
  },
  {
    slug: "mangoml-disease-prediction",
    number: "02",
    title: "MangoML Disease Prediction",
    tagline: "Automated Crop Pathology Classification with TypeScript Frontend",
    category: "Data Science",
    year: "2024",
    status: "Completed",
    technologies: ["Scikit-learn", "Pandas", "Machine Learning", "TypeScript", "React", "Python"],
    githubUrl: "https://github.com/manasmishra16/mango-frontend",
    liveUrl: "https://mango-frontend-flax.vercel.app",
    description:
      "An end-to-end agricultural machine learning diagnostic tool engineered to identify foliar mango crop diseases from biological data features. Features an automated data preprocessing pipeline and a responsive, modern TypeScript/React web client for field diagnosis.",
    architecture:
      "Agricultural Dataset Ingestion → Exploratory Feature Engineering with Pandas → Ensemble ML Classifiers in Scikit-learn → Model Serialization → Client-Side Diagnostic Interface on Vercel.",
    keyFeatures: [
      "Automated feature extraction and class-imbalance mitigation",
      "Comparative benchmark across Random Forests, SVMs, and Gradient Boosting algorithms",
      "Interactive, responsive web application built with TypeScript and React",
      "Instant visual disease classification and mitigation guidelines",
    ],
    technicalChallenges:
      "Balancing high diagnostic accuracy with rapid inferencing suitable for rural/mobile agricultural network conditions.",
    metrics: [
      { label: "Client Stack", value: "TypeScript / React" },
      { label: "ML Engine", value: "Scikit-Learn" },
      { label: "Deployment", value: "Vercel Production" },
    ],
    accentColor: "#ff7700",
    imageUrl: "/images/projects/mangoml-disease-prediction.jpg",
  },
  {
    slug: "pg-hostel-allocation-system",
    number: "03",
    title: "PG & Hostel Allocation System",
    tagline: "Full-Stack Accommodation & Maintenance Management Architecture",
    category: "Full-Stack Web",
    year: "2024",
    status: "Completed",
    technologies: ["React", "PostgreSQL", "Supabase", "PLpgSQL", "Tailwind CSS"],
    githubUrl: "https://github.com/manasmishra16/pg-hostel-allocation-system",
    description:
      "A complete institutional room allocation and student grievance resolution platform. Built with a React frontend and backed by PostgreSQL on Supabase, leveraging stored procedures and database triggers for atomic room allocations and state transitions.",
    architecture:
      "React Frontend (Tailwind UI) ⇄ Supabase Client SDK with Row-Level Security ⇄ PostgreSQL Relational Engine with PLpgSQL Triggers & Foreign Key Constraints.",
    keyFeatures: [
      "Atomic transactional room allocation preventing double-booking race conditions",
      "Role-based access control separating student residents from hostel administrators",
      "Real-time maintenance ticket escalation pipeline",
      "PostgreSQL audit trails and relational schema integrity",
    ],
    technicalChallenges:
      "Designing concurrent reservation locks using database constraints to ensure ACID compliance during high-traffic room selection cycles.",
    metrics: [
      { label: "Database", value: "PostgreSQL (PLpgSQL)" },
      { label: "Backend BaaS", value: "Supabase" },
      { label: "Frontend", value: "React" },
    ],
    accentColor: "#ff5a1f",
    imageUrl: "/images/projects/pg-hostel-allocation-system.jpg",
  },
  {
    slug: "zero-g-spatial-portfolio",
    number: "04",
    title: "Zero-Gravity 3D Spatial Portfolio",
    tagline: "High-Performance 60 FPS WebGL Workstation & Brutalist Experience",
    category: "Creative Tech",
    year: "2026",
    status: "Completed",
    technologies: ["Next.js 16", "React 19", "Three.js", "React Three Fiber", "Tailwind CSS", "Web Audio API"],
    githubUrl: "https://github.com/manasmishra16/portfolio",
    liveUrl: "http://localhost:3001",
    description:
      "A luxury technical developer portfolio built with zero-gravity 3D WebGL physics, procedural brutalist concrete cinder block geometry, and an animated developer workstation canvas display. Powered by custom synthesized Web Audio API sound synthesis and server-side cached GitHub telemetry.",
    architecture:
      "Next.js App Router (Turbopack) → Three.js / R3F Canvas with Parallax Mouse Rig → Procedural Bump Shader Textures → Dynamic High-Res Screen Buffer → REST Telemetry Route Handlers.",
    keyFeatures: [
      "Procedural double-chamber brutalist concrete cinder blocks with bump-mapped stone aggregate",
      "3D developer workstation laptop displaying real-time animated telemetry and project commands",
      "Multi-point studio chiaroscuro lighting with interactive preset switching",
      "Pure synthetic Web Audio API acoustic feedback without external audio file bloat",
      "Live server-side GitHub profile and repository caching",
    ],
    technicalChallenges:
      "Maintaining smooth 60 FPS frame rates across diverse GPUs while running contact shadow passes and dynamic canvas textures simultaneously.",
    metrics: [
      { label: "Frame Rate", value: "60 FPS Constant" },
      { label: "3D Engine", value: "Three.js / Drei" },
      { label: "Routing", value: "Next.js 16 App Router" },
    ],
    accentColor: "#ff7700",
    imageUrl: "/images/projects/zero-g-spatial-portfolio.jpg",
  },
];

export const NOTES_DATA: NoteItem[] = [
  {
    slug: "cnn-lstm-clinical-signals",
    title: "Architecting Hybrid CNN-LSTM Neural Networks for Tabular Medical Risk",
    date: "August 2024",
    readTime: "6 min read",
    summary:
      "Why combining spatial convolutional filters with temporal recurrent gates can capture multi-dimensional clinical indicators better than standalone trees or vanilla MLPs.",
    tags: ["Deep Learning", "TensorFlow", "Healthcare AI", "Python"],
    content: `
### The Challenge of Clinical Signal Representation
Cardiovascular risk modeling often deals with composite tabular telemetry: systolic and diastolic blood pressure, serum cholesterol levels, resting ECG signals, and peak exercise heart rates.

While traditional decision tree ensembles (like XGBoost) handle disjoint tabular variables effectively, they frequently struggle with local cross-feature correlation patterns that convolutional kernels excel at detecting.

### The Hybrid Pipeline Architecture
By structuring patient diagnostic indicators into a pseudo-temporal normalized tensor:
1. **1D Convolutional Layers:** Extract regional interactions between adjacent physiological markers (e.g., blood pressure ratios in relation to age and ST depression).
2. **Batch Normalization & Leaky ReLU:** Maintain stable internal covariate shifts and prevent dying gradient issues.
3. **Bidirectional LSTM:** Sequential gates model forward and backward dependencies across patient diagnostic records, allowing the network to retain persistent signals.
4. **Dense Sigmoid Output:** Emits calibrated calibrated probability distributions for clinical decision support.

### Practical Engineering Learnings
During model training, the most significant performance bottleneck wasn't model depth—it was learning rate scheduling and aggressive regularization. Introducing an adaptive Cosine Annealing learning rate schedule paired with spatial dropout (0.3) reduced validation loss by 18% while eliminating validation divergence.
    `,
  },
  {
    slug: "automating-ml-pipelines-mangoml",
    title: "Automating Feature Transformation & Ensemble Benchmarks in MangoML",
    date: "June 2024",
    readTime: "5 min read",
    summary:
      "Key lessons learned while building MangoML: automating missing value strategies, handling skewed distributions, and deploying low-latency web interfaces.",
    tags: ["Machine Learning", "Scikit-Learn", "Python", "Data Science"],
    content: `
### Agricultural Diagnostics at Scale
In agricultural data science, ground-truth datasets are often noisy, collected under varying environmental light conditions, and exhibit severe class imbalances between common and rare foliage pathologies.

### Building the Automated Pipeline
To make MangoML reproducible:
- **Automated Variance Thresholding:** Automatically strips out non-informative or near-zero variance attributes before training.
- **Robust Scaler Transformers:** Unlike standard z-score normalization which is sensitive to agricultural outliers, we implemented quartile-based scaling.
- **Stratified K-Fold Validation:** Ensured that rare pathology samples were proportionally represented in every single validation split.

### Deploying the Interface
Rather than keeping the model in an isolated Jupyter notebook, exposing it through an intuitive TypeScript client on Vercel enabled practical testing, bridging the gap between raw Python algorithms and accessible software.
    `,
  },
  {
    slug: "zero-g-webgl-shaders-threejs",
    title: "Engineering Zero-Gravity 3D WebGL Workstations in Next.js & Three.js",
    date: "September 2024",
    readTime: "8 min read",
    summary:
      "How to render procedural concrete materials, dynamic high-resolution workstation canvases, and studio chiaroscuro lighting at a smooth 60 FPS in React Three Fiber.",
    tags: ["WebGL", "Three.js", "Creative Tech", "Next.js", "Performance"],
    content: `
### Beyond Static 2D Portfolios
Modern developer portfolios often default to identical flat cards. By treating the browser as a real-time 3D spatial viewport, we can communicate engineering prowess, aesthetic discipline, and technical rigor simultaneously.

### The Procedural Concrete CMU Shader
Instead of downloading heavy multi-megabyte 4K texture packs, the concrete cinder blocks in this portfolio are synthesized procedurally in memory:
- A custom 2D canvas generates micro-pores, basalt aggregate flecks, and uneven curing tones.
- Applied as both an albedo map and a high-frequency bump map to an extruded double-chamber Three.js Shape.
- This results in zero network asset download latency while delivering tangible brutalist texture.

### Dynamic 2048x1280 Workstation Screen Buffer
The laptop screen renders a live HTML Canvas texture refreshed every animation frame:
- Real-time command prompt typing simulation
- Dynamic rotating badge with trigonometric circular path projection
- Clearcoat physical glass material on top that reflects the directional key light and ambient amber rim.
    `,
  },
];
