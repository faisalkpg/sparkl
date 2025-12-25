export interface WorksheetConfig {
  grade: string;
  subject: string;
  topics: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  totalMarks: number;
  numQuestions: number;
  board?: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  marks: number;
  type: 'short' | 'long' | 'mcq' | 'fill-in' | 'true-false';
  answer: string;
  solution?: string;
}

export interface GeneratedWorksheet {
  config: WorksheetConfig;
  questions: Question[];
  generatedAt: Date;
}

export const GRADES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

export const SUBJECTS = [
  'English',
  'Mathematics',
  'Science',
  'Arabic',
  'Social Studies',
  'Business Studies',
  'Hindi',
  'Urdu'
];

export const BOARDS = [
  'Not Specified',
  'CBSE',
  'ICSE',
  'State Board',
  'Cambridge (IGCSE)',
  'IB',
  'GCSE',
  'Other'
];

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', description: 'Basic concepts and simple problems' },
  { value: 'medium', label: 'Medium', description: 'Standard difficulty with some application' },
  { value: 'hard', label: 'Hard', description: 'Advanced problems requiring critical thinking' },
  { value: 'mixed', label: 'Mixed', description: 'Balanced distribution of all levels' }
] as const;

export const TOPICS_BY_SUBJECT: Record<string, Record<string, string[]>> = {
  Mathematics: {
    'Grade 1': ['Numbers 1-100', 'Addition', 'Subtraction', 'Shapes', 'Patterns', 'Measurement'],
    'Grade 2': ['Numbers to 1000', 'Addition & Subtraction', 'Multiplication Introduction', 'Time', 'Money', 'Geometry'],
    'Grade 3': ['Multiplication', 'Division', 'Fractions', 'Decimals Introduction', 'Perimeter', 'Data Handling'],
    'Grade 4': ['Large Numbers', 'Factors & Multiples', 'Fractions', 'Decimals', 'Geometry', 'Area & Perimeter'],
    'Grade 5': ['Operations on Large Numbers', 'LCM & HCF', 'Fractions & Decimals', 'Percentage', 'Geometry', 'Volume'],
    'Grade 6': ['Integers', 'Algebra Introduction', 'Ratios', 'Geometry', 'Mensuration', 'Data Handling'],
    'Grade 7': ['Rational Numbers', 'Algebraic Expressions', 'Linear Equations', 'Triangles', 'Congruence', 'Perimeter & Area'],
    'Grade 8': ['Algebra', 'Geometry', 'Ratios & Proportions', 'Quadrilaterals', 'Data Handling', 'Square & Square Roots'],
    'Grade 9': ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations', 'Triangles', 'Statistics'],
    'Grade 10': ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'Trigonometry', 'Circles', 'Statistics & Probability'],
    'Grade 11': ['Sets', 'Relations & Functions', 'Trigonometry', 'Complex Numbers', 'Sequences & Series', 'Straight Lines'],
    'Grade 12': ['Relations & Functions', 'Calculus', 'Vectors', 'Three-D Geometry', 'Probability', 'Linear Programming']
  },
  Science: {
    'Grade 1': ['Living & Non-living', 'Plants', 'Animals', 'Human Body', 'Weather', 'Materials'],
    'Grade 2': ['Plants & Animals', 'Food', 'Water', 'Air', 'Our Body', 'Safety'],
    'Grade 3': ['Living Things', 'Food & Nutrition', 'Shelter', 'Matter', 'Force & Energy', 'Environment'],
    'Grade 4': ['Food & Digestion', 'Teeth & Microbes', 'Animals', 'Plants', 'Matter', 'Force & Work'],
    'Grade 5': ['Human Body Systems', 'Plants', 'Adaptation', 'Materials', 'Work & Energy', 'Earth & Universe'],
    'Grade 6': ['Food & Nutrition', 'Living Organisms', 'Motion & Measurement', 'Electricity', 'Light', 'Water'],
    'Grade 7': ['Nutrition', 'Respiration', 'Transportation', 'Heat', 'Acids & Bases', 'Physical & Chemical Changes'],
    'Grade 8': ['Crop Production', 'Microorganisms', 'Metals & Non-metals', 'Force & Pressure', 'Sound', 'Chemical Effects'],
    'Grade 9': ['Matter', 'Atoms & Molecules', 'Cell Structure', 'Tissues', 'Motion', 'Force & Laws of Motion'],
    'Grade 10': ['Chemical Reactions', 'Acids, Bases & Salts', 'Carbon Compounds', 'Life Processes', 'Heredity', 'Light'],
    'Grade 11': ['Physical World', 'Units & Measurement', 'Motion', 'Laws of Motion', 'Work & Energy', 'Thermodynamics'],
    'Grade 12': ['Electric Charges', 'Current Electricity', 'Electromagnetic Induction', 'Optics', 'Atoms', 'Nuclei']
  },
  English: {
    'Grade 1': ['Alphabet', 'Phonics', 'Simple Words', 'Rhyming Words', 'Basic Sentences', 'Reading Comprehension'],
    'Grade 2': ['Nouns', 'Verbs', 'Adjectives', 'Simple Sentences', 'Reading', 'Writing'],
    'Grade 3': ['Parts of Speech', 'Tenses', 'Punctuation', 'Comprehension', 'Creative Writing', 'Vocabulary'],
    'Grade 4': ['Grammar', 'Tenses', 'Active & Passive Voice', 'Comprehension', 'Essay Writing', 'Vocabulary'],
    'Grade 5': ['Advanced Grammar', 'Direct & Indirect Speech', 'Comprehension', 'Letter Writing', 'Story Writing', 'Vocabulary'],
    'Grade 6': ['Grammar', 'Tenses', 'Voice', 'Comprehension', 'Essay Writing', 'Poetry'],
    'Grade 7': ['Grammar', 'Transformation', 'Comprehension', 'Creative Writing', 'Literature', 'Vocabulary'],
    'Grade 8': ['Advanced Grammar', 'Comprehension', 'Essay Writing', 'Letter Writing', 'Literature', 'Poetry Analysis'],
    'Grade 9': ['Grammar', 'Writing Skills', 'Literature', 'Poetry', 'Comprehension', 'Creative Writing'],
    'Grade 10': ['Grammar', 'Writing Skills', 'Literature', 'Poetry Analysis', 'Comprehension', 'Letter & Essay'],
    'Grade 11': ['Advanced Grammar', 'Literature', 'Poetry', 'Writing Skills', 'Critical Analysis', 'Creative Writing'],
    'Grade 12': ['Literature', 'Poetry', 'Writing Skills', 'Critical Analysis', 'Essay Writing', 'Comprehension']
  },
  'Social Studies': {
    'Grade 1': ['My Family', 'My School', 'My Neighborhood', 'Festivals', 'Helpers', 'Transport'],
    'Grade 2': ['Family & Community', 'Our Country', 'Maps', 'Festivals', 'National Symbols', 'Important Places'],
    'Grade 3': ['Our State', 'India', 'Maps & Directions', 'Government', 'History', 'Geography'],
    'Grade 4': ['India Geography', 'History', 'Government', 'Maps', 'Natural Resources', 'Culture'],
    'Grade 5': ['Ancient India', 'Geography', 'Government', 'Maps', 'Natural Resources', 'World'],
    'Grade 6': ['Early Humans', 'Ancient Civilizations', 'Geography', 'Government', 'Maps', 'Resources'],
    'Grade 7': ['Medieval History', 'Geography', 'Civics', 'Maps', 'Environment', 'Resources'],
    'Grade 8': ['Modern History', 'Geography', 'Civics & Constitution', 'Resources', 'Industries', 'Maps'],
    'Grade 9': ['History', 'Geography', 'Civics', 'Economics', 'Disaster Management', 'Maps'],
    'Grade 10': ['History', 'Geography', 'Political Science', 'Economics', 'Maps', 'Current Affairs'],
    'Grade 11': ['History', 'Geography', 'Political Science', 'Economics', 'Sociology', 'Psychology'],
    'Grade 12': ['History', 'Geography', 'Political Science', 'Economics', 'Sociology', 'Psychology']
  },
  Arabic: {
    'Grade 1': ['Alphabet', 'Basic Words', 'Greetings', 'Numbers', 'Colors', 'Family'],
    'Grade 2': ['Vocabulary', 'Simple Sentences', 'Reading', 'Writing', 'Grammar Basics', 'Conversation'],
    'Grade 3': ['Grammar', 'Reading', 'Writing', 'Vocabulary', 'Comprehension', 'Conversation'],
    'Grade 4': ['Grammar', 'Reading', 'Writing', 'Vocabulary', 'Comprehension', 'Poetry'],
    'Grade 5': ['Advanced Grammar', 'Literature', 'Writing', 'Comprehension', 'Poetry', 'Conversation'],
    'Grade 6': ['Grammar', 'Literature', 'Writing Skills', 'Comprehension', 'Poetry', 'Culture'],
    'Grade 7': ['Advanced Grammar', 'Literature', 'Essay Writing', 'Poetry', 'Comprehension', 'Culture'],
    'Grade 8': ['Grammar', 'Literature', 'Writing', 'Poetry Analysis', 'Comprehension', 'Culture'],
    'Grade 9': ['Advanced Grammar', 'Classical Literature', 'Writing', 'Poetry', 'Comprehension', 'Culture'],
    'Grade 10': ['Grammar', 'Literature', 'Writing Skills', 'Poetry', 'Comprehension', 'Critical Analysis'],
    'Grade 11': ['Advanced Grammar', 'Classical Literature', 'Writing', 'Poetry', 'Analysis', 'Culture'],
    'Grade 12': ['Grammar', 'Literature', 'Writing', 'Poetry', 'Critical Analysis', 'Research']
  },
  'Business Studies': {
    'Grade 9': ['Introduction to Business', 'Forms of Business', 'Trade', 'Banking', 'Insurance', 'Communication'],
    'Grade 10': ['Business Services', 'Banking', 'Insurance', 'Transport', 'Communication', 'Trade'],
    'Grade 11': ['Nature of Business', 'Forms of Organization', 'Business Services', 'Banking', 'Insurance', 'Trade'],
    'Grade 12': ['Management', 'Principles of Management', 'Business Environment', 'Planning', 'Organizing', 'Marketing']
  },
  Hindi: {
    'Grade 1': ['वर्णमाला', 'मात्राएं', 'सरल शब्द', 'वाक्य', 'कविता', 'कहानी'],
    'Grade 2': ['शब्द भंडार', 'वाक्य रचना', 'कविता', 'कहानी', 'व्याकरण', 'लेखन'],
    'Grade 3': ['व्याकरण', 'पठन', 'लेखन', 'कविता', 'कहानी', 'शब्द भंडार'],
    'Grade 4': ['व्याकरण', 'अपठित गद्यांश', 'लेखन', 'कविता', 'साहित्य', 'शब्द भंडार'],
    'Grade 5': ['व्याकरण', 'अपठित गद्यांश', 'निबंध लेखन', 'पत्र लेखन', 'साहित्य', 'कविता'],
    'Grade 6': ['व्याकरण', 'अपठित गद्यांश', 'लेखन', 'साहित्य', 'कविता', 'शब्द भंडार'],
    'Grade 7': ['व्याकरण', 'अपठित गद्यांश', 'निबंध', 'पत्र', 'साहित्य', 'कविता'],
    'Grade 8': ['व्याकरण', 'अपठित गद्यांश', 'निबंध', 'पत्र लेखन', 'साहित्य', 'कविता'],
    'Grade 9': ['व्याकरण', 'अपठित गद्यांश', 'लेखन', 'साहित्य', 'कविता', 'समालोचना'],
    'Grade 10': ['व्याकरण', 'अपठित गद्यांश', 'निबंध', 'पत्र', 'साहित्य', 'कविता'],
    'Grade 11': ['व्याकरण', 'साहित्य', 'कविता', 'लेखन', 'समालोचना', 'रचनात्मक लेखन'],
    'Grade 12': ['व्याकरण', 'साहित्य', 'कविता', 'लेखन', 'समालोचना', 'शोध']
  },
  Urdu: {
    'Grade 1': ['حروف تہجی', 'بنیادی الفاظ', 'سلام', 'اعداد', 'رنگ', 'خاندان'],
    'Grade 2': ['ذخیرہ الفاظ', 'سادہ جملے', 'پڑھنا', 'لکھنا', 'قواعد', 'گفتگو'],
    'Grade 3': ['قواعد', 'پڑھنا', 'لکھنا', 'ذخیرہ الفاظ', 'سمجھ', 'گفتگو'],
    'Grade 4': ['قواعد', 'پڑھنا', 'لکھنا', 'ذخیرہ الفاظ', 'سمجھ', 'شاعری'],
    'Grade 5': ['قواعد', 'ادب', 'تحریر', 'سمجھ', 'شاعری', 'گفتگو'],
    'Grade 6': ['قواعد', 'ادب', 'تحریری مہارت', 'سمجھ', 'شاعری', 'ثقافت'],
    'Grade 7': ['قواعد', 'ادب', 'مضمون', 'شاعری', 'سمجھ', 'ثقافت'],
    'Grade 8': ['قواعد', 'ادب', 'تحریر', 'شاعری کا تجزیہ', 'سمجھ', 'ثقافت'],
    'Grade 9': ['قواعد', 'کلاسیکی ادب', 'تحریر', 'شاعری', 'سمجھ', 'ثقافت'],
    'Grade 10': ['قواعد', 'ادب', 'تحریری مہارت', 'شاعری', 'سمجھ', 'تنقیدی تجزیہ'],
    'Grade 11': ['قواعد', 'کلاسیکی ادب', 'تحریر', 'شاعری', 'تجزیہ', 'ثقافت'],
    'Grade 12': ['قواعد', 'ادب', 'تحریر', 'شاعری', 'تنقیدی تجزیہ', 'تحقیق']
  }
};
