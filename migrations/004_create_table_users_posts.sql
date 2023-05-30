CREATE TABLE
    "users_posts" (
        "id" serial NOT NULL,
        "user_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        CONSTRAINT "users_posts_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);