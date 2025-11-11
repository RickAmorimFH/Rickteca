-- Tabela para armazenar curtidas dos livros
CREATE TABLE IF NOT EXISTS book_likes (
  id SERIAL PRIMARY KEY,
  book_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(book_id, user_email)
);

-- Tabela para armazenar avaliações dos livros
CREATE TABLE IF NOT EXISTS book_ratings (
  id SERIAL PRIMARY KEY,
  book_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(book_id, user_email)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_book_likes_book_id ON book_likes(book_id);
CREATE INDEX IF NOT EXISTS idx_book_ratings_book_id ON book_ratings(book_id);
