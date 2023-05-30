CREATE TABLE
    "posts" (
        "id" serial NOT NULL,
        "content" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "created_at" timestamptz NOT NULL,
        CONSTRAINT "posts_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);