ALTER TABLE "posts"
ADD
    CONSTRAINT "posts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "sessions"
ADD
    CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "posts_hashtags"
ADD
    CONSTRAINT "posts_hashtags_fk0" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id");

ALTER TABLE "posts_hashtags"
ADD
    CONSTRAINT "posts_hashtags_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");

ALTER TABLE "likes"
ADD
    CONSTRAINT "likes_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "likes"
ADD
    CONSTRAINT "likes_fk1" FOREIGN KEY ("post_id") REFERENCES "posts"("id");