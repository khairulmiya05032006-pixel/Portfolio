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
    tagline: 'Full-Stack Developer & BCA Student',
    bio: 'Building clean web applications, responsive user interfaces, and dependable backend systems with React, Node.js, and TypeScript.',
    location: 'India',
    availability: 'Open to opportunities',
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
      title: 'Frontend Development',
      subtitle: 'Responsive Interfaces & Clean UI',
      description: 'Building fast, accessible web interfaces using React, Next.js, TypeScript, and modern CSS/SCSS.',
      tags: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'SCSS'],
      icon: 'frontend',
    },
    {
      id: 'backend',
      title: 'Backend & APIs',
      subtitle: 'REST APIs & Server Logic',
      description: 'Developing RESTful APIs with Node.js and Express, implementing authentication, routes, and data validation.',
      tags: ['Node.js', 'Express', 'JWT', 'REST APIs'],
      icon: 'backend',
    },
    {
      id: 'database',
      title: 'Databases & Storage',
      subtitle: 'Schema Design & Queries',
      description: 'Designing relational databases in MySQL, organizing tables, and writing clean queries for application data.',
      tags: ['MySQL', 'Data Modeling', 'SQL Queries'],
      icon: 'database',
    },
    {
      id: 'creative',
      title: 'Interactive Web Tech',
      subtitle: 'Motion & 3D Elements',
      description: 'Adding engaging animations and interactive visual components using Three.js and GSAP.',
      tags: ['Three.js', 'GSAP', 'WebGL', 'Animations'],
      icon: 'creative',
    },
  ],
  career: [
    {
      id: 'edu-bca',
      period: '2024 — 2027',
      role: 'Bachelor of Computer Applications (BCA)',
      company: 'University',
      description: 'Studying core computer science subjects including data structures, algorithms, databases, and software engineering.',
      technologies: ['C++', 'Data Structures', 'DBMS', 'Web Development'],
      type: 'education',
    },
    {
      id: 'proj-amana',
      period: '2025 — 2026',
      role: 'Full-Stack Developer',
      company: 'Amana Capital (Loan Management Project)',
      description: 'Developed a loan management web platform to track customer records, loan disbursements, and automated EMI calculations.',
      technologies: ['Node.js', 'Express', 'MySQL', 'JWT', 'HTML5/CSS3'],
      type: 'project',
    },
    {
      id: 'proj-mini',
      period: '2025',
      role: 'Frontend Projects',
      company: 'Interactive Web Tools',
      description: 'Built interactive client-side web tools exploring DOM manipulation, modern JavaScript patterns, and responsive layouts.',
      technologies: ['JavaScript ES6+', 'DOM APIs', 'CSS3', 'Canvas'],
      type: 'project',
    },
  ],
  projects: [
    {
      id: 'amana-capital',
      slug: 'amana-capital',
      title: 'Amana Capital',
      category: 'Loan Management System',
      description: 'A web application for tracking microfinance loans, customer records, and automated EMI calculations with secure authentication.',
      technologies: ['Node.js', 'Express', 'MySQL', 'JWT Auth', 'REST API'],
      liveUrl: '#',
      githubUrl: 'https://github.com',
      featured: true,
      metrics: 'Full-Stack Web Application',
      image: '/images/projects/amana-capital.webp',
    },
    {
      id: 'javascript-mini-projects',
      slug: 'javascript-mini-projects',
      title: 'Interactive Web Tools Suite',
      category: 'JavaScript Utilities',
      description: 'A collection of interactive web utilities demonstrating event handling, calculations, and responsive layouts.',
      technologies: ['JavaScript', 'DOM APIs', 'CSS3', 'Algorithms'],
      liveUrl: '#',
      githubUrl: 'https://github.com',
      featured: true,
      metrics: 'Interactive Web Tools',
      image: '/images/projects/js-projects.webp',
    },
    {
      id: 'visual-studies',
      slug: 'visual-studies',
      title: 'Visual Layout & UX Studies',
      category: 'Frontend Design & Layouts',
      description: 'Explorations in responsive web design, modern CSS grid and flexbox patterns, and clean dark-mode interfaces.',
      technologies: ['HTML5', 'SCSS', 'Responsive Design', 'CSS Grid'],
      liveUrl: '#',
      githubUrl: 'https://github.com',
      featured: false,
      metrics: 'Responsive Layouts',
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
