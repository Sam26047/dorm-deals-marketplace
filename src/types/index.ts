
export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
};

export type Category = 
  | "textbooks" 
  | "electronics" 
  | "furniture" 
  | "clothing" 
  | "kitchen" 
  | "school_supplies" 
  | "other";

export type Condition = 
  | "new" 
  | "like_new" 
  | "good" 
  | "fair" 
  | "poor";

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type Bid = {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  amount: number;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  listing?: Listing; // Added the optional listing property
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars?: (string | undefined)[];
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount: number;
};
