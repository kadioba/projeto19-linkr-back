CREATE TABLE
    "users" (
        "id" serial NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "picture" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT NOW(),
        CONSTRAINT "users_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);