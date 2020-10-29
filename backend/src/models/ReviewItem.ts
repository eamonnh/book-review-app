 export interface ReviewItem {
    userId: string
    reviewId: string
    createdAt: string
    title: string
    reviewedAt: string
    score: number
    summary: string
    notes: string
    ISBN: string
    attachmentUrl?: string
  }