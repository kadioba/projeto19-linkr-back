CREATE TABLE
    "likes" (
        "id" serial NOT NULL,
        "user_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT 'true',
        CONSTRAINT "likes_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);