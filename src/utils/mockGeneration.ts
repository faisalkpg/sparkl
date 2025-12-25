import { WorksheetConfig, Question, GeneratedWorksheet } from "@/types/worksheet";

const questionTemplates: Record<string, { short: string[]; long: string[] }> = {
  Mathematics: {
    short: [
      "Solve: {expression}",
      "Find the value of x if {equation}",
      "Calculate the {operation} of {values}",
      "Simplify: {expression}",
      "What is the {property} of {shape}?",
      "If {condition}, find {unknown}",
      "Express {value} as a {form}",
      "Find the {measure} of {figure}",
    ],
    long: [
      "A train travels at {speed} km/h. If it covers {distance} km, how long does the journey take? Show all steps.",
      "The sum of three consecutive numbers is {sum}. Find the numbers and verify your answer.",
      "In a class of {students} students, {fraction} are boys. If {more} more girls join, what fraction of the class are girls now?",
      "A shopkeeper buys an item for ₹{cost} and sells it at {percent}% profit. What is the selling price? Show working.",
      "The perimeter of a rectangle is {perimeter} cm. If the length is {length} cm, find the area of the rectangle.",
    ],
  },
  Science: {
    short: [
      "Define {term}.",
      "What is the function of {organ/structure}?",
      "Name the process by which {description}.",
      "Give two examples of {category}.",
      "What causes {phenomenon}?",
      "Differentiate between {concept1} and {concept2}.",
      "State {law/principle}.",
      "What happens when {condition}?",
    ],
    long: [
      "Explain the process of {process} with the help of a diagram. Mention all the stages involved.",
      "Describe an experiment to demonstrate {concept}. Include apparatus, procedure, and observations.",
      "Compare and contrast {concept1} and {concept2}. Give at least four points of difference.",
      "Explain the importance of {topic} in daily life. Give three practical applications.",
      "What are the effects of {phenomenon} on {subject}? Suggest ways to prevent or manage it.",
    ],
  },
  English: {
    short: [
      "Fill in the blank with the correct form of the verb: {sentence}",
      "Change the following sentence to {voice}: {sentence}",
      "Identify the {part of speech} in the following sentence: {sentence}",
      "Give the {synonym/antonym} of: {word}",
      "Correct the error in the following sentence: {sentence}",
      "Complete the sentence: {incomplete sentence}",
      "Change into {tense}: {sentence}",
      "Punctuate the following: {sentence}",
    ],
    long: [
      "Write a paragraph of about 100 words on '{topic}'.",
      "Write a letter to {recipient} about {subject}. Follow the proper format.",
      "Read the passage below and answer the questions that follow: {passage}",
      "Write a short story that begins with: '{opening}'",
      "Explain the theme and message of the poem '{title}'. Support with examples from the text.",
    ],
  },
  "Social Studies": {
    short: [
      "When did {event} occur?",
      "Who was {person}? State their contribution.",
      "What is {term}?",
      "Name the {geographical feature} in {region}.",
      "What are the main features of {system/period}?",
      "Where is {location}? Mark it on the map.",
      "Give two causes of {event}.",
      "What was the result of {event}?",
    ],
    long: [
      "Describe the causes and effects of {event}. How did it shape {region/society}?",
      "Explain the significance of {movement/period} in {country}'s history.",
      "Compare the governments of {country1} and {country2}. Discuss similarities and differences.",
      "What are the challenges faced by {region}? Suggest possible solutions.",
      "Trace the development of {concept/institution} from ancient times to the present.",
    ],
  },
  Arabic: {
    short: [
      "اكتب معنى الكلمة التالية: {word}",
      "أكمل الجملة: {sentence}",
      "حوّل الجملة إلى صيغة {form}: {sentence}",
      "أعرب ما تحته خط في الجملة التالية: {sentence}",
      "اذكر مثالاً على {concept}",
      "صحّح الخطأ في الجملة التالية: {sentence}",
      "ما هو جمع كلمة {word}؟",
      "اكتب مرادف الكلمة: {word}",
    ],
    long: [
      "اكتب فقرة عن موضوع '{topic}' في حدود 100 كلمة.",
      "اقرأ النص التالي ثم أجب عن الأسئلة: {passage}",
      "اكتب رسالة إلى {recipient} حول {subject}.",
      "اشرح المعنى العام للآية/النص التالي: {text}",
      "تحدث عن أهمية {topic} في حياتنا اليومية.",
    ],
  },
  Hindi: {
    short: [
      "निम्नलिखित शब्द का अर्थ लिखिए: {word}",
      "वाक्य पूरा कीजिए: {sentence}",
      "निम्नलिखित वाक्य को {form} में बदलिए: {sentence}",
      "रेखांकित शब्द का विलोम लिखिए: {sentence}",
      "{concept} का एक उदाहरण दीजिए।",
      "वाक्य में त्रुटि सुधारिए: {sentence}",
      "संधि-विच्छेद कीजिए: {word}",
      "समास का नाम बताइए: {phrase}",
    ],
    long: [
      "'{topic}' विषय पर लगभग 100 शब्दों में एक अनुच्छेद लिखिए।",
      "निम्नलिखित गद्यांश को पढ़कर प्रश्नों के उत्तर दीजिए: {passage}",
      "{recipient} को {subject} के बारे में एक पत्र लिखिए।",
      "कविता का भावार्थ अपने शब्दों में लिखिए: {poem}",
      "'{story}' कहानी का सारांश लिखिए।",
    ],
  },
  Urdu: {
    short: [
      "درج ذیل لفظ کا معنی لکھیے: {word}",
      "جملہ مکمل کیجیے: {sentence}",
      "جملے کو {form} میں تبدیل کیجیے: {sentence}",
      "متضاد لفظ لکھیے: {word}",
      "{concept} کی ایک مثال دیجیے۔",
      "جملے میں غلطی درست کیجیے: {sentence}",
      "لفظ کی جمع لکھیے: {word}",
      "مترادف لفظ لکھیے: {word}",
    ],
    long: [
      "'{topic}' کے موضوع پر تقریباً 100 الفاظ میں ایک پیراگراف لکھیے۔",
      "درج ذیل اقتباس پڑھ کر سوالات کے جوابات دیجیے: {passage}",
      "{recipient} کو {subject} کے بارے میں ایک خط لکھیے۔",
      "نظم کا مرکزی خیال اپنے الفاظ میں بیان کیجیے: {poem}",
      "'{story}' کہانی کا خلاصہ لکھیے۔",
    ],
  },
  "Business Studies": {
    short: [
      "Define {term}.",
      "What are the features of {concept}?",
      "Give two examples of {type}.",
      "Differentiate between {concept1} and {concept2}.",
      "What is the role of {factor} in business?",
      "Name the types of {category}.",
      "State any two {principles/factors} of {concept}.",
      "What do you mean by {term}?",
    ],
    long: [
      "Explain the importance of {concept} in modern business. Give suitable examples.",
      "Describe the various types of {category}. Compare their advantages and disadvantages.",
      "What are the steps involved in {process}? Explain each step briefly.",
      "Discuss the challenges faced by {type of business}. Suggest ways to overcome them.",
      "Explain {principle/concept} with the help of examples from real-world business scenarios.",
    ],
  },
};

