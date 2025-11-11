-- Tabela para armazenar comentários dos livros
CREATE TABLE IF NOT EXISTS book_comments (
  id SERIAL PRIMARY KEY,
  book_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_book_comments_book_id ON book_comments(book_id);
CREATE INDEX IF NOT EXISTS idx_book_comments_created_at ON book_comments(created_at DESC);
