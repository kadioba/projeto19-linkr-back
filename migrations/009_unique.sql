ALTER TABLE "followers"
ADD
    CONSTRAINT "followers_unique" UNIQUE ("follower_id", "followed_id");