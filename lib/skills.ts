// Two-tier skill assessment system

// 1. Student Self-Assessment (Simple)
export interface ExperienceLevel {
  key: string
  name: string
  description: string
  icon: string
  instructor_notes: string
}

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    key: 'complete_beginner',
    name: 'Complete Beginner',
    description: 'Never driven before or had minimal practice',
    icon: '👶',
    instructor_notes: 'Start from absolute basics: controls, starting/stopping, basic maneuvers'
  },
  {
    key: 'overseas_driver',
    name: 'Overseas Driver',
    description: 'Have license from another country, need NSW conversion',
    icon: '🌏',
    instructor_notes: 'Focus on NSW road rules, test requirements, local driving habits'
  },
  {
    key: 'learner',
    name: 'Learner Driver',
    description: 'Some experience, practicing for license test',
    icon: '📚',
    instructor_notes: 'Test preparation, advanced maneuvers, hazard perception'
  },
  {
    key: 'refresher',
    name: 'Refresher Course',
    description: 'Returning to driving after a break',
    icon: '🔄',
    instructor_notes: 'Regain confidence, update on road rules, modern vehicle features'
  },
  {
    key: 'advanced',
    name: 'Advanced Skills',
    description: 'Want to improve specific skills (parking, highways, etc.)',
    icon: '🚀',
    instructor_notes: 'Targeted skill development, defensive driving techniques'
  }
]

// 2. Instructor Detailed Assessment (17 skills)
export interface Skill {
  key: string
  name: string
  description: string
  category: 'foundation' | 'maneuvers' | 'road' | 'situations' | 'confidence'
  icon: string
}

export const DRIVING_SKILLS: Skill[] = [
  // Foundation Skills
  {
    key: 'mirrors',
    name: 'Mirrors',
    description: 'Checking mirrors regularly without forgetting',
    category: 'foundation',
    icon: '👁️'
  },
  {
    key: 'signals',
    name: 'Signals',
    description: 'Using indicators at the right time',
    category: 'foundation',
    icon: '✋'
  },
  {
    key: 'braking',
    name: 'Braking',
    description: 'Smooth, progressive braking technique',
    category: 'foundation',
    icon: '🦶'
  },
  {
    key: 'acceleration',
    name: 'Acceleration',
    description: 'Appropriate speed for conditions',
    category: 'foundation',
    icon: '⚡'
  },
  // Maneuvers
  {
    key: 'reverse',
    name: 'Reversing',
    description: 'Reversing straight and in turns',
    category: 'maneuvers',
    icon: '🔄'
  },
  {
    key: 'threepoint',
    name: 'Three-Point Turn',
    description: 'Completing a three-point turn safely',
    category: 'maneuvers',
    icon: '↩️'
  },
  {
    key: 'parallel',
    name: 'Parallel Parking',
    description: 'Parking between two cars',
    category: 'maneuvers',
    icon: '🅿️'
  },
  {
    key: 'parking',
    name: 'Parking (General)',
    description: 'All parking types including 90-degree',
    category: 'maneuvers',
    icon: '🅿️'
  },
  // Road Skills
  {
    key: 'lanechanges',
    name: 'Lane Changes',
    description: 'Changing lanes safely with proper checks',
    category: 'road',
    icon: '↔️'
  },
  {
    key: 'merging',
    name: 'Merging',
    description: 'Merging onto roads and highways',
    category: 'road',
    icon: '🔀'
  },
  {
    key: 'hazards',
    name: 'Hazard Perception',
    description: 'Spotting and responding to hazards early',
    category: 'road',
    icon: '⚠️'
  },
  {
    key: 'intersections',
    name: 'Intersections',
    description: 'Handling all intersection types',
    category: 'road',
    icon: '🚦'
  },
  // Situations
  {
    key: 'night',
    name: 'Night Driving',
    description: 'Driving after dark safely',
    category: 'situations',
    icon: '🌙'
  },
  {
    key: 'weather',
    name: 'Wet Weather',
    description: 'Driving in rain and slippery conditions',
    category: 'situations',
    icon: '🌧️'
  },
  {
    key: 'highway',
    name: 'Highway',
    description: 'High-speed road driving',
    category: 'situations',
    icon: '🛣️'
  },
  // Confidence
  {
    key: 'confidence',
    name: 'Overall Confidence',
    description: 'General driving confidence level',
    category: 'confidence',
    icon: '💪'
  }
]

export const SKILL_CATEGORIES = [
  { key: 'foundation', name: 'Foundation Skills', icon: '🏗️' },
  { key: 'maneuvers', name: 'Maneuvers', icon: '🔧' },
  { key: 'road', name: 'Road Skills', icon: '🛤️' },
  { key: 'situations', name: 'Situations', icon: '🌍' },
  { key: 'confidence', name: 'Confidence', icon: '💪' }
]

export const SKILL_LEVELS = [
  { value: 0, label: 'Not assessed', color: 'gray' },
  { value: 1, label: 'Very Low', color: 'red' },
  { value: 2, label: 'Low', color: 'orange' },
  { value: 3, label: 'Average', color: 'yellow' },
  { value: 4, label: 'Good', color: 'lime' },
  { value: 5, label: 'Excellent', color: 'green' }
]

export function getSkillLevelLabel(rating: number): string {
  const level = SKILL_LEVELS.find(l => l.value === rating)
  return level?.label || 'Unknown'
}

export function getSkillLevelColor(rating: number): string {
  const level = SKILL_LEVELS.find(l => l.value === rating)
  return level?.color || 'gray'
}
