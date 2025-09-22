# Ingenium Fit Backend Services

Spring Boot (RuoYi) monolith that powers the REST APIs, authentication, and scheduled jobs.

## Prerequisites
- JDK 17 (`brew install openjdk@17`)
- Maven 3.9+
- MySQL 8 instance
- Redis 7+ (`brew install redis`)

## Quick Start
1. Export the JDK path for Maven:
   ```bash
   export JAVA_HOME=/opt/homebrew/opt/openjdk@17
   ```
2. Seed the database:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS db_mgkf DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p db_mgkf < sql/ry_react.sql
   mysql -u root -p db_mgkf < sql/quartz.sql
   mysql -u root -p db_mgkf < sql/20250908.sql   # optional sample data
   ```
3. Configure credentials in `ruoyi-admin/src/main/resources/application-druid.yml` and set Redis host to `localhost` in `application.yml`.
4. Build all modules and install them locally:
   ```bash
   JAVA_HOME=$JAVA_HOME mvn -pl ruoyi-admin -am clean install -DskipTests -Dmaven.repo.local=./.m2
   ```
5. Start supporting services:
   ```bash
   brew services start redis
   mysql.server start   # or use your preferred MySQL service manager
   ```
6. Run the API:
   ```bash
   JAVA_HOME=$JAVA_HOME mvn -pl ruoyi-admin spring-boot:run -Dmaven.repo.local=./.m2
   ```
   The server listens on `http://localhost:8080/prod-api`; logs are written to `logs/`.

## Module Overview
- `ruoyi-admin/` – entry point, REST controllers, security config
- `ruoyi-system/` – system entities, services, MyBatis mappers
- `ruoyi-framework/` – framework utilities (security, logging, serialization)
- `ruoyi-common/` – shared DTOs, enums, helpers
- `ruoyi-quartz/` – scheduled job support
- `ruoyi-generator/` – code generation tooling (optional during runtime)
- `mgkf-pro/` – domain modules specific to Ingenium Fit (content, posts, rehab centers)
- `sql/` – schema and data scripts

## Common Commands
- Rebuild quickly: `JAVA_HOME=$JAVA_HOME mvn -pl ruoyi-admin -am clean install -DskipTests`
- Package runnable jar: `JAVA_HOME=$JAVA_HOME mvn -pl ruoyi-admin -am package -DskipTests`
- Run via jar: `java -jar ruoyi-admin/target/ruoyi-admin.jar`

## Troubleshooting
- **Redis errors** – ensure the service is running and reachable at the host configured in `application.yml`.
- **Database connection failures** – verify credentials and that MySQL allows local connections.
- **Maven dependency issues** – remove `./.m2` and rerun the install command to refresh the local cache.
