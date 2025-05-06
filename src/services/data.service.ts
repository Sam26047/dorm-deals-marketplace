import { Listing, Bid, Message, Conversation, Category, Condition, User } from '@/types';

// Sample data
const sampleListings: Listing[] = [
  {
    id: '1',
    title: 'Computer Science Textbook',
    description: 'Introduction to Algorithms by Cormen, slightly used. Great condition with no markings or highlights.',
    price: 40,
    category: 'textbooks',
    condition: 'good',
    imageUrl: 'https://images.unsplash.com/photo-1581087607783-3d091715642d?q=80&w=2000&auto=format&fit=crop',
    sellerId: 'user1',
    sellerName: 'Alex Johnson',
    createdAt: '2023-05-15T14:48:00.000Z',
    updatedAt: '2023-05-15T14:48:00.000Z',
  },
  {
    id: '2',
    title: 'Mini Refrigerator',
    description: 'Perfect for dorm rooms. 2.7 cubic feet with freezer compartment. Works great!',
    price: 75,
    category: 'electronics',
    condition: 'good',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=2000&auto=format&fit=crop',
    sellerId: 'user2',
    sellerName: 'Jamie Smith',
    createdAt: '2023-05-18T09:30:00.000Z',
    updatedAt: '2023-05-18T09:30:00.000Z',
  },
  {
    id: '3',
    title: 'Desk Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness settings and USB charging port.',
    price: 25,
    category: 'electronics',
    condition: 'like_new',
    imageUrl: 'https://images.unsplash.com/photo-1534381025218-07e4a1d7bf85?q=80&w=2000&auto=format&fit=crop',
    sellerId: 'user1',
    sellerName: 'Alex Johnson',
    createdAt: '2023-05-20T16:15:00.000Z',
    updatedAt: '2023-05-20T16:15:00.000Z',
  },
  {
    id: '4',
    title: 'Comfortable Futon',
    description: 'Converts from sofa to bed. Black microfiber cover. 1 year old but in excellent condition.',
    price: 120,
    category: 'furniture',
    condition: 'good',
    imageUrl: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=2000&auto=format&fit=crop',
    sellerId: 'user3',
    sellerName: 'Taylor Wilson',
    createdAt: '2023-05-22T11:20:00.000Z',
    updatedAt: '2023-05-22T11:20:00.000Z',
  },
  {
    id: '5',
    title: 'Calculus Textbook',
    description: 'Calculus: Early Transcendentals, 8th Edition. No highlights or notes.',
    price: 50,
    category: 'textbooks',
    condition: 'like_new',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2000&auto=format&fit=crop',
    sellerId: 'user4',
    sellerName: 'Jordan Lee',
    createdAt: '2023-05-25T08:45:00.000Z',
    updatedAt: '2023-05-25T08:45:00.000Z',
  },
  {
    id: '6',
    title: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones. 30-hour battery life. Minor wear on ear pads.',
    price: 65,
    category: 'electronics',
    condition: 'good',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop',
    sellerId: 'user2',
    sellerName: 'Jamie Smith',
    createdAt: '2023-05-28T13:10:00.000Z',
    updatedAt: '2023-05-28T13:10:00.000Z',
  }
];

// Sample bids
const sampleBids: Bid[] = [
  {
    id: 'bid1',
    listingId: '1',
    buyerId: 'user2',
    buyerName: 'Jamie Smith',
    amount: 35,
    message: 'Would you take $35?',
    status: 'pending',
    createdAt: '2023-05-16T10:30:00.000Z',
  },
  {
    id: 'bid2',
    listingId: '1',
    buyerId: 'user3',
    buyerName: 'Taylor Wilson',
    amount: 38,
    message: 'I can pick up today!',
    status: 'pending',
    createdAt: '2023-05-16T14:45:00.000Z',
  },
  {
    id: 'bid3',
    listingId: '4',
    buyerId: 'user1',
    buyerName: 'Alex Johnson',
    amount: 110,
    message: 'Would you consider $110?',
    status: 'pending',
    createdAt: '2023-05-23T09:20:00.000Z',
  }
];

// Sample conversations
const sampleConversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['user1', 'user2'],
    participantNames: ['Alex Johnson', 'Jamie Smith'],
    lastMessage: 'Is the textbook still available?',
    lastMessageDate: '2023-05-16T10:35:00.000Z',
    unreadCount: 1
  },
  {
    id: 'conv2',
    participantIds: ['user1', 'user3'],
    participantNames: ['Alex Johnson', 'Taylor Wilson'],
    lastMessage: 'Can I see more photos of the lamp?',
    lastMessageDate: '2023-05-20T16:30:00.000Z',
    unreadCount: 0
  }
];

