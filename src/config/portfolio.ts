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
  status?: 'live' | 'coming-soon'
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
    tagline: 'Full-Stack Developer & AI Enthusiast',
    bio: 'Building user-focused web applications with clean interfaces, reliable APIs, and maintainable backend systems.',
    location: 'India',
    availability: 'Open to opportunities',
    resumeUrl: '/resume/resume.pdf',
    portraitUrl: '/images/khairul-portrait-circle.png',
  },
  socials: [
    { platform: 'GitHub', url: 'https://github.com/khairulmiya05032006-pixel', label: 'khairulmiya05032006-pixel (Khairul Miya)' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/khairulmiya06/', label: 'linkedin.com/in/khairulmiya06' },
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
      id: 'fullstack',
      title: 'FULL-STACK DEVELOPMENT',
      subtitle: 'End-to-End Web Applications',
      description: 'Building complete web applications, from responsive user interfaces to robust backend systems. I focus on clean architecture, maintainable code, and seamless user experiences.',
      tags: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'REST APIs'],
      icon: 'frontend',
    },
    {
      id: 'backend',
      title: 'BACKEND ENGINEERING & APIS',
      subtitle: 'Server-Side Development',
      description: 'Developing reliable backend systems, RESTful APIs, authentication workflows, and business logic that keep applications secure, structured, and efficient.',
      tags: ['Node.js', 'Express', 'JWT', 'REST APIs', 'Authentication'],
      icon: 'backend',
    },
    {
      id: 'database',
      title: 'DATABASES & DATA ENGINEERING',
      subtitle: 'Data Modeling & Management',
      description: 'Designing structured data models, managing application databases, and writing efficient queries to support reliable data-driven applications.',
      tags: ['MongoDB', 'MySQL', 'PostgreSQL', 'SQL', 'Data Modeling'],
      icon: 'database',
    },
    {
      id: 'ai-interactive',
      title: 'AI ENGINEERING & INTERACTIVE TECHNOLOGIES',
      subtitle: 'Exploring Intelligent Experiences',
      description: 'Enthusiastic about AI engineering and its potential to transform modern applications. Exploring AI-powered features, intelligent workflows, and interactive experiences that make products more capable and intuitive.',
      tags: ['AI Integration', 'AI-powered Applications', 'Three.js', 'GSAP', 'WebGL'],
      icon: 'creative',
    },
  ],
  career: [
    {
      id: 'edu-bca',
      period: '2024 — 2027',
      role: 'Bachelor of Computer Applications (BCA)',
      company: 'Bengaluru City University',
      description: 'Pursuing a Bachelor of Computer Applications with a foundation in computer science, data structures, algorithms, database management, and software development.',
      technologies: ['Python', 'Data Structures', 'DBMS', 'Web Development'],
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
      description:
        'Amana Capital is an microfinance web application which gives users secure and trusted loans with customer record tracking and automated EMI calculations.',
      technologies: ['Node.js', 'Express', 'MySQL', 'JWT Auth', 'REST API'],
      liveUrl: 'https://app.amanacapital.in/',
      githubUrl: 'https://github.com/khairulmiya05032006-pixel/amana-capital-demo',
      featured: true,
      metrics: 'Full-Stack Web Application',
      image: '/images/projects/amana-capital.webp',
      status: 'live',
    },
    {
      id: 'spotify-clone',
      slug: 'spotify-clone',
      title: 'Spotify - Web Player: Music for everyone',
      category: 'Frontend Clone',
      description:
        'While learning HTML and CSS build a Spotify clone replicating the media controls, playlist navigation, and responsive audio player experience.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Audio UI'],
      liveUrl: 'https://khairulmiya05032006-pixel.github.io/spotify-clone/',
      githubUrl: 'https://github.com/khairulmiya05032006-pixel/spotify-clone',
      featured: true,
      metrics: 'Interactive Web Player',
      image: '/images/projects/spotify-clone.webp',
      status: 'live',
    },
    {
      id: 'javascript-mini-projects',
      slug: 'javascript-mini-projects',
      title: 'Interactive Web Tools Suite',
      category: 'JavaScript Utilities',
      description:
        'A collection of interactive web utilities demonstrating event handling, calculations, and responsive layouts.',
      technologies: ['JavaScript', 'DOM APIs', 'CSS3', 'Algorithms'],
      featured: false,
      metrics: 'Interactive Web Tools',
      image: '/images/projects/js-projects.webp',
      status: 'coming-soon',
    },
  ] as ProjectItem[],
  techStackItems: [
    { name: 'JavaScript', category: 'Language', color: '#f7df1e', bg: '#1c1917' },
    { name: 'TypeScript', category: 'Language', color: '#3178c6', bg: '#0f172a' },
    { name: 'Java', category: 'Language', color: '#ed8b00', bg: '#451a03' },
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
    { name: 'MUI', category: 'Frontend', color: '#007fff', bg: '#082f49' },
    { name: 'Sass/SCSS', category: 'Styling', color: '#cc6699', bg: '#4a044e' },
    { name: 'Git', category: 'Tools', color: '#f05032', bg: '#450a0a' },
    { name: 'GitHub', category: 'Tools', color: '#ffffff', bg: '#18181b' },
    { name: 'REST APIs', category: 'Architecture', color: '#34d399', bg: '#064e3b' },
    { name: 'CI/CD Pipeline', category: 'DevOps', color: '#2088ff', bg: '#082f49' },
    { name: 'Docker', category: 'DevOps', color: '#2496ed', bg: '#082f49' },
    { name: 'cPanel', category: 'Tools', color: '#ff6c2c', bg: '#431407' },
    { name: 'Redis', category: 'Database', color: '#dc382d', bg: '#450a0a' },
    { name: 'PostgreSQL', category: 'Database', color: '#336791', bg: '#0c4a6e' },
    { name: 'Redux', category: 'State', color: '#764abc', bg: '#2e1065' },
    { name: 'JWT Auth', category: 'Security', color: '#c084fc', bg: '#3b0764' },
    { name: 'Vite', category: 'Tooling', color: '#bd34fe', bg: '#3b0764' },
    { name: 'Postman', category: 'Tools', color: '#ff6c37', bg: '#431407' },
    { name: 'VS Code', category: 'Tools', color: '#007acc', bg: '#082f49' },
  ],
}
