CREATE TABLE
    "sessions" (
        "id" serial NOT NULL,
        "token" TEXT NOT NULL,
        "user_id" integer NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT 'true',
        CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);