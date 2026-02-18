-- Create new table with the desired schema
CREATE TABLE `user_new` (
  `id` text PRIMARY KEY NOT NULL,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password_hash` text,
  `github_id` text,
  `google_id` text,
  CONSTRAINT `user_email_unique` UNIQUE(`email`),
  CONSTRAINT `user_github_id_unique` UNIQUE(`github_id`),
  CONSTRAINT `user_google_id_unique` UNIQUE(`google_id`)
);

-- Copy data from the old table, providing a placeholder email for existing rows
INSERT INTO `user_new` (`id`, `username`, `email`, `password_hash`, `github_id`, `google_id`)
SELECT 
  `id`, 
  `username`, 
  -- Use username@placeholder.com as a temporary email (users can update later)
  `username` || '@placeholder.com', 
  `password_hash`, 
  NULL, 
  NULL 
FROM `user`;

-- Drop the old table
DROP TABLE `user`;

-- Rename the new table
ALTER TABLE `user_new` RENAME TO `user`;