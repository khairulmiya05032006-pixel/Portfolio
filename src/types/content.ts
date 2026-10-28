import { z } from 'zod'

// --- Zod schemas ---

export const ExternalLinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
})

export const ProfileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  summary: z.string(),
  location: z.string().optional(),
  email: z.string().email().optional(),
  socialLinks: z.array(ExternalLinkSchema),
  resumePath: z.string(),
  profileImage: z.string(),
  // Portfolio presentation fields
  role: z.string().optional(),
  introduction: z.string().optional(),
  about: z.string().optional(),
  contact: z.string().optional(),
})

export const ProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  featured: z.boolean(),
  status: z.enum(['completed', 'in-progress', 'archived']),
  skillIds: z.array(z.string()),
  thumbnail: z.string(),
  liveUrl: z.string().url().optional(),
  repositoryUrl: z.string().url().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // Presentation fields for existing portfolio UI
  number: z.string().optional(),
  name: z.string().optional(),
  context: z.string().optional(),
  built: z.string().optional(),
  learned: z.string().optional(),
  technologies: z.array(z.string()).optional(),
})

export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'other']),
  icon: z.string().optional(),
})

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  qualification: z.string(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['completed', 'in-progress']),
  details: z.array(z.string()).optional(),
})

export const BlogFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  slug: z.string(),
  tags: z.array(z.string()),
  coverImage: z.string().optional(),
  draft: z.boolean(),
  relatedProjectIds: z.array(z.string()).optional(),
})

// --- Inferred types ---
export type ExternalLink = z.infer<typeof ExternalLinkSchema>
export type Profile = z.infer<typeof ProfileSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Skill = z.infer<typeof SkillSchema>
export type Education = z.infer<typeof EducationSchema>
export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>

// --- Types for existing components compatibility ---
export type NavigationItem = {
  label: string
  href: string
  icon: 'home' | 'profile' | 'skills' | 'work' | 'blog' | 'contact'
}

export type SkillGroup = {
  number: string
  title: string
  items: string[]
  description: string
}

export type LegacyProject = Project

export type LearningNote = {
  number: string
  title: string
  excerpt: string
  tags: string[]
  treatment: 'signal' | 'system' | 'layout'
}

export type BlogArticle = {
  number: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  gradient: [string, string]
  content?: {
    overview: string
    keyPoints: string[]
    codeExample?: string
    takeaway: string
  }
}

export type TechnicalSkill = {
  name: string
  percentage: number
  category: 'Frontend' | 'Backend' | 'Database' | 'Workflow'
}