function generateSampleQuestions(config: WorksheetConfig): Question[] {
  const templates = questionTemplates[config.subject] || questionTemplates["English"];
  const questions: Question[] = [];
  
  const marksDistribution = distributeMarks(config.totalMarks, config.numQuestions);
  
  for (let i = 0; i < config.numQuestions; i++) {
    const marks = marksDistribution[i];
    const isLong = marks >= 4;
    const templatePool = isLong ? templates.long : templates.short;
    const template = templatePool[Math.floor(Math.random() * templatePool.length)];
    
    const questionText = generateQuestionText(template, config.subject, config.topics, config.grade);
    const answer = generateAnswer(questionText, isLong);
    
    questions.push({
      id: `q-${i + 1}-${Date.now()}`,
      questionNumber: i + 1,
      questionText,
      marks,
      type: isLong ? 'long' : 'short',
      answer,
      solution: isLong && config.subject === 'Mathematics' ? generateSolution() : undefined,
    });
  }
  
  return questions;
}

function distributeMarks(totalMarks: number, numQuestions: number): number[] {
  const marks: number[] = [];
  let remaining = totalMarks;
  
  for (let i = 0; i < numQuestions - 1; i++) {
    const avg = remaining / (numQuestions - i);
    const variation = Math.floor(avg * 0.3);
    const mark = Math.max(1, Math.min(10, Math.round(avg + (Math.random() - 0.5) * 2 * variation)));
    marks.push(mark);
    remaining -= mark;
  }
  
  marks.push(Math.max(1, remaining));
  return marks.sort((a, b) => a - b);
}

