CREATE TABLE
    "hashtags" (
        "id" serial NOT NULL,
        "name" TEXT NOT NULL UNIQUE,
        CONSTRAINT "hashtags_pk" PRIMARY KEY ("id")
    )
WITH (OIDS = FALSE);