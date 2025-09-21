# Ingenium Fit - Comprehensive Rehabilitation Platform

A full-stack digital health platform designed to revolutionize physical therapy and rehabilitation through connected mobile and web applications.

## 🎯 Project Purpose & Vision

### Why Ingenium Fit?

Ingenium Fit addresses critical gaps in modern rehabilitation care by creating a comprehensive digital ecosystem that connects patients, healthcare providers, and rehabilitation centers. The platform was built to solve several key challenges in the healthcare industry:

#### Problems We Solve:

- **Fragmented Care Coordination** - Traditional rehabilitation involves multiple touchpoints (doctors, therapists, centers) with poor communication
- **Limited Patient Engagement** - Patients often abandon therapy programs due to lack of motivation and progress tracking
- **Inefficient Content Management** - Healthcare providers struggle to create, distribute, and update rehabilitation content
- **Poor Progress Monitoring** - Limited real-time visibility into patient progress and adherence
- **Accessibility Barriers** - Geographic and scheduling constraints limit access to quality rehabilitation services

#### Our Solution:

Ingenium Fit creates a unified digital rehabilitation ecosystem that:

- **Empowers Patients** with personalized therapy programs, progress tracking, and community support
- **Enables Healthcare Providers** with comprehensive content management and patient monitoring tools
- **Connects Rehabilitation Centers** with patients through location-based services and appointment management
- **Facilitates Communication** between all stakeholders through integrated messaging and updates

## 🏗️ System Architecture Overview

### Full-Stack Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INGENIUM FIT ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│  📱 MOBILE APP          │  🖥️  WEB ADMIN         │  🏥 CENTERS    │
│  (React Native)         │  (Ant Design Pro)      │  (Future)      │
│                         │                        │                │
│  • Patient Portal       │  • Content Management  │  • Scheduling  │
│  • Therapy Programs     │  • User Administration │  • Resources   │
│  • Progress Tracking    │  • Analytics Dashboard │  • Staff Mgmt  │
│  • Community Features   │  • System Configuration│                │
│  • Messaging           │  • Reporting Tools      │                │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     🔧 BACKEND SERVICES                         │
├─────────────────────────────────────────────────────────────────┤
│  🚀 Spring Boot Microservices Architecture                     │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Admin Service │  │  Rehab Service  │  │  Auth Service   │ │
│  │                 │  │                 │  │                 │ │
│  │ • User Mgmt     │  │ • Therapy Data  │  │ • JWT Tokens    │ │
│  │ • Content CMS   │  │ • Progress API  │  │ • Role Control  │ │
│  │ • System Config │  │ • Community API │  │ • Session Mgmt  │ │
│  │ • Analytics     │  │ • Messaging API │  │ • Security      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      🗄️  DATABASE LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  MySQL 8.0+ with Comprehensive Healthcare Schema               │
│                                                                 │
│  📊 Core Tables:                                               │
│  • sys_user (Admin Users)     • t_user (App Users)            │
│  • t_science (Content)        • t_dynamics_post (Community)    │
│  • t_favorite (Bookmarks)     • t_user_comment (Interactions) │
│  • t_user_message (Messaging) • t_leave_word (Feedback)       │
│  • sys_config (Settings)      • sys_menu (Permissions)        │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

- **📱 Mobile App User Journey**: Registration → Authentication → Profile Setup → Content Discovery → Therapy Programs → Progress Tracking → Community Interaction → Messaging
- **🖥️ Admin Dashboard Workflow**: Login → Content Creation → User Management → Analytics Review → System Configuration → Report Generation
- **🔄 Real-time Synchronization**: Admin Creates Content → Database Update → API Notification → Mobile App Refresh → User Sees New Content

## 🛠️ Technical Stack Deep Dive

### Frontend Technologies

#### Mobile App (React Native 0.76.5)

- **Framework**: React Native 0.76.5 with TypeScript 5.8
- **Navigation**: React Navigation 7.x with stack and tab navigators
- **State Management**: Zustand 5.0 for lightweight state management
- **API Layer**: Ky HTTP client with TanStack React Query 5.84 for caching
- **UI Components**: React Native Paper 5.14 + custom components
- **Internationalization**: i18next 25.4 with English/Chinese support
- **Media Handling**: React Native Nitro Sound (replaces deprecated audio recorder)
- **Maps Integration**: React Native Maps 1.26 for location services
- **Push Notifications**: React Native Push Notification
- **Storage**: MMKV 3.3 for high-performance local storage

