export interface User {
  id: string;
  email: string;
  fullName?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Resume {
  id: string;
  fileName: string;
  uploadDate: string;
  content?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  matchScore?: number;
}

export interface ComparisonResult {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}