function generateQuestionText(template: string, subject: string, topics: string[], grade: string): string {
  const replacements: Record<string, string[]> = {
    expression: ['2x + 3 = 11', '5(x - 2) = 15', '3x² - 12 = 0', '(x + 3)(x - 2)', '√144 + √81'],
    equation: ['2x + 5 = 17', '3(x - 4) = 21', 'x² - 9 = 0'],
    operation: ['LCM', 'HCF', 'sum', 'product', 'average'],
    values: ['12, 18, 24', '15, 25, 35', '8, 12, 16'],
    property: ['area', 'perimeter', 'volume', 'diagonal'],
    shape: ['triangle', 'rectangle', 'circle', 'square'],
    term: [...topics, 'photosynthesis', 'democracy', 'fraction', 'ecosystem'],
    concept: [...topics],
    concept1: [topics[0] || 'mitosis'],
    concept2: [topics[1] || 'meiosis'],
    word: ['beautiful', 'happiness', 'quickly', 'important'],
    sentence: ['The boy is playing in the garden.', 'She writes letters to her friend.', 'They have completed the work.'],
    voice: ['passive voice', 'active voice'],
    tense: ['past tense', 'future tense', 'present perfect'],
    topic: [...topics, 'importance of education', 'environmental conservation', 'healthy lifestyle'],
    speed: ['60', '80', '100'],
    distance: ['300', '480', '600'],
    sum: ['63', '99', '126'],
    students: ['40', '50', '60'],
    fraction: ['2/5', '3/4', '1/2'],
    more: ['5', '8', '10'],
    cost: ['500', '800', '1200'],
    percent: ['20', '25', '15'],
    perimeter: ['56', '72', '88'],
    length: ['18', '22', '26'],
    form: ['المضارع', 'الماضي', 'اسم', 'فعل'],
    recipient: ['your friend', 'the principal', 'your father', 'the editor'],
    subject: ['a school event', 'requesting leave', 'a complaint', 'expressing gratitude'],
  };

  let result = template;
  const placeholders = template.match(/\{(\w+)\}/g) || [];
  
  for (const placeholder of placeholders) {
    const key = placeholder.slice(1, -1);
    const options = replacements[key] || [key];
    const replacement = options[Math.floor(Math.random() * options.length)];
    result = result.replace(placeholder, replacement);
  }
  
  return result;
}

function generateAnswer(question: string, isLong: boolean): string {
  if (question.includes('Solve') || question.includes('Calculate') || question.includes('Find')) {
    return isLong 
      ? "Step 1: Identify the given values.\nStep 2: Apply the relevant formula.\nStep 3: Calculate and verify.\nAnswer: x = 4"
      : "x = 4";
  }
  
  if (question.includes('Define') || question.includes('What is')) {
    return isLong
      ? "Definition: A comprehensive explanation of the concept including its key characteristics, applications, and significance in the field. It helps us understand the fundamental principles and their practical implications."
      : "A brief definition explaining the key concept.";
  }
  
  if (question.includes('paragraph') || question.includes('letter') || question.includes('essay')) {
    return "Sample model answer demonstrating proper structure, relevant content, and appropriate language use. The answer should follow the format specified and address all aspects of the question.";
  }
  
  return isLong
    ? "Detailed answer covering all aspects of the question with proper explanation, examples, and conclusion."
    : "Concise and accurate answer addressing the key point.";
}

function generateSolution(): string {
  return "Step 1: Read the problem carefully and identify known values.\nStep 2: Set up the equation or formula.\nStep 3: Solve systematically.\nStep 4: Verify your answer.";
}

export async function generateWorksheet(config: WorksheetConfig): Promise<GeneratedWorksheet> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
  
  return {
    config,
    questions: generateSampleQuestions(config),
    generatedAt: new Date(),
  };
}
