CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  name TEXT,
  lang TEXT DEFAULT 'ru',
  type TEXT,
  source TEXT,
  iq_estimated INTEGER,
  iq_min INTEGER,
  iq_max INTEGER,
  score INTEGER,
  total INTEGER,
  extended_test INTEGER DEFAULT 0,
  kids_test INTEGER DEFAULT 0,
  newsletter INTEGER DEFAULT 0,
  traffic_source TEXT,
  ai_referrer TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  creator_name TEXT,
  creator_email TEXT,
  creator_iq INTEGER,
  creator_test_type TEXT DEFAULT 'quick',
  lang TEXT DEFAULT 'en',
  created_at TEXT DEFAULT (datetime('now'))
);
