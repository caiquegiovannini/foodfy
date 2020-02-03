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