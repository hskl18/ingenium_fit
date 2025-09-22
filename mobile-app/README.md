# Ingenium Fit - Adaptive Sports Navigator

A React Native research prototype investigating how digital navigation can reduce barriers for adaptive athletes in Pasadena, CA.

## 📱 Device Requirements

This app is **optimized specifically for iPhone 16 Pro Max** for research consistency and optimal user experience.

## 🎯 Demo Mode

This is a **frontend-only prototype** with realistic Pasadena-based mock data. No backend server required.

## 🚀 Quick Start

### Prerequisites
- **macOS** (required for iOS development)
- **Xcode 15+** with iOS 17+ SDK
- **Node.js 20+**
- **pnpm** (`npm install -g pnpm`)
- **Ruby 3.1+** and **CocoaPods** (see setup below)

### Ruby & CocoaPods Setup

You have Ruby 3.4.6 installed but your system is using the old version. Fix the PATH:

```bash
# Add Homebrew Ruby to your PATH (choose your shell)
# For zsh (default on macOS):
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For bash:
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.bash_profile
echo 'export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile

# Verify Ruby version (should show 3.4.6)
ruby --version
which ruby

# Install CocoaPods (no sudo needed now)
gem install cocoapods

# Verify CocoaPods installation
pod --version
```

**Alternative: Use system Ruby with sudo (if PATH fix doesn't work)**
```bash
sudo gem install cocoapods -n /usr/local/bin
```

### Installation & Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd mobile-app
   pnpm install  # This installs React Native CLI and other dependencies
   ```

2. **Install iOS dependencies** 
   ```bash
   cd ios
   pod install   # This requires the CLI to be installed first
   cd ..
   ```

   ⚠️ **Critical**: You MUST run `pnpm install` in the mobile-app directory before `pod install` will work!

3. **Configure for iPhone 16 Pro Max**
   
   Open `ios/kangfu_app.xcworkspace` in Xcode and:
   - Select your project in the navigator
   - Go to **Deployment Info**
   - Set **Deployment Target** to iOS 17.0+
   - Under **Device Orientation**, keep only **Portrait**
   - In **Supported Destinations**, select only **iPhone**

4. **Set up iPhone 16 Pro Max Simulator**
   ```bash
   # Install iPhone 16 Pro Max simulator
   xcrun simctl create "iPhone 16 Pro Max" "iPhone 16 Pro Max" "iOS17.0"
   ```

### Running the App

1. **Start Metro bundler**
   ```bash
   pnpm start
   ```

2. **Launch on iPhone 16 Pro Max**
   ```bash
   # Option 1: Specific device
   pnpm exec react-native run-ios --simulator="iPhone 16 Pro Max"
   
   # Option 2: Default (if configured)
   pnpm ios
   ```

3. **Alternative: Run from Xcode**
   - Open `ios/kangfu_app.xcworkspace`
   - Select **iPhone 16 Pro Max** simulator
   - Press **⌘ + R** to build and run

## 📱 Simulator Configuration

### iPhone 16 Pro Max Specifications
- **Screen Size**: 6.9" Super Retina XDR
- **Resolution**: 1320 x 2868 pixels (460 ppi)
- **Safe Area**: Optimized for Dynamic Island
- **Orientation**: Portrait only (research requirement)

### Simulator Settings
1. Open **Simulator** app
2. Go to **Device > Device Settings**
3. Set **Appearance** to Light/Dark as needed
4. **Hardware > Keyboard > Connect Hardware Keyboard** (optional)

## 🎯 Research Features

### Pasadena-Focused Content
- **Rose Bowl Aquatics Center** - Adaptive swimming programs
- **PCC Gymnasium** - Wheelchair basketball
- **Brookside Park** - Adaptive cycling routes
- **Metro Gold Line** - Accessible transit information
- **Local rehabilitation centers** with real addresses

### Mock Data Includes
- **5 Rehabilitation Centers** (Huntington Hospital, Casa Colina, etc.)
- **5 Adaptive Sports Doctors** with specializations
- **Community Posts** about local programs and experiences
- **Navigator Messages** for personalized guidance
- **Equipment Grants** and funding opportunities

## 🛠️ Development

### Project Structure
```
mobile-app/
├── src/
│   ├── screens/         # App screens
│   ├── components/      # Reusable UI components
│   ├── services/mock/   # Mock API services
│   ├── navigation/      # App navigation
│   ├── theme/          # Styling and colors
│   └── utils/          # Helper functions
├── ios/                # iOS-specific files
└── package.json        # Dependencies
```

### Key Dependencies
- **React Native 0.81** - Mobile framework
- **React Navigation 7** - Screen navigation
- **React Native Paper** - Material Design components
- **Zustand** - State management
- **MMKV** - Fast storage
- **React Query** - Data fetching

## 🔧 Customization

### Modify Mock Data
Edit files in `src/services/mock/`:
- `rehabilitation.ts` - Centers and doctors
- `posts.ts` - Community content
- `messages.ts` - Navigator conversations
- `user.ts` - User profiles

### Update Pasadena Locations
Edit `src/data/pasadenaContent.ts` to add/modify:
- Sports programs
- Venue addresses
- Transportation routes

## 📊 Research Notes

This prototype demonstrates:
- **Barrier reduction** through digital navigation
- **Knowledge access** via curated local resources
- **Transportation solutions** with Metro accessibility
- **Equipment funding** through grant programs
- **Healthcare integration** with local rehabilitation
- **Community building** via peer connections

## 🔧 Troubleshooting

### Ruby Version Issues
If you get Ruby version errors:
```bash
# Check current Ruby version and location
ruby --version
which ruby

# If still showing old version (2.6.10), fix PATH:
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Restart terminal and check again
ruby --version  # Should show 3.4.6

# If CocoaPods still fails, try with sudo:
sudo gem install cocoapods -n /usr/local/bin
```

### CocoaPods Issues
```bash
# If you get "undefined method '[]' for nil" error:
# This is usually a CLI version compatibility issue

# 1. Test if CLI is working
npx @react-native-community/cli config

# 2. If CLI fails, try compatible version
pnpm add -D @react-native-community/cli@^12.3.6

# 3. Clean and retry pod install
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

### Metro/Build Issues
```bash
# Clear Metro cache
pnpm exec react-native start --reset-cache

# Clean iOS build
cd ios && xcodebuild clean && cd ..
```

### Simulator Issues
```bash
# List available simulators
xcrun simctl list devices

# Boot iPhone 16 Pro Max specifically
xcrun simctl boot "iPhone 16 Pro Max"
```

Perfect for research presentations and user testing with adaptive athletes in Pasadena! 🏆