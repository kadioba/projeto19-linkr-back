CREATE TABLE
    "posts" (
        "id" serial NOT NULL,
        "user_id" integer NOT NULL,
        "content" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "url_title" TEXT NOT NULL,
        "url_description" TEXT NOT NULL,
        "url_picture" TEXT NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT 'NOW()',
        CONSTRAINT "posts_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);