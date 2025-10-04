export interface BitacoraEntry {
  id: string;
  title: string;
  date: string;
  participants: string[];
  topic: string;
  notes: string;
  photos?: string[];
  audioNote?: string;
  tags?: string[];
  createdAt: string;
}