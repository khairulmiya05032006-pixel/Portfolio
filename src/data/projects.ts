import type { Project } from '@/types/content'

export const projects: Project[] = [
  {
    id: 'amana-capital',
    number: '01',
    slug: 'amana-capital',
    name: 'Amana Capital',
    title: 'Amana Capital',
    shortDescription: 'Microfinance loan management web application.',
    description:
      'A Node.js and Express web application for customer management, loan application tracking, payment processing, and reporting.',
    context: 'Learning project · microfinance loan management',
    built:
      'A Node.js and Express web application for customer management, loan application tracking, payment processing, and reporting.',
    technologies: ['Node.js', 'Express', 'MySQL', 'JWT authentication'],
    learned:
      'How customer records, loan applications, payments, and reports connect through a full-stack system.',
    featured: true,
    status: 'completed',
    skillIds: ['nodejs', 'express', 'mysql'],
    thumbnail: '/images/projects/amana-capital.webp',
  },
  {
    id: 'javascript-mini-projects',
    number: '02',
    slug: 'javascript-mini-projects',
    name: 'JavaScript Mini Projects',
    title: 'JavaScript Mini Projects',
    shortDescription: 'Browser interaction practice projects.',
    description:
      'A Digital Clock, Background Color Generator, Random Quote Generator, and Income Tax Calculator.',
    context: 'Practice projects · browser interaction',
    built:
      'A Digital Clock, Background Color Generator, Random Quote Generator, and Income Tax Calculator.',
    technologies: ['JavaScript', 'DOM APIs', 'Event handling', 'Conditional logic'],
    learned:
      'Core interaction patterns, live updates, and readable client-side logic.',
    featured: false,
    status: 'completed',
    skillIds: ['javascript'],
    thumbnail: '/images/projects/js-projects.webp',
  },
  {
    id: 'visual-studies',
    number: '03',
    slug: 'visual-studies',
    name: 'Visual Studies',
    title: 'Visual Studies',
    shortDescription: 'Responsive front-end layout studies.',
    description:
      'A Spotify clone and an Apna Studio photography website as exercises in interface composition.',
    context: 'Responsive front-end studies',
    built:
      'A Spotify clone and an Apna Studio photography website as exercises in interface composition.',
    technologies: ['HTML', 'CSS', 'Responsive layout'],
    learned:
      'How structure, spacing, and responsive behaviour shape a clear visual experience.',
    featured: false,
    status: 'completed',
    skillIds: ['html', 'css'],
    thumbnail: '/images/projects/visual-studies.webp',
  },
]

export const structuredProjects = projects