#### Web Admin Dashboard (React 18)

- **Framework**: Ant Design Pro 6.0 (React 18.3 + TypeScript 5.7)
- **Build Tool**: UmiJS 4.3 with MFSU optimization
- **UI Library**: Ant Design 5.22 with custom theming
- **State Management**: Built-in Umi model system
- **Charts**: Ant Design Charts 2.3 for analytics visualization
- **Forms**: ProForm 2.32 for complex form handling
- **Tables**: ProTable for advanced data grids
- **Code Editor**: Monaco Editor 0.52 for content creation

### Backend Architecture

#### Spring Boot Microservices (Java 21)

- **Framework**: Spring Boot 3.4.1 with Spring Security 6
- **Architecture**: Modular monolith with microservice-ready structure
- **Authentication**: JWT 0.12.6-based stateless authentication
- **Authorization**: Role-based access control (RBAC)
- **API Documentation**: SpringDoc OpenAPI 2.7.0 with Swagger UI
- **Validation**: Bean Validation with custom validators
- **Caching**: Redis integration for session and data caching
- **File Upload**: AWS S3 SDK 3.700 integration for media storage
- **Scheduling**: Quartz scheduler for background tasks
- **Monitoring**: Actuator endpoints for health checks

#### Database Design (MySQL 9.1)

- **Schema**: Normalized relational design with proper indexing
- **Transactions**: ACID compliance with proper isolation levels
- **Performance**: Query optimization with explain plans
- **Backup**: Automated backup strategies
- **Migration**: Flyway for version-controlled schema changes

## ⚙️ Local Development

### iOS Mobile App (macOS)

1. Install prerequisites: Node.js ≥ 20, `pnpm` (v9+), Xcode 15+ with the iOS Simulator, and CocoaPods (`sudo gem install cocoapods`).
2. Install JavaScript dependencies: `cd mobile-app && pnpm install`.
3. Install native iOS pods once per machine: `pnpm pod-install` (or `cd ios && pod install`).
4. Configure API access by duplicating `mobile-app/.env` to `.env.local` and pointing `API_URL` at your local backend (e.g. `http://localhost:8080/prod-api`).
5. Start Metro in one terminal: `pnpm start`.
6. In another terminal run the app: `pnpm ios -- --simulator "iPhone 17 Pro"`. You can also open `mobile-app/ios/kangfu_app.xcworkspace` in Xcode and run it directly. If the build complains about missing `.xcconfig` files, rerun step 3 to regenerate Pods support files.

### Web Admin Dashboard (React)

1. Ensure Node.js ≥ 18 and `pnpm` are available.
2. Install dependencies: `cd admin-dashboard && pnpm install`.
3. Point the development proxy at your backend by updating the `dev` targets in `admin-dashboard/config/proxy.ts` (switch the IPs to `http://localhost:8080`, `http://localhost:8080/app`, etc.). Add any API keys (e.g. Google Maps) to an `.env.local` if needed.
4. Launch the admin console: `pnpm dev` (alias for `pnpm start`). The dashboard serves on `http://localhost:8000` and leverages the proxy you configured.

### Java Backend Services (Spring Boot)