// Sample messages
const sampleMessages: Record<string, Message[]> = {
  'conv1': [
    {
      id: 'msg1',
      senderId: 'user2',
      receiverId: 'user1',
      content: 'Hi, is the textbook still available?',
      createdAt: '2023-05-16T10:30:00.000Z',
      read: true
    },
    {
      id: 'msg2',
      senderId: 'user1',
      receiverId: 'user2',
      content: 'Yes, it is! Are you interested?',
      createdAt: '2023-05-16T10:32:00.000Z',
      read: true
    },
    {
      id: 'msg3',
      senderId: 'user2',
      receiverId: 'user1',
      content: 'Is the textbook still available?',
      createdAt: '2023-05-16T10:35:00.000Z',
      read: false
    }
  ],
  'conv2': [
    {
      id: 'msg4',
      senderId: 'user3',
      receiverId: 'user1',
      content: 'Hello! I\'m interested in your desk lamp.',
      createdAt: '2023-05-20T16:30:00.000Z',
      read: true
    },
    {
      id: 'msg5',
      senderId: 'user1',
      receiverId: 'user3',
      content: 'Great! It\'s still available.',
      createdAt: '2023-05-20T16:45:00.000Z',
      read: true
    },
    {
      id: 'msg6',
      senderId: 'user3',
      receiverId: 'user1',
      content: 'Can I see more photos of the lamp?',
      createdAt: '2023-05-20T17:20:00.000Z',
      read: true
    }
  ]
};

// LocalStorage keys
const LISTINGS_KEY = 'campus_marketplace_listings';
const BIDS_KEY = 'campus_marketplace_bids';
const CONVERSATIONS_KEY = 'campus_marketplace_conversations';
const MESSAGES_KEY = 'campus_marketplace_messages';

// Initialize data in localStorage if it doesn't exist
const initializeData = () => {
  if (!localStorage.getItem(LISTINGS_KEY)) {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(sampleListings));
  }
  if (!localStorage.getItem(BIDS_KEY)) {
    localStorage.setItem(BIDS_KEY, JSON.stringify(sampleBids));
  }
  if (!localStorage.getItem(CONVERSATIONS_KEY)) {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(sampleConversations));
  }
  if (!localStorage.getItem(MESSAGES_KEY)) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(sampleMessages));
  }
};

// Helper to simulate API delay
const simulateDelay = async () => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
};

// Initialize when the service is imported
initializeData();

