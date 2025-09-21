# Ingenium Fit - Project Structure

## 📁 Root Directory Structure

```
ingenium_fit/
├── 📱 mobile-app/                    # React Native Mobile Application
│   ├── src/                          # Source code
│   ├── ios/                          # iOS native code
│   ├── android/                      # Android native code
│   ├── package.json                  # Dependencies and scripts
│   └── .env.example                  # Environment variables template
│
├── 🖥️  admin-dashboard/              # Web Admin Dashboard
│   ├── src/                          # React source code
│   ├── config/                       # Build and routing configuration
│   ├── public/                       # Static assets
│   ├── package.json                  # Dependencies and scripts
│   └── .env.example                  # Environment variables template
│
├── 🔧 backend-services/              # Spring Boot Backend Services
│   ├── ruoyi-admin/                  # Main admin service
│   ├── ruoyi-system/                 # System management module
│   ├── ruoyi-framework/              # Framework components
│   ├── ruoyi-common/                 # Common utilities
│   ├── ruoyi-generator/              # Code generator
│   ├── ruoyi-quartz/                 # Scheduler service
│   ├── sql/                          # Database scripts
│   └── pom.xml                       # Maven configuration
│
├── 📄 README.md                      # Main project documentation
├── 📄 PROJECT_STRUCTURE.md           # This file - project organization
├── 📄 technical-documentation.docx   # Technical specifications
└── 📄 .gitignore                     # Git ignore rules
```

## 🎯 Component Descriptions

### 📱 Mobile App (`mobile-app/`)

**Technology**: React Native 0.76.5 + TypeScript
**Purpose**: Patient-facing mobile application for rehabilitation programs

**Key Features**:

- Patient registration and authentication
- Personalized therapy programs
- Progress tracking and analytics
- Community features (posts, comments, likes)
- In-app messaging with healthcare providers
- Offline content caching
- Multi-language support (English/Chinese)

**Main Directories**:

- `src/components/` - Reusable UI components
- `src/screens/` - Application screens
- `src/services/` - API integration
- `src/store/` - State management (Zustand)
- `src/utils/` - Helper functions
- `ios/` - iOS native modules and configuration
- `android/` - Android native modules and configuration

### 🖥️ Admin Dashboard (`admin-dashboard/`)

**Technology**: React 18 + Ant Design Pro + TypeScript
**Purpose**: Healthcare provider admin interface

**Key Features**:

- Content management system (CMS)
- User administration and role management
- Analytics dashboard with real-time metrics
- System configuration and settings
- Report generation and export
- Rich text editor for content creation

**Main Directories**:

- `src/pages/` - Dashboard pages and components
- `src/services/` - API service definitions
- `src/components/` - Shared UI components
- `config/` - Build and routing configuration
- `public/` - Static assets and icons

### 🔧 Backend Services (`backend-services/`)

**Technology**: Spring Boot 3.4.1 + Java 21 + MySQL
**Purpose**: RESTful API services and business logic

**Key Modules**:

- `ruoyi-admin/` - Main application entry point and admin controllers
- `ruoyi-system/` - System management (users, roles, permissions)
- `ruoyi-framework/` - Security, caching, and framework configuration
- `ruoyi-common/` - Shared utilities and domain objects
- `ruoyi-generator/` - Code generation tools
- `ruoyi-quartz/` - Background job scheduling

**Database Schema**:

- Admin users and permissions (`sys_*` tables)
- Mobile app users and content (`t_*` tables)
- Audit logging and system configuration
- Quartz scheduler tables

## 🔄 Data Flow Between Components

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Mobile App    │ ←─────────────────→ │ Backend Services│
│  (React Native) │                     │  (Spring Boot)  │
└─────────────────┘                     └─────────────────┘
                                                 │
                                                 │ JDBC
                                                 ▼
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│ Admin Dashboard │ ←─────────────────→ │   MySQL DB      │
│    (React)      │                     │   (Healthcare   │
└─────────────────┘                     │     Schema)     │
                                        └─────────────────┘
```

## 🚀 Development Workflow

### Starting the Full Stack

1. **Database**: Start MySQL service
2. **Backend**: Build and run Spring Boot services
3. **Admin Dashboard**: Start React development server
4. **Mobile App**: Start Metro bundler and iOS/Android simulator

### File Naming Conventions

- **Folders**: kebab-case (e.g., `mobile-app`, `admin-dashboard`)
- **React Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Java Classes**: PascalCase (e.g., `UserController.java`)
- **Database Tables**: snake_case with prefixes (e.g., `sys_user`, `t_user`)
- **API Endpoints**: REST conventions (e.g., `/api/users`, `/app/content`)

### Environment Configuration

Each component has its own environment configuration:

- `mobile-app/.env` - AWS S3, API endpoints
- `admin-dashboard/.env` - AWS S3, build settings
- `backend-services/application.yml` - Database, Redis, security settings

## 📦 Deployment Structure

### Development

- All services run locally on different ports
- Hot reloading enabled for frontend applications
- Database runs locally with development data

### Production (Future)

- Containerized deployment with Docker
- Load balancing for backend services
- CDN for static assets
- Managed database service
- CI/CD pipeline with automated testing

## 🔧 Build Artifacts

### Mobile App

- iOS: `.ipa` file for App Store distribution
- Android: `.apk` or `.aab` file for Google Play

### Admin Dashboard

- Static files: HTML, CSS, JS bundles
- Deployable to any web server or CDN

### Backend Services

- JAR files: Self-contained Spring Boot applications
- Docker images: For containerized deployment
- Database migrations: SQL scripts for schema updates
