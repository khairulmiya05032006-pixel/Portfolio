import type { SkillGroup, TechnicalSkill, Skill } from '@/types/content'

export const skills: Skill[] = [
  { id: 'javascript', name: 'JavaScript', category: 'frontend' },
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend' },
  { id: 'html', name: 'HTML', category: 'frontend' },
  { id: 'css', name: 'CSS', category: 'frontend' },
  { id: 'tailwind', name: 'Tailwind', category: 'frontend' },
  { id: 'nodejs', name: 'Node.js', category: 'backend' },
  { id: 'express', name: 'Express', category: 'backend' },
  { id: 'mysql', name: 'MySQL', category: 'database' },
  { id: 'git', name: 'Git', category: 'tools' },
  { id: 'github', name: 'GitHub', category: 'tools' },
]

export const skillGroups: SkillGroup[] = [
  {
    number: '01',
    title: 'Front-end',
    items: ['JavaScript', 'React', 'Next.js', 'HTML', 'CSS', 'Tailwind'],
    description: 'Responsive interfaces and practical browser interactions.',
  },
  {
    number: '02',
    title: 'Back-end',
    items: ['Node.js', 'Express', 'Authentication'],
    description: 'Application routes, logic, and protected user flows.',
  },
  {
    number: '03',
    title: 'Data',
    items: ['MySQL', 'Data-flow design'],
    description: 'Organising information for application features and reports.',
  },
  {
    number: '04',
    title: 'Workflow',
    items: ['Git', 'GitHub', 'Responsive UI', 'Performance-aware builds'],
    description: 'A thoughtful process for iterating on useful web products.',
  },
]

export const technicalSkills: TechnicalSkill[] = [
  { name: 'JavaScript', percentage: 75, category: 'Frontend' },
  { name: 'React', percentage: 70, category: 'Frontend' },
  { name: 'Next.js', percentage: 65, category: 'Frontend' },
  { name: 'HTML & CSS', percentage: 80, category: 'Frontend' },
  { name: 'Node.js', percentage: 65, category: 'Backend' },
  { name: 'Express', percentage: 60, category: 'Backend' },
  { name: 'MySQL', percentage: 55, category: 'Database' },
  { name: 'Git & GitHub', percentage: 70, category: 'Workflow' },
]
