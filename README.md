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

```bash
# Install Homebrew package manager
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Core development tools
brew install node@20          # Node.js runtime
brew install pnpm             # Fast package manager
brew install openjdk@21       # Java development kit
brew install mysql            # Database server
brew install redis            # Caching server (optional)

# React Native iOS development
brew install cocoapods        # iOS dependency manager
brew install watchman         # File watching service
xcode-select --install        # Xcode command line tools

# Configure Java environment
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installations
node --version    # Should show v20.x.x
java --version    # Should show 21.x.x
mysql --version   # Should show 8.x.x
```

#### iOS Development Setup

1. Install Xcode from Mac App Store (required for iOS Simulator)
2. Accept Xcode License: `sudo xcodebuild -license accept`
3. Install iOS Simulator (included with Xcode)
4. Verify Setup: `xcrun simctl list devices`

### Database Configuration

#### MySQL Setup & Data Import

```bash
# Start MySQL service
brew services start mysql

# Create application database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS db_mgkf CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Import database schema and seed data
cd backend-services
mysql -u root db_mgkf < sql/ry_react.sql      # Core schema and admin users
mysql -u root db_mgkf < sql/quartz.sql        # Scheduler tables
mysql -u root db_mgkf < sql/20250908.sql      # Application-specific updates

# Verify database setup
mysql -u root db_mgkf -e "SHOW TABLES; SELECT COUNT(*) as admin_users FROM sys_user;"
```

**Default Admin Credentials:**

- Username: `admin` / Password: `admin123`
- Username: `ry` / Password: `123456`

### Backend Services Setup

#### Build & Deploy Java Services

```bash
cd backend-services

# Clean build all services
mvn clean package -DskipTests

# Verify successful build
ls -la ruoyi-admin/target/ruoyi-admin.jar

# Start the main service (includes both admin and rehab functionality)
java -Dspring.profiles.active=dev -Dlogging.level.root=INFO -jar ruoyi-admin/target/ruoyi-admin.jar

# Service will be available at:
# - Admin API: http://localhost:8080
# - Rehab API: http://localhost:8080/app/*
# - Swagger UI: http://localhost:8080/swagger-ui.html
```

### Environment Configuration

#### AWS S3 Setup (Required for File Uploads)

```bash
# 1. Copy environment templates
cp admin-dashboard/.env.example admin-dashboard/.env
cp mobile-app/.env.example mobile-app/.env

# 2. Edit .env files with your AWS credentials
# admin-dashboard/.env:
REACT_APP_AWS_ACCESS_KEY_ID=your_aws_access_key_id
REACT_APP_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
REACT_APP_AWS_REGION=your_aws_region
REACT_APP_AWS_BUCKET=your_bucket_name

# mobile-app/.env:
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
AWS_BUCKET=your_bucket_name
```

### Frontend Applications Setup

#### Web Admin Dashboard

```bash
# Terminal 1: Admin Dashboard
cd admin-dashboard
pnpm install                    # Install dependencies
pnpm start                      # Start development server

# Dashboard available at: http://localhost:8000
# Login with: admin/admin123
```

#### Mobile Application

```bash
# Terminal 2: Metro Bundler
cd mobile-app
pnpm install                    # Install JavaScript dependencies
npx pod-install                 # Install iOS native dependencies
pnpm start                      # Start Metro bundler (keep running)

# Terminal 3: iOS Simulator
cd mobile-app
pnpm ios                        # Build and launch in iOS Simulator
```

**Mobile App Notes:**

- Mobile app uses separate user registration (not the same as admin users)
- Users must register a new account within the mobile app
- Language can be switched to English in Profile → Language settings

## 🔧 Development Workflow

### Daily Development Routine

#### Starting Development Environment

```bash
# 1. Start database
brew services start mysql

# 2. Start backend (Terminal 1)
cd backend-services && java -jar ruoyi-admin/target/ruoyi-admin.jar

# 3. Start admin dashboard (Terminal 2)
cd admin-dashboard && pnpm start

# 4. Start mobile Metro bundler (Terminal 3)
cd mobile-app && pnpm start

# 5. Launch iOS simulator (Terminal 4)
cd mobile-app && pnpm ios
```

#### Development URLs

- **Backend API**: http://localhost:8080
- **Admin Dashboard**: http://localhost:8000
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Mobile App**: iOS Simulator

### Testing Data Flow

#### End-to-End Testing Scenario

1. **Admin Dashboard**: Login → Create new rehabilitation content
2. **Database**: Verify content stored in `t_science` table
3. **Mobile App**: Refresh → Verify new content appears
4. **Mobile App**: Register new user → Test community features
5. **Admin Dashboard**: View user analytics and engagement metrics

## 🐛 Troubleshooting Guide

### Common Issues & Solutions

#### Backend Issues

```bash
# Java build failures
mvn clean package -DskipTests -X  # Verbose build output
echo $JAVA_HOME                    # Verify Java path

# Database connection errors
mysql -u root -e "SELECT 1;"      # Test MySQL connection
brew services restart mysql       # Restart MySQL service

# Port conflicts
lsof -ti:8080 | xargs kill -9     # Kill process on port 8080
```

#### Frontend Issues

```bash
# Admin dashboard build errors
cd admin-dashboard
rm -rf node_modules .umi
pnpm install
pnpm start

# Mobile app Metro issues
cd mobile-app
npx react-native start --reset-cache
rm -rf node_modules && pnpm install
```

#### iOS Simulator Issues

```bash
# Simulator not launching
xcrun simctl list devices                    # List available simulators
xcrun simctl boot [DEVICE_ID]              # Boot specific simulator
xcrun simctl erase all                      # Reset all simulators

# Build failures
cd mobile-app/ios
pod install --repo-update                   # Update CocoaPods
```

### Performance Optimization

#### Development Performance Tips

- Keep Metro bundler running between builds
- Use `--reset-cache` only when necessary
- Pre-warm iOS Simulator before development
- Monitor system resources during multi-service development
- Use console logging instead of file logging for backend during development

## 📈 Future Roadmap

### Planned Features

- **Telemedicine Integration**: Video consultations with healthcare providers
- **Wearable Device Support**: Integration with fitness trackers and health monitors
- **AI-Powered Recommendations**: Machine learning for personalized therapy programs
- **Multi-tenant Architecture**: Support for multiple healthcare organizations
- **Advanced Analytics**: Predictive analytics for patient outcomes
- **Mobile Web App**: Progressive Web App for broader device support

### Technical Improvements

- **Microservices Migration**: Full microservices architecture with Docker
- **Cloud Deployment**: AWS/Azure deployment with auto-scaling
- **Real-time Features**: WebSocket integration for live updates
- **Enhanced Security**: OAuth 2.0, multi-factor authentication
- **Performance Monitoring**: APM integration with detailed metrics
- **Automated Testing**: Comprehensive test suite with CI/CD pipeline

## 🤝 Contributing

### Development Guidelines

- Follow established code style and conventions
- Write comprehensive tests for new features
- Update documentation for API changes
- Use semantic versioning for releases
- Submit pull requests with detailed descriptions

### Getting Help

- Check troubleshooting guide for common issues
- Review API documentation for backend integration
- Consult component documentation for frontend development
- Join development discussions for architecture decisions

---

**Ingenium Fit** represents the future of digital healthcare, creating meaningful connections between patients, providers, and technology to improve rehabilitation outcomes and quality of life.
