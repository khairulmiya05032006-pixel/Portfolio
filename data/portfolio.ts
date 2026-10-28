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

export type Project = {
  number: string
  slug: string
  name: string
  context: string
  built: string
  technologies: string[]
  learned: string
  featured?: boolean
}

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

export const navigation: NavigationItem[] = [
  { label: 'Home', href: '#home', icon: 'home' },
  { label: 'About', href: '#about', icon: 'profile' },
  { label: 'Skills', href: '#skills', icon: 'skills' },
  { label: 'Work', href: '#work', icon: 'work' },
  { label: 'Blog', href: '#blog', icon: 'blog' },
  { label: 'Contact', href: '#contact', icon: 'contact' },
]

export const profile = {
  name: 'Khairul Miya',
  role: 'Full-stack developer in progress',
  introduction:
    'A BCA student learning to build useful web products through front-end and back-end development.',
  about:
    'I am a third-year BCA student, graduating in 2027, with a growing interest in taking an idea from a clear interface to dependable application logic. My current practice combines small JavaScript experiments with a documented full-stack system.',
  contact:
    'I’m interested in opportunities to learn, contribute, and build thoughtful web products.',
} as const

export const factCards = [
  { value: '2027', label: 'Expected BCA graduation' },
  { value: '01', label: 'Full-stack system documented' },
  { value: '04', label: 'JavaScript mini-projects documented' },
  { value: 'Focus', label: 'Full-stack web development' },
] as const

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

export const projects: Project[] = [
  {
    number: '01',
    slug: 'amana-capital',
    name: 'Amana Capital',
    context: 'Learning project · microfinance loan management',
    built:
      'A Node.js and Express web application for customer management, loan application tracking, payment processing, and reporting.',
    technologies: ['Node.js', 'Express', 'MySQL', 'JWT authentication'],
    learned:
      'How customer records, loan applications, payments, and reports connect through a full-stack system.',
    featured: true,
  },
  {
    number: '02',
    slug: 'javascript-mini-projects',
    name: 'JavaScript Mini Projects',
    context: 'Practice projects · browser interaction',
    built:
      'A Digital Clock, Background Color Generator, Random Quote Generator, and Income Tax Calculator.',
    technologies: ['JavaScript', 'DOM APIs', 'Event handling', 'Conditional logic'],
    learned:
      'Core interaction patterns, live updates, and readable client-side logic.',
  },
  {
    number: '03',
    slug: 'visual-studies',
    name: 'Visual Studies',
    context: 'Responsive front-end studies',
    built:
      'A Spotify clone and an Apna Studio photography website as exercises in interface composition.',
    technologies: ['HTML', 'CSS', 'Responsive layout'],
    learned:
      'How structure, spacing, and responsive behaviour shape a clear visual experience.',
  },
]

export const learningNotes: LearningNote[] = [
  {
    number: '01',
    title: 'Small tools, real interaction',
    excerpt: 'A learning note from building JavaScript mini projects around DOM updates, events, and conditional logic.',
    tags: ['JavaScript', 'DOM interaction'],
    treatment: 'signal',
  },
  {
    number: '02',
    title: 'Tracing the loan flow',
    excerpt: 'A closer look at how customer records, applications, payments, and reports connect in Amana Capital.',
    tags: ['Node.js', 'MySQL'],
    treatment: 'system',
  },
  {
    number: '03',
    title: 'Structure before style',
    excerpt: 'A visual study in using responsive structure and deliberate spacing to make a front-end interface clearer.',
    tags: ['HTML', 'CSS'],
    treatment: 'layout',
  },
]

export const learningStages = [
  'Foundations in HTML, CSS, and JavaScript',
  'Interactive JavaScript projects',
  'Responsive front-end studies',
  'Amana Capital: Node.js, Express, MySQL, and JWT',
  'Continuing full-stack development',
] as const

