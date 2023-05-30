# projeto19-linkr-back

```
projeto19-linkr-back
├── .env.example
├── .gitignore
├── migrations
│   ├── 001_create_table_users.sql
│   ├── 002_create_table_sessions.sql
│   ├── 003_create_table_posts.sql
│   ├── 004_create_table_users_posts.sql
│   ├── 005_create_table_likes.sql
│   ├── 006_create_table_hashtags.sql
│   ├── 007_create_table_posts_hashtags.sql
│   └── 008_alter_tables_add_constrains.sql
├── package-lock.json
├── package.json
├── README.md
└── src
    ├── app.js
    ├── configs
    │   └── database.connection.js
    ├── controllers
    │   └── user.controller.js
    ├── errors
    │   └── index.errors.js
    ├── middlewares
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   └── validateSchema.middleware.js
    ├── repositories
    │   └── user.repository.js
    ├── routers
    │   ├── index.router.js
    │   └── users.router.js
    ├── schemas
    │   └── user.schema.js
    ├── services
    │   └── user.service.js
    └── utils
        └── uuidValidator.util.js
```