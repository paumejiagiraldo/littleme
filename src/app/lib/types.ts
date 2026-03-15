// Core types for LittleMe

export interface CharacterTraits {
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  additionalNotes?: string;
}

export interface FamilyMember {
  role: 'child' | 'parent1' | 'parent2' | 'sibling';
  name: string;
  photoUrl?: string;
  traits: CharacterTraits;
}

export interface BookSession {
  id: string;
  step: 'upload' | 'confirm' | 'names' | 'story' | 'language' | 'preview' | 'checkout' | 'success';
  familyMembers: FamilyMember[];
  storyTemplateId?: string;
  language: 'en' | 'es' | 'pt';
  contextFields?: Record<string, string>;
  generatedPages?: BookPage[];
  stripeSessionId?: string;
  pdfUrl?: string;
  createdAt: Date;
}

export interface StoryTemplate {
  id: string;
  title: Record<string, string>; // keyed by language
  synopsis: Record<string, string>;
  previewImageUrl: string;
  contextFields: ContextField[];
  pages: StoryPageTemplate[];
}

export interface ContextField {
  key: string;
  label: Record<string, string>;
  placeholder?: Record<string, string>;
  required: boolean;
}

export interface StoryPageTemplate {
  pageNumber: number;
  textTemplate: Record<string, string>; // with {{childName}}, {{parent1Name}} etc placeholders
  illustrationPromptTemplate: string; // with {{traits}} placeholders
}

export interface BookPage {
  pageNumber: number;
  text: string;
  illustrationUrl: string;
}