export const blogArticles: BlogArticle[] = [
  {
    number: '01',
    slug: 'javascript-closures-practical-guide',
    title: 'Understanding Closures in JavaScript',
    excerpt:
      'How closures work under the hood and why they matter for writing clean, modular functions in real applications.',
    category: 'JavaScript',
    date: '2026-10-18',
    readTime: '6 min read',
    gradient: ['#ffb000', '#ff7a18'],
    content: {
      overview:
        'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In JavaScript, every inner function maintains access to its outer scope variables even after the outer function finishes execution.',
      keyPoints: [
        'Lexical scoping ensures variables are resolved from the inner scope outwards to global scope.',
        'Closures enable private state encapsulation without relying on complex class hierarchies.',
        'Crucial for understanding functional patterns, factory functions, currying, and memoization.',
        'Be mindful of memory lifecycle: retaining references in long-lived closures prevents garbage collection.',
      ],
      codeExample: `// Encapsulating state using a closure
function createRateLimiter(maxCalls = 3, timeWindowMs = 1000) {
  let timestamps: number[] = []

  return function attemptExecution(): boolean {
    const now = Date.now()
    timestamps = timestamps.filter(t => now - t < timeWindowMs)
    if (timestamps.length < maxCalls) {
      timestamps.push(now)
      return true
    }
    return false
  }
}`,
      takeaway:
        'Treat closures as deliberate boundaries for private state rather than an accident of nested functions.',
    },
  },
  {
    number: '02',
    slug: 'react-state-management-patterns',
    title: 'State Management Patterns in React',
    excerpt:
      'A practical look at when to use local state, context, and lifting state up — with lessons from building real components.',
    category: 'React',
    date: '2026-10-10',
    readTime: '8 min read',
    gradient: ['#61dafb', '#2196f3'],
    content: {
      overview:
        'Modern React offers multiple primitives for managing application state. Choosing the right pattern depends on state velocity, component distance, and whether data needs to synchronize across sibling trees.',
      keyPoints: [
        'Default to local component state (useState) to keep components modular and re-renders isolated.',
        'Lift state only to the lowest common ancestor that truly requires visibility.',
        'Use useReducer when subsequent state transitions depend on complex conditions or multiple sub-values.',
        'Reserve Context for low-velocity globals (theme, user identity, preferences) to avoid cascading tree invalidations.',
      ],
      codeExample: `type State = { status: 'idle' | 'loading' | 'success'; data: Item[] }
type Action = { type: 'FETCH' } | { type: 'RESOLVE'; payload: Item[] }

function dataReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH': return { ...state, status: 'loading' }
    case 'RESOLVE': return { status: 'success', data: action.payload }
    default: return state
  }
}`,
      takeaway:
        'Colocating state with the components that consume it prevents excessive re-renders and keeps architectures maintainable.',
    },
  },
  {
    number: '03',
    slug: 'building-rest-apis-with-express',
    title: 'Building REST APIs with Express',
    excerpt:
      'Structuring routes, controllers, and middleware in Express — patterns I learned while building the Amana Capital system.',
    category: 'Backend',
    date: '2026-09-28',
    readTime: '7 min read',
    gradient: ['#68a063', '#3c873a'],
    content: {
      overview:
        'Building production-ready REST APIs requires clear separation of concerns. While building Amana Capital, separating routing, business logic, validation, and error handling proved vital for reliability.',
      keyPoints: [
        'Decouple route declarations from route handlers by using dedicated Controller modules.',
        'Isolate database interactions into service or data-access layers for reusable queries.',
        'Utilize composable middleware for JWT verification, payload schema checks, and request rate-limiting.',
        'Implement centralized error middleware to guarantee uniform JSON error envelopes.',
      ],
      codeExample: `// Centralized error handling middleware
app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    error: { code: statusCode, message }
  })
})`,
      takeaway:
        'A clean API architecture makes automated testing straightforward and protects backend code as requirements expand.',
    },
  },
  {
    number: '04',
    slug: 'mysql-data-modelling-for-web-apps',
    title: 'MySQL Data Modelling for Web Apps',
    excerpt:
      'Designing tables, relationships, and queries that keep application data organised and retrievable at scale.',
    category: 'Database',
    date: '2026-09-15',
    readTime: '5 min read',
    gradient: ['#00758f', '#f29111'],
    content: {
      overview:
        'Relational databases provide strong guarantees around consistency and relationships. Normalizing data prevents duplicate records and keeps transactions clean.',
      keyPoints: [
        'Normalize up to third normal form (3NF) to eliminate data redundancy and anomaly bugs.',
        'Establish explicit foreign key constraints with appropriate ON DELETE RESTRICT or CASCADE policies.',
        'Index foreign keys and frequent WHERE clause predicates to keep table joins performant.',
        'Use transactional blocks (BEGIN / COMMIT / ROLLBACK) when updating multiple related records.',
      ],
      codeExample: `CREATE TABLE loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);`,
      takeaway:
        'Enforcing constraints at the database level guarantees integrity regardless of how many application services write to the database.',
    },
  },
  {
    number: '05',
    slug: 'css-layout-mental-models',
    title: 'CSS Layout Mental Models',
    excerpt:
      'Flexbox, Grid, and the thinking process behind choosing the right layout strategy for different UI challenges.',
    category: 'Frontend',
    date: '2026-09-02',
    readTime: '6 min read',
    gradient: ['#e44d26', '#f16529'],
    content: {
      overview:
        'CSS layout becomes intuitive once you match the layout requirement to the right mental model: Flexbox for content-driven 1D distribution, and Grid for structure-driven 2D systems.',
      keyPoints: [
        'Flexbox is optimal for linear toolbars, navigation bars, tag clouds, and centering elements.',
        'CSS Grid provides powerful 2D matrix controls with auto-fit and minmax() to eliminate unnecessary media queries.',
        'Nest them intentionally: use CSS Grid for page section architecture and Flexbox within component cards.',
        'Rely on modern clamp() and intrinsic sizing to keep typography and spacing fluid across screen sizes.',
      ],
      codeExample: `/* Responsive card grid with no media queries needed */
.responsiveGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: var(--space-5);
}`,
      takeaway:
        'Understanding browser layout algorithms turns styling from frustrating guesswork into predictable, elegant systems.',
    },
  },
  {
    number: '06',
    slug: 'jwt-authentication-explained',
    title: 'JWT Authentication Explained',
    excerpt:
      'How JSON Web Tokens secure user sessions — from token generation to route protection in a Node.js application.',
    category: 'Security',
    date: '2026-08-20',
    readTime: '7 min read',
    gradient: ['#d63384', '#6f42c1'],
    content: {
      overview:
        'JSON Web Tokens (JWT) enable stateless authentication by encoding user claims cryptographically signed by the server. This removes the need for centralized session lookups on every request.',
      keyPoints: [
        'JWT tokens consist of three base64URL parts: Header, Payload, and Signature.',
        'Payloads are not encrypted; never place sensitive information like passwords or PINs inside them.',
        'Use secure, HttpOnly, SameSite cookies to protect tokens against client-side cross-site scripting (XSS).',
        'Pair short-lived access tokens (e.g. 15 minutes) with rotating refresh tokens for enhanced session security.',
      ],
      codeExample: `function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Authentication required' })

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' })
    req.user = decoded
    next()
  })
}`,
      takeaway:
        'Stateless tokens deliver scalable auth, but require disciplined secret management and short expiration windows.',
    },
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
