CREATE TABLE
    "followers" (
        "id" serial NOT NULL,
        "follower_id" integer NOT NULL,
        "followed_id" integer NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT 'true',
        CONSTRAINT "followers_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);

CREATE TABLE
    "comments" (
        "id" serial NOT NULL,
        "content" TEXT NOT NULL,
        "commented_user_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        CONSTRAINT "comments_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);

CREATE TABLE
    "reposts" (
        "id" serial NOT NULL,
        "reposter_user_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        CONSTRAINT "reposts_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);

ALTER TABLE "followers"
ADD
    CONSTRAINT "followers_fk0" FOREIGN KEY ("follower_id") REFERENCES "users"("id");

ALTER TABLE "followers"
ADD
    CONSTRAINT "followers_fk1" FOREIGN KEY ("followed_id") REFERENCES "users"("id");

ALTER TABLE "comments"
ADD
    CONSTRAINT "comments_fk0" FOREIGN KEY ("commented_user_id") REFERENCES "users"("id");

ALTER TABLE "comments"
ADD
    CONSTRAINT "comments_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");

ALTER TABLE "reposts"
ADD
    CONSTRAINT "reposts_fk0" FOREIGN KEY ("reposter_user_id") REFERENCES "users"("id");

ALTER TABLE "reposts"
ADD
    CONSTRAINT "reposts_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");