CREATE TABLE
    "sessions" (
        "id" serial NOT NULL,
        "token" TEXT NOT NULL,
        "user_id" integer NOT NULL,
        CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);