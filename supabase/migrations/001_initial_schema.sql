-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'klant' CHECK (role IN ('klant', 'bezorger', 'medewerker', 'admin')),
  name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  birthday DATE,
  newsletter_opt_in BOOLEAN DEFAULT FALSE,
  dietary_preferences JSONB DEFAULT '{}',
  language TEXT DEFAULT 'nl' CHECK (language IN ('nl', 'en', 'tr', 'ar')),
  loyalty_points INTEGER DEFAULT 0,
  loyalty_level TEXT DEFAULT 'brons' CHECK (loyalty_level IN ('brons', 'zilver', 'goud')),
  streak_weeks INTEGER DEFAULT 0,
  stamp_count INTEGER DEFAULT 0,
  pass_active BOOLEAN DEFAULT FALSE,
  blacklisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL DEFAULT 'Thuis',
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_nl TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  icon TEXT DEFAULT '🍽️'
);

-- Menu items
CREATE TABLE menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_nl TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_nl TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_tr TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  price DECIMAL(8, 2) NOT NULL,
  image_url TEXT DEFAULT '',
  preparation_time INTEGER DEFAULT 15,
  vegetarian BOOLEAN DEFAULT FALSE,
  seasonal BOOLEAN DEFAULT FALSE,
  seasonal_end_date DATE,
  sold_out BOOLEAN DEFAULT FALSE,
  allergens JSONB DEFAULT '{}',
  popular_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Addons
CREATE TABLE addons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
  name_nl TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_tr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  price DECIMAL(8, 2) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('afhalen', 'bezorgen')),
  status TEXT NOT NULL DEFAULT 'ontvangen' CHECK (status IN ('ontvangen', 'bereid', 'klaar', 'onderweg', 'afgeleverd', 'geannuleerd')),
  items JSONB NOT NULL DEFAULT '[]',
  addons JSONB DEFAULT '[]',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(8, 2) DEFAULT 0,
  tip DECIMAL(8, 2) DEFAULT 0,
  discount DECIMAL(8, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  points_earned INTEGER DEFAULT 0,
  points_redeemed INTEGER DEFAULT 0,
  address_id UUID REFERENCES addresses(id),
  scheduled_at TIMESTAMPTZ,
  contactless BOOLEAN DEFAULT FALSE,
  no_cutlery BOOLEAN DEFAULT FALSE,
  note TEXT DEFAULT '',
  coupon_code TEXT DEFAULT '',
  payment_intent_id TEXT DEFAULT '',
  payment_method TEXT DEFAULT 'ideal' CHECK (payment_method IN ('ideal', 'card', 'cadeaukaart', 'factuur')),
  group_order_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group orders
CREATE TABLE group_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  initiator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  link_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paid')),
  participants JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty transactions
CREATE TABLE loyalty_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  points INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'bonus', 'expire')),
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges
CREATE TABLE challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title_nl TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_tr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  description_nl TEXT DEFAULT '',
  target_count INTEGER NOT NULL,
  points_reward INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

-- Challenge progress
CREATE TABLE challenge_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  current_count INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);

-- Badges
CREATE TABLE badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🏆',
  description TEXT DEFAULT '',
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL
);

-- User badges
CREATE TABLE user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Coupons
CREATE TABLE coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(8, 2) NOT NULL,
  min_order DECIMAL(8, 2) DEFAULT 0,
  max_uses INTEGER DEFAULT 0,
  uses_count INTEGER DEFAULT 0,
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

-- Shifts
CREATE TABLE shifts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  orders_delivered INTEGER DEFAULT 0
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  sender_role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery zones
CREATE TABLE delivery_zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  polygon JSONB NOT NULL,
  fee DECIMAL(8, 2) DEFAULT 0,
  min_order DECIMAL(8, 2) DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

-- Reviews
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opening hours
CREATE TABLE opening_hours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  delivery_start TIME NOT NULL,
  delivery_end TIME NOT NULL,
  closed BOOLEAN DEFAULT FALSE,
  UNIQUE(day_of_week)
);

-- Settings
CREATE TABLE settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Public read for menu data
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can view/edit their own
CREATE POLICY "users_own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "admin_all_profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'medewerker'))
);

-- Addresses: users manage their own
CREATE POLICY "users_own_addresses" ON addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admin_all_addresses" ON addresses FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'bezorger'))
);

-- Orders: users see their own, admins/employees see all
CREATE POLICY "users_own_orders" ON orders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "staff_all_orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'medewerker', 'bezorger'))
);

-- Menu: public read
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (active = true);
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT USING (active = true);
CREATE POLICY "public_read_addons" ON addons FOR SELECT USING (active = true);
CREATE POLICY "public_read_coupons" ON coupons FOR SELECT USING (active = true);
CREATE POLICY "public_read_delivery_zones" ON delivery_zones FOR SELECT USING (active = true);
CREATE POLICY "public_read_opening_hours" ON opening_hours FOR SELECT USING (true);
CREATE POLICY "public_read_challenges" ON challenges FOR SELECT USING (active = true);
CREATE POLICY "public_read_badges" ON badges FOR SELECT USING (true);
CREATE POLICY "public_read_settings" ON settings FOR SELECT USING (true);

-- Admin write for menu
CREATE POLICY "admin_write_categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admin_write_menu_items" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Loyalty
CREATE POLICY "users_own_loyalty" ON loyalty_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_challenges" ON challenge_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_badges" ON user_badges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_own_reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- ================================================
-- TRIGGERS
-- ================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update orders.updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- SEED DATA
-- ================================================

INSERT INTO opening_hours (day_of_week, open_time, close_time, delivery_start, delivery_end) VALUES
  (0, '16:00', '22:00', '16:30', '21:30'),
  (1, '16:00', '22:00', '16:30', '21:30'),
  (2, '16:00', '22:00', '16:30', '21:30'),
  (3, '16:00', '22:00', '16:30', '21:30'),
  (4, '16:00', '22:30', '16:30', '22:00'),
  (5, '14:00', '23:00', '14:30', '22:30'),
  (6, '14:00', '22:30', '14:30', '22:00');

INSERT INTO coupons (code, type, value, min_order, max_uses, valid_from, valid_until) VALUES
  ('MOZAIK10', 'percentage', 10, 15, 1000, '2024-01-01', '2025-12-31');

INSERT INTO settings (key, value) VALUES
  ('restaurant_name', 'Mr. Mozaik'),
  ('restaurant_phone', '+31-341-000000'),
  ('restaurant_address', 'Kerkstraat 1, 3841 AB Harderwijk'),
  ('google_places_id', 'ChIJ...'),
  ('extra_wait_minutes', '0'),
  ('orders_paused', 'false');

INSERT INTO delivery_zones (name, polygon, fee, min_order) VALUES
  ('Harderwijk Centrum', '{"type":"Polygon","coordinates":[[...]]}', 0, 10),
  ('Harderwijk Buitenwijk', '{"type":"Polygon","coordinates":[[...]]}', 2, 15);
