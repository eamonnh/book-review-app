 export interface ReviewItem {
    userId: string
    reviewId: string
    createdAt: string
    title: string
    reviewedAt: string
    score: string
    summary: string
    notes: string
    ISBN: string
    attachmentUrl?: string
  }