// Listing services
export const listingService = {
  async getAll(): Promise<Listing[]> {
    await simulateDelay();
    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    return listings;
  },

  async getById(id: string): Promise<Listing | undefined> {
    await simulateDelay();
    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    return listings.find((listing: Listing) => listing.id === id);
  },

  async getBySellerId(sellerId: string): Promise<Listing[]> {
    await simulateDelay();
    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    return listings.filter((listing: Listing) => listing.sellerId === sellerId);
  },
  
  async create(listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> {
    await simulateDelay();
    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    const newListing: Listing = {
      ...listing,
      id: `listing-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    listings.push(newListing);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    return newListing;
  },

  async update(id: string, updates: Partial<Listing>): Promise<Listing | undefined> {
    await simulateDelay();
    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    const index = listings.findIndex((listing: Listing) => listing.id === id);
    if (index !== -1) {
      listings[index] = {
        ...listings[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
      return listings[index];
    }
    return undefined;
  },

  async delete(id: string): Promise<boolean> {
    await simulateDelay();
    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    const filteredListings = listings.filter((listing: Listing) => listing.id !== id);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(filteredListings));
    
    // Also delete associated bids
    const bids = JSON.parse(localStorage.getItem(BIDS_KEY) || '[]');
    const filteredBids = bids.filter((bid: Bid) => bid.listingId !== id);
    localStorage.setItem(BIDS_KEY, JSON.stringify(filteredBids));
    
    return true;
  },

  async search(query: string, category?: Category, minPrice?: number, maxPrice?: number): Promise<Listing[]> {
    await simulateDelay();
    const listings = JSON.parse(localStorage.getItem(LISTINGS_KEY) || '[]');
    
    return listings.filter((listing: Listing) => {
      const matchesQuery = query ? 
        listing.title.toLowerCase().includes(query.toLowerCase()) || 
        listing.description.toLowerCase().includes(query.toLowerCase()) : 
        true;
      
      const matchesCategory = category ? listing.category === category : true;
      
      const matchesMinPrice = minPrice !== undefined ? listing.price >= minPrice : true;
      const matchesMaxPrice = maxPrice !== undefined ? listing.price <= maxPrice : true;
      
      return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }
};

// Bid services
export const bidService = {
  async getByListingId(listingId: string): Promise<Bid[]> {
    await simulateDelay();
    const bids = JSON.parse(localStorage.getItem(BIDS_KEY) || '[]');
    return bids.filter((bid: Bid) => bid.listingId === listingId);
  },

  async getByBuyerId(buyerId: string): Promise<Bid[]> {
    await simulateDelay();
    const bids = JSON.parse(localStorage.getItem(BIDS_KEY) || '[]');
    return bids.filter((bid: Bid) => bid.buyerId === buyerId);
  },

  async create(bid: Omit<Bid, 'id' | 'createdAt' | 'status'>): Promise<Bid> {
    await simulateDelay();
    const bids = JSON.parse(localStorage.getItem(BIDS_KEY) || '[]');
    const newBid: Bid = {
      ...bid,
      id: `bid-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    bids.push(newBid);
    localStorage.setItem(BIDS_KEY, JSON.stringify(bids));
    return newBid;
  },

  async updateStatus(id: string, status: 'accepted' | 'rejected'): Promise<Bid | undefined> {
    await simulateDelay();
    const bids = JSON.parse(localStorage.getItem(BIDS_KEY) || '[]');
    const index = bids.findIndex((bid: Bid) => bid.id === id);
    if (index !== -1) {
      bids[index] = {
        ...bids[index],
        status
      };
      localStorage.setItem(BIDS_KEY, JSON.stringify(bids));
      return bids[index];
    }
    return undefined;
  },

  async delete(id: string): Promise<boolean> {
    await simulateDelay();
    const bids = JSON.parse(localStorage.getItem(BIDS_KEY) || '[]');
    const filteredBids = bids.filter((bid: Bid) => bid.id !== id);
    localStorage.setItem(BIDS_KEY, JSON.stringify(filteredBids));
    return true;
  }
};

// Conversation services
export const conversationService = {
  async getByUserId(userId: string): Promise<Conversation[]> {
    await simulateDelay();
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    return conversations.filter((conv: Conversation) => conv.participantIds.includes(userId));
  },

  async getById(id: string): Promise<Conversation | undefined> {
    await simulateDelay();
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    return conversations.find((conv: Conversation) => conv.id === id);
  },

  async findOrCreateConversation(user1Id: string, user2Id: string, user1Name: string, user2Name: string): Promise<Conversation> {
    await simulateDelay();
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    
    // Find existing conversation
    const existingConv = conversations.find(
      (conv: Conversation) => 
        conv.participantIds.includes(user1Id) && 
        conv.participantIds.includes(user2Id)
    );
    
    if (existingConv) return existingConv;
    
    // Create new conversation
    const newConversation: Conversation = {
      id: `conv-${Math.random().toString(36).substr(2, 9)}`,
      participantIds: [user1Id, user2Id],
      participantNames: [user1Name, user2Name],
      unreadCount: 0
    };
    
    conversations.push(newConversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    
    // Initialize messages array for this conversation
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '{}');
    allMessages[newConversation.id] = [];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    
    return newConversation;
  },
  
  async updateUnreadCount(id: string, userId: string): Promise<void> {
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    const index = conversations.findIndex((conv: Conversation) => conv.id === id);
    if (index !== -1) {
      conversations[index].unreadCount = 0;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
  }
};

// Message services
export const messageService = {
  async getByConversationId(conversationId: string): Promise<Message[]> {
    await simulateDelay();
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '{}');
    return allMessages[conversationId] || [];
  },

  async sendMessage(conversationId: string, message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> {
    await simulateDelay();
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '{}');
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    
    // Create the new message
    const newMessage: Message = {
      ...message,
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    // Add to messages
    if (!allMessages[conversationId]) {
      allMessages[conversationId] = [];
    }
    allMessages[conversationId].push(newMessage);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    
    // Update conversation with last message
    const convIndex = conversations.findIndex((conv: Conversation) => conv.id === conversationId);
    if (convIndex !== -1) {
      // Increment unread count if receiver has unread messages
      const receiverIndex = conversations[convIndex].participantIds.findIndex(id => id === message.receiverId);
      if (receiverIndex !== -1) {
        conversations[convIndex].unreadCount = (conversations[convIndex].unreadCount || 0) + 1;
      }
      
      conversations[convIndex].lastMessage = message.content;
      conversations[convIndex].lastMessageDate = newMessage.createdAt;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
    
    return newMessage;
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await simulateDelay();
    const allMessages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '{}');
    const messages = allMessages[conversationId] || [];
    
    messages.forEach((msg: Message) => {
      if (msg.receiverId === userId && !msg.read) {
        msg.read = true;
      }
    });
    
    allMessages[conversationId] = messages;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
    
    // Update unread count in conversation
    const conversations = JSON.parse(localStorage.getItem(CONVERSATIONS_KEY) || '[]');
    const convIndex = conversations.findIndex((conv: Conversation) => conv.id === conversationId);
    if (convIndex !== -1) {
      conversations[convIndex].unreadCount = 0;
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    }
  }
};

// Updated categories to match the Category type in types/index.ts
export const categories = [
  { value: "textbooks", label: "Textbooks" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "clothing", label: "Clothing" },
  { value: "kitchen", label: "Kitchen" },
  { value: "school_supplies", label: "School Supplies" },
  { value: "engineering_tools", label: "Engineering Tools" },
  { value: "lab_equipment", label: "Lab Equipment" },
  { value: "dorm_essentials", label: "Dorm Essentials" },
  { value: "other", label: "Other" }
];

// Conditions
export const conditions: { value: Condition, label: string }[] = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" }
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
