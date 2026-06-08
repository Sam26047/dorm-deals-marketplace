import { Listing, Bid, Message, Conversation, Category, Condition } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// ---------- Condition enum mapping (app uses underscore, DB uses hyphen) ----------
const toDbCondition = (c: Condition): string => (c === 'like_new' ? 'like-new' : c);
const fromDbCondition = (c: string): Condition =>
  (c === 'like-new' ? 'like_new' : c) as Condition;

// ---------- Row -> domain mappers ----------
type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  condition: string;
  image_url: string | null;
  image_urls: string[] | null;
  seller_id: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type BidRow = {
  id: string;
  product_id: string;
  bidder_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  product_id: string | null;
  content: string;
  read: boolean;
  created_at: string;
};

type ProfileLite = { id: string; username: string | null; avatar_url: string | null };

const profileName = (p?: ProfileLite | null, fallbackId?: string) =>
  p?.username || (fallbackId ? `User ${fallbackId.slice(0, 6)}` : 'Unknown');

const productToListing = (
  p: ProductRow,
  seller?: ProfileLite | null
): Listing => ({
  id: p.id,
  title: p.title,
  description: p.description ?? '',
  price: Number(p.price),
  category: p.category as Category,
  condition: fromDbCondition(p.condition),
  imageUrl: p.image_url || (p.image_urls && p.image_urls[0]) || '',
  sellerId: p.seller_id,
  sellerName: profileName(seller, p.seller_id),
  sellerAvatar: seller?.avatar_url || undefined,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

const bidRowToBid = (b: BidRow, bidder?: ProfileLite | null): Bid => ({
  id: b.id,
  listingId: b.product_id,
  buyerId: b.bidder_id,
  buyerName: profileName(bidder, b.bidder_id),
  buyerAvatar: bidder?.avatar_url || undefined,
  amount: Number(b.amount),
  status: (b.status as Bid['status']) || 'pending',
  createdAt: b.created_at,
});

const msgRowToMessage = (m: MessageRow): Message => ({
  id: m.id,
  senderId: m.sender_id,
  receiverId: m.receiver_id,
  content: m.content,
  createdAt: m.created_at,
  read: m.read,
});

// ---------- Profile batch fetch ----------
const fetchProfilesMap = async (ids: string[]): Promise<Map<string, ProfileLite>> => {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  if (unique.length === 0) return new Map();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', unique);
  if (error) {
    console.error('fetchProfilesMap error', error);
    return new Map();
  }
  return new Map((data || []).map((p) => [p.id, p as ProfileLite]));
};

// ---------- Conversation id (deterministic, derived from participant pair) ----------
const conversationIdFor = (a: string, b: string) => [a, b].sort().join('__');
const parseConversationId = (id: string): [string, string] => {
  const parts = id.split('__');
  return [parts[0], parts[1]];
};

// ============================================================================
// Listing service
// ============================================================================
export const listingService = {
  async getAll(): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = (data || []) as ProductRow[];
    const profiles = await fetchProfilesMap(rows.map((r) => r.seller_id));
    return rows.map((r) => productToListing(r, profiles.get(r.seller_id)));
  },

  async getById(id: string): Promise<Listing | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const row = data as ProductRow;
    const profiles = await fetchProfilesMap([row.seller_id]);
    return productToListing(row, profiles.get(row.seller_id));
  },

  async getBySellerId(sellerId: string): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = (data || []) as ProductRow[];
    const profiles = await fetchProfilesMap([sellerId]);
    return rows.map((r) => productToListing(r, profiles.get(r.seller_id)));
  },

  async create(
    listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Listing> {
    const insert = {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      condition: toDbCondition(listing.condition) as
        | 'new'
        | 'like-new'
        | 'good'
        | 'fair'
        | 'poor',
      image_url: listing.imageUrl || null,
      seller_id: listing.sellerId,
      status: 'active',
    };
    const { data, error } = await supabase
      .from('products')
      .insert(insert)
      .select('*')
      .single();
    if (error) throw error;
    const row = data as ProductRow;
    const profiles = await fetchProfilesMap([row.seller_id]);
    return productToListing(row, profiles.get(row.seller_id));
  },

  async update(id: string, updates: Partial<Listing>): Promise<Listing | undefined> {
    const patch: Record<string, unknown> = {};
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.price !== undefined) patch.price = updates.price;
    if (updates.category !== undefined) patch.category = updates.category;
    if (updates.condition !== undefined) patch.condition = toDbCondition(updates.condition);
    if (updates.imageUrl !== undefined) patch.image_url = updates.imageUrl;

    const { data, error } = await supabase
      .from('products')
      .update(patch)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const row = data as ProductRow;
    const profiles = await fetchProfilesMap([row.seller_id]);
    return productToListing(row, profiles.get(row.seller_id));
  },

  async delete(id: string): Promise<boolean> {
    // Remove associated bids and messages first (no DB-level cascade configured)
    await supabase.from('bids').delete().eq('product_id', id);
    await supabase.from('messages').delete().eq('product_id', id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async search(
    query: string,
    category?: Category,
    minPrice?: number,
    maxPrice?: number
  ): Promise<Listing[]> {
    let q = supabase.from('products').select('*').order('created_at', { ascending: false });
    if (category) q = q.eq('category', category);
    if (minPrice !== undefined) q = q.gte('price', minPrice);
    if (maxPrice !== undefined) q = q.lte('price', maxPrice);
    if (query && query.trim()) {
      const safe = query.replace(/[%,]/g, ' ').trim();
      q = q.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`);
    }
    const { data, error } = await q;
    if (error) throw error;
    const rows = (data || []) as ProductRow[];
    const profiles = await fetchProfilesMap(rows.map((r) => r.seller_id));
    return rows.map((r) => productToListing(r, profiles.get(r.seller_id)));
  },
};

// ============================================================================
// Bid service
// ============================================================================
export const bidService = {
  async getByListingId(listingId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('product_id', listingId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = (data || []) as BidRow[];
    const profiles = await fetchProfilesMap(rows.map((r) => r.bidder_id));
    return rows.map((r) => bidRowToBid(r, profiles.get(r.bidder_id)));
  },

  async getByBuyerId(buyerId: string): Promise<Bid[]> {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('bidder_id', buyerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = (data || []) as BidRow[];
    const profiles = await fetchProfilesMap([buyerId]);
    return rows.map((r) => bidRowToBid(r, profiles.get(r.bidder_id)));
  },

  async create(bid: Omit<Bid, 'id' | 'createdAt' | 'status'>): Promise<Bid> {
    const { data, error } = await supabase
      .from('bids')
      .insert({
        product_id: bid.listingId,
        bidder_id: bid.buyerId,
        amount: bid.amount,
        status: 'pending',
      })
      .select('*')
      .single();
    if (error) throw error;
    const row = data as BidRow;
    const profiles = await fetchProfilesMap([row.bidder_id]);
    return bidRowToBid(row, profiles.get(row.bidder_id));
  },

  async updateStatus(
    id: string,
    status: 'accepted' | 'rejected'
  ): Promise<Bid | undefined> {
    const { data, error } = await supabase
      .from('bids')
      .update({ status })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const row = data as BidRow;
    const profiles = await fetchProfilesMap([row.bidder_id]);
    return bidRowToBid(row, profiles.get(row.bidder_id));
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('bids').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

// ============================================================================
// Conversation service (synthesized from messages — no conversations table)
// ============================================================================
export const conversationService = {
  async getByUserId(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });
    if (error) throw error;
    const rows = (data || []) as MessageRow[];

    // Group by "other participant"
    const groups = new Map<
      string,
      { other: string; messages: MessageRow[]; unread: number }
    >();
    for (const m of rows) {
      const other = m.sender_id === userId ? m.receiver_id : m.sender_id;
      const g = groups.get(other) || { other, messages: [], unread: 0 };
      g.messages.push(m);
      if (!m.read && m.receiver_id === userId) g.unread += 1;
      groups.set(other, g);
    }

    const otherIds = Array.from(groups.keys());
    const profiles = await fetchProfilesMap([userId, ...otherIds]);
    const me = profiles.get(userId);

    const conversations: Conversation[] = otherIds.map((otherId) => {
      const g = groups.get(otherId)!;
      const last = g.messages[g.messages.length - 1];
      const otherProfile = profiles.get(otherId);
      return {
        id: conversationIdFor(userId, otherId),
        participantIds: [userId, otherId],
        participantNames: [profileName(me, userId), profileName(otherProfile, otherId)],
        participantAvatars: [me?.avatar_url || undefined, otherProfile?.avatar_url || undefined],
        lastMessage: last?.content,
        lastMessageDate: last?.created_at,
        unreadCount: g.unread,
      };
    });

    conversations.sort((a, b) =>
      (b.lastMessageDate || '').localeCompare(a.lastMessageDate || '')
    );
    return conversations;
  },

  async getById(id: string): Promise<Conversation | undefined> {
    const [a, b] = parseConversationId(id);
    if (!a || !b) return undefined;
    const profiles = await fetchProfilesMap([a, b]);
    return {
      id,
      participantIds: [a, b],
      participantNames: [profileName(profiles.get(a), a), profileName(profiles.get(b), b)],
      participantAvatars: [profiles.get(a)?.avatar_url || undefined, profiles.get(b)?.avatar_url || undefined],
      unreadCount: 0,
    };
  },

  async findOrCreateConversation(
    user1Id: string,
    user2Id: string,
    _user1Name: string,
    _user2Name: string
  ): Promise<Conversation> {
    const id = conversationIdFor(user1Id, user2Id);
    const profiles = await fetchProfilesMap([user1Id, user2Id]);
    return {
      id,
      participantIds: [user1Id, user2Id],
      participantNames: [
        profileName(profiles.get(user1Id), user1Id),
        profileName(profiles.get(user2Id), user2Id),
      ],
      participantAvatars: [
        profiles.get(user1Id)?.avatar_url || undefined,
        profiles.get(user2Id)?.avatar_url || undefined,
      ],
      unreadCount: 0,
    };
  },

  async updateUnreadCount(id: string, userId: string): Promise<void> {
    const [a, b] = parseConversationId(id);
    const other = a === userId ? b : a;
    if (!other) return;
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', other)
      .eq('receiver_id', userId)
      .eq('read', false);
  },
};

// ============================================================================
// Message service
// ============================================================================
export const messageService = {
  async getByConversationId(conversationId: string): Promise<Message[]> {
    const [a, b] = parseConversationId(conversationId);
    if (!a || !b) return [];
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${a},receiver_id.eq.${b}),and(sender_id.eq.${b},receiver_id.eq.${a})`
      )
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map((m) => msgRowToMessage(m as MessageRow));
  },

  async sendMessage(
    conversationId: string,
    message: Omit<Message, 'id' | 'createdAt' | 'read'>
  ): Promise<Message> {
    // conversationId is informational; sender/receiver carry the truth
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: message.senderId,
        receiver_id: message.receiverId,
        content: message.content,
        read: false,
      })
      .select('*')
      .single();
    if (error) throw error;
    return msgRowToMessage(data as MessageRow);
  },

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const [a, b] = parseConversationId(conversationId);
    const other = a === userId ? b : a;
    if (!other) return;
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', other)
      .eq('receiver_id', userId)
      .eq('read', false);
  },
};

// ============================================================================
// Static lookups & formatters
// ============================================================================
export const categories = [
  { value: 'textbooks', label: 'Textbooks' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'school_supplies', label: 'School Supplies' },
  { value: 'engineering_tools', label: 'Engineering Tools' },
  { value: 'lab_equipment', label: 'Lab Equipment' },
  { value: 'dorm_essentials', label: 'Dorm Essentials' },
  { value: 'other', label: 'Other' },
];

export const conditions: { value: Condition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

export const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(dateStr)
  );
