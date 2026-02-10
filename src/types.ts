export interface ExamMetadata {
  school_name: string;
  exam_title: string;
  grade: string;
  subject: string;
  time: number;
  book_series: string;
  exam_type: string;
}

export interface MatrixRow {
  topic: string;
  knowledge_block: string;
  mc: { nb: number; th: number; vd: number };
  tf: { nb: number; th: number; vd: number };
  sa: { nb: number; th: number; vd: number };
  es: { nb: number; th: number; vd: number };
  summary: { nb: number; th: number; vd: number };
  percent: number;
}

export interface SpecRow {
  stt: number;
  topic: string;
  knowledge: string;
  criteria: string;
  competency?: string; // Năng lực: TDLL, GQVĐ, MHH, GTTH
  questions: {
    mc: { nb: string; th: string; vd: string };
    tf: { nb: string; th: string; vd: string };
    sa: { nb: string; th: string; vd: string };
    es: { nb: string; th: string; vd: string };
  };
}

export interface QuestionPart1 {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface QuestionPart2 {
  id: string;
  context: string;
  items: {
    label: string;
    text: string;
  }[];
}

export interface QuestionPart3 {
  id: string;
  question: string;
}

export interface EssayQuestion {
  id: string;
  question: string;
  points: string;
}

export interface AnswerKeyPart2 {
  id: string;
  sub_answers: { label: string; result: string; reason?: string }[];
}

export interface EssayStep {
  part_label: string;
  content: string;
  score: string;
}

export interface ExamContent {
  part_1: QuestionPart1[];
  part_2: QuestionPart2[];
  part_3: QuestionPart3[];
  essay: EssayQuestion[];
}

export interface AnswerKey {
  header: {
    title: string;
    part_1_note: string;
    part_2_note: string;
  };
  part_1: { id: string; answer: string }[];
  part_2: AnswerKeyPart2[];
  part_3: { id: string; answer: string; explanation?: string }[];
  essay: { id: string; score_total: string; steps: EssayStep[] }[];
}

export interface ExamData {
  metadata: ExamMetadata;
  matrix_data?: MatrixRow[];
  specification_data?: SpecRow[];
  exam_content: ExamContent;
  answer_key: AnswerKey;
}

export interface DifficultyConfig {
  nb: number;
  th: number;
  vd: number;
  vdc: number;
}

export interface QuestionConfigItem {
  count: number;
  score: number;
}

export interface QuestionConfig {
  p1: QuestionConfigItem;
  p2: QuestionConfigItem;
  p3: QuestionConfigItem;
  es: QuestionConfigItem;
}