1. Install prerequisites: JDK 17 (e.g. `brew install openjdk@17`), Maven 3.9+, MySQL 8+, and Redis (e.g. `brew install redis`).
2. Set `JAVA_HOME` to the JDK 17 installation before running Maven (`export JAVA_HOME=/opt/homebrew/opt/openjdk@17`).
3. Create a local database (default name `db_mgkf`) and import the schemas in `backend-services/sql/ry_react.sql` and `backend-services/sql/quartz.sql`. The following example assumes a local MySQL superuser:
   
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS db_mgkf DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p db_mgkf < backend-services/sql/ry_react.sql
   mysql -u root -p db_mgkf < backend-services/sql/quartz.sql
   # Optional: load sample data/patches
   mysql -u root -p db_mgkf < backend-services/sql/20250908.sql
   ```
4. Update `backend-services/ruoyi-admin/src/main/resources/application-druid.yml` to use your local database URL, username, and password (the file contains commented localhost defaults you can restore). Ensure Redis host is set to `localhost` in `backend-services/ruoyi-admin/src/main/resources/application.yml` if you’re running it locally.
5. From `backend-services/`, run `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn -pl ruoyi-admin -am clean install -DskipTests -Dmaven.repo.local=./.m2` to build and install all modules into a local Maven repo.
6. Start Redis (`brew services start redis` or `redis-server /opt/homebrew/etc/redis.conf`) and verify it responds with `redis-cli ping`.
7. Launch the API layer: `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn -pl ruoyi-admin spring-boot:run -Dmaven.repo.local=./.m2`. The service listens on `http://localhost:8080` and exposes the `/prod-api` routes consumed by the web and mobile apps. Logs are written to `backend-services/logs/`.
8. Alternative: package a runnable jar with `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn -pl ruoyi-admin -am package -DskipTests -Dmaven.repo.local=./.m2` and run it via `java -jar ruoyi-admin/target/ruoyi-admin.jar`.

## 📱 Mobile App Features

### Patient Experience

- **Onboarding**: Guided registration with profile setup
- **Therapy Programs**: Personalized rehabilitation routines
- **Progress Tracking**: Visual progress charts and milestone tracking
- **Content Library**: Educational videos, articles, and exercises
- **Community Features**: User posts, comments, likes, and sharing
- **Messaging System**: Direct communication with healthcare providers
- **Appointment Booking**: Integration with rehabilitation centers
- **Offline Support**: Content caching for offline access

### Technical Features

- **Multi-language Support**: English and Chinese localization
- **Responsive Design**: Optimized for various screen sizes
- **Performance**: Optimized rendering with FlatList and lazy loading
- **Security**: Biometric authentication and secure token storage
- **Analytics**: User behavior tracking and crash reporting

## 🖥️ Web Admin Dashboard Features

### Content Management System

- **Rich Text Editor**: Create and edit rehabilitation content
- **Media Management**: Upload and organize images, videos, documents
- **Content Scheduling**: Schedule content publication
- **SEO Optimization**: Meta tags and search optimization
- **Content Analytics**: Track engagement and performance

### User Administration

- **User Management**: Create, edit, and manage user accounts
- **Role Management**: Define and assign user roles and permissions
- **Activity Monitoring**: Track user login and activity patterns
- **Bulk Operations**: Mass user operations and data import/export

### Analytics & Reporting

- **Dashboard Widgets**: Real-time metrics and KPIs
- **User Analytics**: Registration trends, engagement metrics
- **Content Performance**: Most viewed content, user interactions
- **System Health**: Server performance, database metrics
- **Custom Reports**: Generate and export custom reports

## 🗄️ Database Schema Details

### Core Tables Structure

#### User Management

```sql
-- Admin Users (Web Dashboard)
sys_user: Admin authentication and profiles
sys_user_role: Role assignments
sys_role: Role definitions and permissions
sys_menu: Navigation and permission structure

-- Mobile App Users
t_user: Patient profiles and authentication
t_user_message: In-app messaging system
t_user_comment: Community interactions
t_user_comment_reply: Threaded discussions
```

#### Content Management

```sql
-- Educational Content
t_science: Rehabilitation articles and guides
t_dynamics_post: Community posts and updates
t_favorite: User bookmarks and saved content
t_leave_word: User feedback and suggestions

-- System Configuration
sys_config: Application settings
sys_dict_type: Data dictionary categories
sys_dict_data: Lookup values and options
```

#### Operational Tables

```sql
-- Scheduling & Tasks
qrtz_*: Quartz scheduler tables for background jobs
sys_job: Scheduled task definitions
sys_job_log: Task execution history

-- Audit & Logging
sys_oper_log: User operation audit trail
sys_logininfor: Login attempt tracking
```

## 🚀 Local Development Setup

### Prerequisites Installation

#### System Requirements (macOS)
