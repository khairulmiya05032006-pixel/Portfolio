export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface ProjectItem {
  id: string
  slug: string
  title: string
  category: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  metrics?: string
  image: string
}

export interface ServiceItem {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  icon: string
}

export interface CareerItem {
  id: string
  period: string
  role: string
  company: string
  description: string
  technologies: string[]
  type: 'education' | 'experience' | 'project'
}

export const portfolioConfig = {
  profile: {
    name: 'Khairul Miya',
    tagline: 'Crafting High-Performance Full-Stack Applications & Immersive Digital Experiences',
    bio: 'Third-year BCA student (graduating 2027) passionate about modern web engineering, reactive UI systems, Node.js architectures, and interactive 3D web graphics.',
    location: 'India',
    availability: 'Available for internships, freelance, and junior developer roles',
    resumeUrl: '/resume/resume.pdf',
    portraitUrl: '/images/khairul-portrait.png',
  },
  socials: [
    { platform: 'GitHub', url: 'https://github.com', label: 'github.com/khairul' },
    { platform: 'LinkedIn', url: 'https://linkedin.com', label: 'linkedin.com/in/khairul' },
    { platform: 'Twitter', url: 'https://x.com', label: 'x.com/khairul' },
    { platform: 'Email', url: 'mailto:contact@khairul.dev', label: 'contact@khairul.dev' },
  ],
  navItems: [
    { label: 'Home', href: '#landing' },
    { label: 'About', href: '#about' },
    { label: 'What I Do', href: '#what-i-do' },
    { label: 'Career', href: '#career' },
    { label: 'Work', href: '#work' },
    { label: 'Tech Stack', href: '#tech-stack' },
    { label: 'Contact', href: '#contact' },
  ],
  services: [
    {
      id: 'frontend',
      title: 'Front-End Engineering',
      subtitle: 'Modern UI Architecture & State Management',
      description: 'Building blazing-fast, accessible interfaces using React 19, Next.js App Router, TypeScript, and modern CSS/SCSS modules.',
      tags: ['React 19', 'Next.js', 'TypeScript', 'Tailwind', 'SCSS Modules'],
      icon: 'frontend',
    },
    {
      id: 'backend',
      title: 'Back-End & API Systems',
      subtitle: 'Dependable Services & Secure Endpoints',
      description: 'Developing RESTful APIs with Node.js, Express, structured middleware, JWT authentication, and relational data schema designs.',
      tags: ['Node.js', 'Express', 'JWT', 'REST APIs', 'Rate Limiting'],
      icon: 'backend',
    },
    {
      id: 'database',
      title: 'Database & Data Modeling',
      subtitle: 'Structured Data Storage & Queries',
      description: 'Designing normalized relational schemas in MySQL, indexing for query speed, and writing transactional business logic for production integrity.',
      tags: ['MySQL', 'Data Modeling', 'Relational Schemas', 'Query Tuning'],
      icon: 'database',
    },
    {
      id: 'creative',
      title: 'Creative Technology & 3D',
      subtitle: 'Motion & Interactive Graphics',
      description: 'Bringing web experiences to life with Three.js, GSAP animations, shader accents, and physics-driven interactive canvas elements.',
      tags: ['Three.js', 'GSAP ScrollTrigger', 'WebGL', 'Physics Engines'],
      icon: 'creative',
    },
  ],
  career: [
    {
      id: 'edu-bca',
      period: '2024 — 2027',
      role: 'Bachelor of Computer Applications (BCA)',
      company: 'University',
      description: 'Third-year student with focus on algorithms, data structures, full-stack web software, and relational database systems.',
      technologies: ['C++', 'Data Structures', 'DBMS', 'Web Development'],
      type: 'education',
    },
    {
      id: 'proj-amana',
      period: '2025 — 2026',
      role: 'Full-Stack Developer & Architect',
      company: 'Amana Capital (Microfinance System)',
      description: 'Engineered a multi-module microfinance loan management system handling customer onboarding, loan disbursements, EMI calculation, and repayment verification.',
      technologies: ['Node.js', 'Express', 'MySQL', 'JWT', 'HTML5/CSS3'],
      type: 'project',
    },
    {
      id: 'proj-mini',
      period: '2025',
      role: 'JavaScript Core & Interactive Tooling',
      company: 'Browser Engineering Practice',
      description: 'Built performance-focused client tools exploring DOM update cycles, event lifecycles, and responsive component logic.',
      technologies: ['JavaScript ES6+', 'DOM APIs', 'Canvas', 'State Patterns'],
      type: 'project',
    },
  ],
  projects: [
    {
      id: 'amana-capital',
      slug: 'amana-capital',
      title: 'Amana Capital',
      category: 'Full-Stack Loan Management System',
      description: 'A production-grade web platform for microfinance loan disbursement tracking, customer record lifecycle, automated EMI calculations, and secure role-based staff operations.',
      technologies: ['Node.js', 'Express', 'MySQL', 'JWT Auth', 'REST API'],
      liveUrl: '#',
      githubUrl: 'https://github.com',
      featured: true,
      metrics: 'Full-Stack Architecture · Customer & Loan Flows',
      image: '/images/projects/amana-capital.webp',
    },
    {
      id: 'javascript-mini-projects',
      slug: 'javascript-mini-projects',
      title: 'Interactive Web Tools Suite',
      category: 'Client-Side Interaction & Algorithmic Utilities',
      description: 'A collection of interactive web utilities demonstrating event delegation, calculation pipelines, responsive layouts, and state management.',
      technologies: ['JavaScript', 'DOM APIs', 'CSS3', 'Algorithms'],
      liveUrl: '#',
      githubUrl: 'https://github.com',
      featured: true,
      metrics: '4 Complete Interactive Tools',
      image: '/images/projects/js-projects.webp',
    },
    {
      id: 'visual-studies',
      slug: 'visual-studies',
      title: 'Visual Layout & UX Studies',
      category: 'Interface Architecture & Styling',
      description: 'Deep-dive explorations of high-fidelity responsive composition, grid math, flex distribution, and dark-theme aesthetic systems.',
      technologies: ['HTML5', 'SCSS', 'Responsive Architecture', 'UX Design'],
      liveUrl: '#',
      githubUrl: 'https://github.com',
      featured: false,
      metrics: 'Pixel-Perfect Grid Composition',
      image: '/images/projects/visual-studies.webp',
    },
  ],
  techStackItems: [
    { name: 'JavaScript', category: 'Language', color: '#f7df1e', bg: '#1c1917' },
    { name: 'TypeScript', category: 'Language', color: '#3178c6', bg: '#0f172a' },
    { name: 'React', category: 'Frontend', color: '#61dafb', bg: '#082f49' },
    { name: 'Next.js', category: 'Framework', color: '#ffffff', bg: '#0a0a0a' },
    { name: 'Node.js', category: 'Backend', color: '#5fa04e', bg: '#052e16' },
    { name: 'Express', category: 'Backend', color: '#cccccc', bg: '#18181b' },
    { name: 'MySQL', category: 'Database', color: '#4479a1', bg: '#082f49' },
    { name: 'Three.js', category: '3D Graphics', color: '#a78bfa', bg: '#2e1065' },
    { name: 'GSAP', category: 'Motion', color: '#88ce02', bg: '#14532d' },
    { name: 'HTML5', category: 'Markup', color: '#e34f26', bg: '#431407' },
    { name: 'CSS3', category: 'Styling', color: '#1572b6', bg: '#0c4a6e' },
    { name: 'Tailwind', category: 'Styling', color: '#38bdf8', bg: '#082f49' },
    { name: 'Sass/SCSS', category: 'Styling', color: '#cc6699', bg: '#4a044e' },
    { name: 'Git', category: 'Tools', color: '#f05032', bg: '#450a0a' },
    { name: 'GitHub', category: 'Tools', color: '#ffffff', bg: '#18181b' },
    { name: 'REST APIs', category: 'Architecture', color: '#34d399', bg: '#064e3b' },
    { name: 'JWT Auth', category: 'Security', color: '#c084fc', bg: '#3b0764' },
    { name: 'Zod', category: 'Validation', color: '#3068b7', bg: '#172554' },
    { name: 'Webpack', category: 'Bundler', color: '#8dd6f9', bg: '#0f172a' },
    { name: 'Turbopack', category: 'Bundler', color: '#0070f3', bg: '#022c22' },
    { name: 'Vite', category: 'Tooling', color: '#bd34fe', bg: '#3b0764' },
    { name: 'Python', category: 'Language', color: '#3776ab', bg: '#1e3a8a' },
    { name: 'Docker', category: 'DevOps', color: '#2496ed', bg: '#082f49' },
    { name: 'Redis', category: 'Database', color: '#dc382d', bg: '#450a0a' },
    { name: 'GraphQL', category: 'API', color: '#e10098', bg: '#4a044e' },
    { name: 'Redux', category: 'State', color: '#764abc', bg: '#2e1065' },
    { name: 'Figma', category: 'Design', color: '#f24e1e', bg: '#431407' },
    { name: 'PostgreSQL', category: 'Database', color: '#336791', bg: '#0c4a6e' },
    { name: 'Prisma', category: 'ORM', color: '#2d3748', bg: '#0f172a' },
    { name: 'WebGL', category: '3D Graphics', color: '#990000', bg: '#450a0a' },
  ],
}
