export interface Review {
    userId: string
    reviewId: string
    createdAt: string
    ISBN: string
    notes: string
    reviewedAt: string
    score: string
    summary: string
    title: string
    attachmentUrl?: string  
}