# projeto19-linkr-back

```
projeto19-linkr-back
├── .env.example
├── .gitignore
├── dump.sql
├── migrations
│  ├── 001_create_table_users.sql
│  ├── 002_create_table_sessions.sql
│  ├── 003_create_table_posts.sql
│  ├── 004_create_table_likes.sql
│  ├── 005_create_table_hashtags.sql
│  ├── 006_create_table_posts_hashtags.sql
│  └── 007_alter_tables_add_constrains.sql
├── package-lock.json
├── package.json
├── README.md
└── src
  ├── app.js
  ├── configs
  │  └── database.connection.js
  ├── controllers
  │  ├── hashtag.controller.js
  │  ├── post.controller.js
  │  └── user.controller.js
  ├── errors
  │  └── index.errors.js
  ├── middlewares
  │  ├── auth.middleware.js
  │  ├── error.middleware.js
  │  └── validateSchema.middleware.js
  ├── repositories
  │  ├── hashtag.repository.js
  │  ├── post.repository.js
  │  └── user.repository.js
  ├── routers
  │  ├── hashtags.router.js
  │  ├── index.router.js
  │  ├── post.router.js
  │  └── users.router.js
  ├── schemas
  │  ├── post.schema.js
  │  └── user.schema.js
  ├── services
  │  ├── hashtag.service.js
  │  ├── post.service.js
  │  └── user.service.js
  └── utils
    ├── extractHashtags.util.js
    └── uuidValidator.util.js
```