import type { Profile } from '@/types/content'

export const profile: Profile = {
  name: 'Khairul Miya',
  headline: 'Full-stack developer in progress',
  summary:
    'A BCA student learning to build useful web products through front-end and back-end development.',
  role: 'Full-stack developer in progress',
  introduction:
    'A BCA student learning to build useful web products through front-end and back-end development.',
  about:
    'I am a third-year BCA student, graduating in 2027, with a growing interest in taking an idea from a clear interface to dependable application logic. My current practice combines small JavaScript experiments with a documented full-stack system.',
  contact:
    'I’m interested in opportunities to learn, contribute, and build thoughtful web products.',
  socialLinks: [],
  resumePath: '/resume/resume.pdf',
  profileImage: '/images/khairul-portrait.png',
}

export const aboutText = profile.about!
export const contactText = profile.contact!

export const factCards = [
  { value: '2027', label: 'Expected BCA graduation' },
  { value: '01', label: 'Full-stack system documented' },
  { value: '04', label: 'JavaScript mini-projects documented' },
  { value: 'Focus', label: 'Full-stack web development' },
] as const
