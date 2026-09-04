export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type Review = {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewFormData = Pick<Review, 'customerName' | 'rating' | 'comment'>;
