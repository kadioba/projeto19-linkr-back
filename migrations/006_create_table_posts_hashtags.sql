CREATE TABLE
    "posts_hashtags" (
        "id" serial NOT NULL,
        "hashtag_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        CONSTRAINT "posts_hashtags_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);