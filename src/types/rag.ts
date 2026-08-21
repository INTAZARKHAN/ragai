export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  pageNumber?: number;
  chunkIndex: number;
  source?: string;
}

export interface RetrievedChunk {
  id: string;
  score: number;
  content: string;
  documentName: string;
  pageNumber?: number;
}