# Ingenium Fit

A full-stack rehabilitation platform with a React Native patient app, React admin portal, and Spring Boot backend.

## Repository Layout
- `mobile-app/` – React Native iOS/Android client
- `admin-dashboard/` – Ant Design Pro web console
- `backend-services/` – Spring Boot services and SQL assets

## Prerequisites
- Common: Node.js ≥ 20, pnpm 9, Git
- Mobile: Xcode 15+, CocoaPods (`sudo gem install cocoapods`)
- Web: Node.js ≥ 18 (matches Ant Design tooling)
- Backend: JDK 17 (`brew install openjdk@17`), Maven 3.9+, MySQL 8, Redis 7+

## Backend (Spring Boot)
1. Export the JDK path before running Maven:
   ```bash
   export JAVA_HOME=/opt/homebrew/opt/openjdk@17
   ```
2. Provision the database:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS db_mgkf DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p db_mgkf < backend-services/sql/ry_react.sql
   mysql -u root -p db_mgkf < backend-services/sql/quartz.sql
   # Optional sample data
   mysql -u root -p db_mgkf < backend-services/sql/20250908.sql
   ```
3. Confirm `backend-services/ruoyi-admin/src/main/resources/application-druid.yml` points at your MySQL instance and that Redis host is `localhost` in `application.yml`.
4. From `backend-services/`, install all modules locally:
   ```bash
   JAVA_HOME=$JAVA_HOME mvn -pl ruoyi-admin -am clean install -DskipTests -Dmaven.repo.local=./.m2
   ```
5. Start Redis (`brew services start redis`) and verify with `redis-cli ping`.
6. Launch the API:
   ```bash
   JAVA_HOME=$JAVA_HOME mvn -pl ruoyi-admin spring-boot:run -Dmaven.repo.local=./.m2
   ```
   The server listens on `http://localhost:8080/prod-api`. Logs write to `backend-services/logs/`.

## Mobile App (React Native)
1. Install dependencies:
   ```bash
   cd mobile-app
   pnpm install --no-frozen-lockfile
   pnpm pod-install
   ```
2. Copy `.env` → `.env.local` and update `API_URL` to `http://localhost:8080/prod-api`.
3. Run Metro and the simulator:
   ```bash
   pnpm start
   pnpm ios -- --simulator "iPhone 17 Pro"
   ```
   Use Xcode (`ios/kangfu_app.xcworkspace`) if you prefer a GUI build.

## Web Admin (React)
1. Install and start:
   ```bash
   cd admin-dashboard
   pnpm install
   pnpm dev
   ```
2. Update `config/proxy.ts` to proxy `/api`, `/app`, and `/mgkf` to `http://localhost:8080` so the dashboard hits your local backend.

## Handy Commands
- Rebuild backend without tests: `JAVA_HOME=$JAVA_HOME mvn -pl ruoyi-admin -am clean install -DskipTests`
- Stop Redis: `brew services stop redis`
- Reset Metro cache: `pnpm start --reset-cache`

## Troubleshooting
- **Pods missing**: run `pnpm pod-install` inside `mobile-app/ios`.
- **Backend fails with Redis errors**: ensure Redis is running locally and `application.yml` points to `localhost`.
- **Metro export warnings**: Metro config enables package exports; restart Metro (`pnpm start --reset-cache`) if warnings persist.
