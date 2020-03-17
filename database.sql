CREATE TABLE "recipes" (
	"id" SERIAL PRIMARY KEY,
    "chef_id" int NOT NULL,
    "image" text NOT NULL,
    "title" text NOT NULL,
    "ingredients" text[] NOT NULL,
    "preparation" text[] NOT NULL,
    "information" text,
    "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "avatar_url" text NOT NULL,
    "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "files" (
	"id" SERIAL PRIMARY KEY,
    "name" text,
    "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
    "id" SERIAL PRIMARY KEY,
    "recipe_id" int REFERENCES "recipes"("id"),
    "file_id" int REFERENCES "files"("id")
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id")REFERENCES "chefs"("id");
ALTER TABLE "recipes" DROP COLUMN "image";
ALTER TABLE "chefs" DROP COLUMN "avatar_url";
ALTER TABLE "chefs" ADD COLUMN "file_id" int REFERENCES "files"("id");

CREATE TABLE "users" (
	"id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "reset_token" text,
    "reset_token_expires" text,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

ALTER TABLE "recipes" ADD COLUMN "user_id" int REFERENCES "users"("id");

-- connect pg simple table
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;