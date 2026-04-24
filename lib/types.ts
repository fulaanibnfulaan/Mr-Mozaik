export type UserRole = 'klant' | 'bezorger' | 'medewerker' | 'admin'
export type OrderStatus = 'ontvangen' | 'bereid' | 'klaar' | 'onderweg' | 'afgeleverd' | 'geannuleerd'
export type OrderType = 'afhalen' | 'bezorgen'
export type LoyaltyLevel = 'brons' | 'zilver' | 'goud'
export type Language = 'nl' | 'en' | 'tr' | 'ar'
export type PaymentMethod = 'ideal' | 'card' | 'cadeaukaart' | 'factuur'

export interface Profile {
  id: string
  role: UserRole
  name: string
  phone: string
  birthday?: string
  newsletter_opt_in: boolean
  dietary_preferences: DietaryPreferences
  language: Language
  loyalty_points: number
  loyalty_level: LoyaltyLevel
  streak_weeks: number
  stamp_count: number
  pass_active: boolean
  blacklisted: boolean
  created_at: string
}

export interface DietaryPreferences {
  vegetarian?: boolean
  no_onion?: boolean
  no_coriander?: boolean
  no_nuts?: boolean
  gluten_free?: boolean
  lactose_free?: boolean
}

export interface Address {
  id: string
  user_id: string
  label: string
  street: string
  city: string
  postcode: string
  lat: number
  lng: number
  is_default: boolean
}

export interface Category {
  id: string
  name_nl: string
  name_en: string
  name_tr: string
  name_ar: string
  sort_order: number
  active: boolean
  icon?: string
}

export interface Allergens {
  gluten?: boolean
  nuts?: boolean
  lactose?: boolean
  eggs?: boolean
  fish?: boolean
  soy?: boolean
}

export interface MenuItem {
  id: string
  category_id: string
  name_nl: string
  name_en: string
  name_tr: string
  name_ar: string
  description_nl: string
  description_en: string
  description_tr: string
  description_ar: string
  price: number
  image_url: string
  preparation_time: number
  vegetarian: boolean
  seasonal: boolean
  seasonal_end_date?: string
  sold_out: boolean
  allergens: Allergens
  popular_count: number
  active: boolean
  category?: Category
  addons?: Addon[]
}

export interface Addon {
  id: string
  menu_item_id: string
  name_nl: string
  name_en: string
  name_tr: string
  name_ar: string
  price: number
  active: boolean
}

export interface CartItem {
  id: string
  menu_item: MenuItem
  quantity: number
  selected_addons: Addon[]
  note?: string
}

export interface Order {
  id: string
  user_id: string
  type: OrderType
  status: OrderStatus
  items: CartItem[]
  subtotal: number
  delivery_fee: number
  tip: number
  discount: number
  total: number
  points_earned: number
  points_redeemed: number
  address_id?: string
  address?: Address
  scheduled_at?: string
  contactless: boolean
  no_cutlery: boolean
  note?: string
  coupon_code?: string
  payment_intent_id?: string
  payment_method: PaymentMethod
  group_order_id?: string
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface GroupOrder {
  id: string
  initiator_id: string
  link_token: string
  status: 'open' | 'closed' | 'paid'
  participants: GroupParticipant[]
  created_at: string
}

export interface GroupParticipant {
  user_id: string
  name: string
  items: CartItem[]
}

export interface LoyaltyTransaction {
  id: string
  user_id: string
  order_id?: string
  points: number
  type: 'earn' | 'redeem' | 'bonus' | 'expire'
  description: string
  created_at: string
}

export interface Challenge {
  id: string
  title_nl: string
  title_en: string
  title_tr: string
  title_ar: string
  description_nl: string
  target_count: number
  points_reward: number
  start_date: string
  end_date: string
  active: boolean
}

export interface ChallengeProgress {
  id: string
  user_id: string
  challenge_id: string
  current_count: number
  completed_at?: string
  challenge?: Challenge
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  condition_type: string
  condition_value: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order: number
  max_uses: number
  uses_count: number
  valid_from: string
  valid_until: string
  active: boolean
}

export interface Shift {
  id: string
  user_id: string
  date: string
  start_time: string
  end_time: string
  orders_delivered: number
}

export interface ChatMessage {
  id: string
  order_id: string
  sender_role: UserRole
  message: string
  created_at: string
}

export interface DeliveryZone {
  id: string
  name: string
  polygon: GeoJSON.Polygon
  fee: number
  min_order: number
  active: boolean
}

export interface Review {
  id: string
  order_id: string
  user_id: string
  rating: number
  comment?: string
  photo_url?: string
  created_at: string
}

export interface OpeningHours {
  id: string
  day_of_week: number
  open_time: string
  close_time: string
  delivery_start: string
  delivery_end: string
  closed: boolean
}

export interface Setting {
  id: string
  key: string
  value: string
}
