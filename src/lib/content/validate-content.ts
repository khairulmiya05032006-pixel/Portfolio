import {
  ProfileSchema,
  ProjectSchema,
  SkillSchema,
  EducationSchema,
  BlogFrontmatterSchema,
} from '@/types/content'

export function validateProfile(data: unknown) {
  return ProfileSchema.parse(data)
}

export function validateProject(data: unknown) {
  return ProjectSchema.parse(data)
}

export function validateSkill(data: unknown) {
  return SkillSchema.parse(data)
}

export function validateEducation(data: unknown) {
  return EducationSchema.parse(data)
}

export function validateBlogFrontmatter(data: unknown) {
  return BlogFrontmatterSchema.parse(data)
}
