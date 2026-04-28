// Mock Teachers
export const mockTeachers = [
  {
    id: 'teacher-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@school.edu',
    avatar: 'SC',
    organization: 'Lincoln High School',
  },
  {
    id: 'teacher-2',
    name: 'James Wilson',
    email: 'james.wilson@school.edu',
    avatar: 'JW',
    organization: 'Lincoln High School',
  },
]

// Mock Courses
export const mockCourses = [
  {
    id: 'course-1',
    name: 'AP Biology',
    section: '3rd Period',
    studentCount: 28,
    color: '#3D3580',
    lastActivity: '2 hours ago',
  },
  {
    id: 'course-2',
    name: 'Honors Chemistry',
    section: '5th Period',
    studentCount: 24,
    color: '#8B7DC8',
    lastActivity: '5 hours ago',
  },
  {
    id: 'course-3',
    name: 'Biology Basics',
    section: '6th Period',
    studentCount: 31,
    color: '#D97706',
    lastActivity: '1 day ago',
  },
]

// Mock Students with Absence Data
export const mockStudents = [
  {
    id: 'student-1',
    name: 'Emma Johnson',
    avatar: 'EJ',
    absenceDate: '2024-02-15',
    daysAbsent: 2,
    status: 'pending', // pending, generated, completed
    lastUpdated: '2 hours ago',
  },
  {
    id: 'student-2',
    name: 'Liam Martinez',
    avatar: 'LM',
    absenceDate: '2024-02-14',
    daysAbsent: 1,
    status: 'generated',
    lastUpdated: '5 hours ago',
  },
  {
    id: 'student-3',
    name: 'Olivia Park',
    avatar: 'OP',
    absenceDate: '2024-02-10',
    daysAbsent: 3,
    status: 'completed',
    lastUpdated: '1 day ago',
  },
  {
    id: 'student-4',
    name: 'Noah Williams',
    avatar: 'NW',
    absenceDate: '2024-02-15',
    daysAbsent: 2,
    status: 'pending',
    lastUpdated: '2 hours ago',
  },
  {
    id: 'student-5',
    name: 'Ava Thompson',
    avatar: 'AT',
    absenceDate: '2024-02-12',
    daysAbsent: 2,
    status: 'generated',
    lastUpdated: '3 hours ago',
  },
  {
    id: 'student-6',
    name: 'Mason Chen',
    avatar: 'MC',
    absenceDate: '2024-02-16',
    daysAbsent: 1,
    status: 'pending',
    lastUpdated: '1 hour ago',
  },
  {
    id: 'student-7',
    name: 'Sophie Anderson',
    avatar: 'SA',
    absenceDate: '2024-02-08',
    daysAbsent: 4,
    status: 'completed',
    lastUpdated: '3 days ago',
  },
  {
    id: 'student-8',
    name: 'Ethan Rodriguez',
    avatar: 'ER',
    absenceDate: '2024-02-11',
    daysAbsent: 3,
    status: 'generated',
    lastUpdated: '2 days ago',
  },
]

// Mock Catch-Up Content
export const mockCatchUpContent = {
  explanation: `During your absence, we covered some fundamental concepts in cell biology that are crucial for understanding the upcoming units. 

The main topic was **cellular respiration**, specifically how cells convert glucose into usable energy in the form of ATP. We explored both aerobic and anaerobic respiration pathways, examining the key stages: glycolysis, the Krebs cycle (citric acid cycle), and the electron transport chain.

Key points included:
- Glycolysis occurs in the cytoplasm and produces 2 ATP and 2 NADH molecules
- The Krebs cycle is the central hub of cellular respiration occurring in the mitochondrial matrix
- The electron transport chain generates the majority of ATP through chemiosmosis
- Anaerobic respiration (fermentation) allows cells to produce ATP without oxygen

We also discussed how this relates to photosynthesis and the interconnected nature of energy production in living systems. This foundational knowledge is critical for upcoming topics on metabolism and energy transfer in ecosystems.`,

  contentAudit: {
    included: [
      'Cellular Respiration Overview',
      'Glycolysis Process',
      'Krebs Cycle',
      'Electron Transport Chain',
      'ATP Production',
      'Anaerobic Respiration',
    ],
    excluded: [
      'Detailed enzyme kinetics',
      'Advanced mitochondrial structure',
      'Evolutionary aspects',
    ],
  },
}

// Mock Quiz Questions
export const mockQuizQuestions = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'Which stage of cellular respiration produces the most ATP?',
    options: [
      'Glycolysis',
      'Krebs Cycle',
      'Electron Transport Chain',
      'Fermentation',
    ],
    correctAnswer: 2,
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question: 'Where does glycolysis occur in the cell?',
    options: [
      'Mitochondrial matrix',
      'Cytoplasm',
      'Chloroplast',
      'Nucleus',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    question: 'What is the main product of anaerobic respiration in muscle cells?',
    options: [
      'Ethanol',
      'Lactic acid',
      'Acetyl-CoA',
      'Pyruvate',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    question: 'How many carbon atoms are in the Krebs cycle intermediate citrate?',
    options: [
      'Four',
      'Five',
      'Six',
      'Seven',
    ],
    correctAnswer: 2,
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    question: 'What role does NAD+ play in cellular respiration?',
    options: [
      'It stores energy directly',
      'It acts as an electron carrier',
      'It breaks down glucose',
      'It produces ATP',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q6',
    type: 'short-answer',
    question: 'Explain the relationship between photosynthesis and cellular respiration.',
    placeholder: 'Type your answer here...',
  },
]

// Mock Status Badges
export const statusConfig = {
  empty: {
    label: 'Empty',
    color: '#9CA3AF', // neutral gray
    bg: '#F3F4F6',
  },
  pending: {
    label: 'Pending',
    color: '#9CA3AF', // neutral gray
    bg: '#F3F4F6',
  },
  generating: {
    label: 'Generating',
    color: '#2563EB', // info blue
    bg: '#EFF6FF',
  },
  generated: {
    label: 'Ready to Deliver',
    color: '#16A34A', // success green
    bg: '#ECFDF5',
  },
  delivered: {
    label: 'Delivered',
    color: '#8B5CF6', // purple
    bg: '#F3E8FF',
  },
  completed: {
    label: 'Completed',
    color: '#16A34A', // success green
    bg: '#ECFDF5',
  },
  failed: {
    label: 'Failed',
    color: '#DC2626', // destructive red
    bg: '#FEE2E2',
  },
}

// Mock Toast Notifications
export const toastMessages = {
  absenceMarked: 'Absence marked for selected students',
  contentGenerated: 'Catch-up content successfully generated',
  lessonCompleted: 'Lesson completed! Great work!',
  error: 'Something went wrong. Please try again.',
}
