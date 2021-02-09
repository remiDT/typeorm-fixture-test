Database Configuration
==========
You can use .env, ormconfig.json or a js object.    
If you're using nestjs, the js object is the best way. .env and ormconfig may generate entity errors. 

##PostgreSQL

###.env

```
TYPEORM_CONNECTION = postgres
TYPEORM_HOST = localhost
TYPEORM_USERNAME = username
TYPEORM_PASSWORD = password
TYPEORM_DATABASE = fixture
TYPEORM_PORT = 5432
TYPEORM_SYNCHRONIZE = false
TYPEORM_ENTITIES = src/entity/**/*.ts
```

###ormconfig.json

```
{
"type": "postgres",
"host": "localhost",
"port": 5432,
"username": "username",
"password": "password",
"database": "fixture",
"synchronize": "false"
"entities: ["src/entity/**/*.ts"]
}
```

##SQLite

###.env

```
TYPEORM_CONNECTION = sqlite
TYPEORM_DATABASE = /tmp/dbtest.db
TYPEORM_SYNCHRONIZE = false
TYPEORM_LOGGING = false
TYPEORM_ENTITIES = src/entity/**/*.ts
```

###ormconfig.json
```
{
"type": "sqlite",
"database": "/tmp/dbtest.db",
"synchronize": "false"
"entities: ["src/entity/**/*.ts"]
}
```


##MySQL

###.env

```
TYPEORM_CONNECTION = mysql
TYPEORM_HOST = localhost
TYPEORM_USERNAME = username
TYPEORM_PASSWORD = password
TYPEORM_DATABASE = fixture
TYPEORM_PORT = 3306
TYPEORM_SYNCHRONIZE = false
TYPEORM_LOGGING = false
TYPEORM_ENTITIES = src/entity/**/*.ts
TYPEORM_DRIVER_EXTRA = '{"multipleStatements": true}'
```

###ormconfig.json

```
{
"type": "mysql",
"host": "localhost",
"port": 3306,
"username": "username",
"password": "password",
"database": "fixture",
"synchronize": "false"
"entities: ["src/entity/**/*.ts"]
"multipleStatements": true
}
```

