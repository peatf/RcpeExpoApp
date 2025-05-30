# React Native Conversion Prompt for RCPE

I have a **fully functional React TypeScript web application** that needs to be converted to React Native for iOS App Store deployment. The app is a Reality Creation Profile Engine with comprehensive AI-driven tools.

## ✅ WORKING WEB APP DETAILS:
- **Location**: `/Users/Aleshalegair/rcpe-frontend/rcpe-ui/`
- **Status**: Production build successful, all TypeScript errors resolved
- **Architecture**: Modern React with TypeScript, Vite build system
- **Authentication**: Complete JWT flow with automatic token refresh
- **API Integration**: Full HTTP client with interceptors and error handling

## Backend API Details:
- **Base URL**: `reality-creation-profile-engine.vercel.app` (development) - needs production URL
- **API Version**: `/api/v1/`
- **Authentication**: JWT Bearer tokens with refresh mechanism
- **Key Endpoints**:
  - `POST /api/v1/auth/login` - User authentication
  - `POST /api/v1/auth/refresh` - Token refresh
  - `POST /api/v1/ai/frequency-map` - Multi-step frequency mapping
  - `POST /api/v1/ai/calibration-map` - Slider-based calibration
  - `POST /api/v1/ai/oracle` - Oracle guidance system
  - `GET /api/v1/users/{user_id}/base_chart` - User's astrological base chart

## Current Web Implementation Stack:
- **Frontend**: React 18 + TypeScript + Vite
- **HTTP Client**: Axios with automatic JWT attachment
- **State Management**: React Context for authentication
- **UI Framework**: Material-UI v5 with responsive design
- **Routing**: React Router v6 with protected routes
- **Storage**: localStorage for JWT tokens (needs AsyncStorage conversion)

## 🎯 CONVERSION REQUIREMENTS:

### 1. Core Architecture Migration:
- **Storage**: Replace `localStorage` with `@react-native-async-storage/async-storage`
- **Navigation**: Replace React Router with `@react-navigation/native` (stack + bottom tabs)
- **UI Components**: Replace Material-UI with React Native built-ins or `react-native-elements`
- **HTTP**: Keep Axios but adapt interceptors for AsyncStorage
- **State**: Keep React Context pattern but adapt for mobile lifecycle

### 2. Key Files to Convert:
- `src/services/authService.ts` - Update for AsyncStorage
- `src/services/api.ts` - Adapt interceptors for async token retrieval
- `src/contexts/AuthContext.tsx` - Mobile app lifecycle awareness
- `src/components/Layout.tsx` - Convert to navigation structure
- `src/pages/*.tsx` - All 5 pages need native UI components

### 3. Mobile-Specific Features Needed:
- **Deep Linking**: For sharing AI tool results
- **Push Notifications**: For Oracle guidance reminders
- **Offline Support**: Cache user's base chart data
- **Biometric Auth**: Optional fingerprint/face ID login
- **Network Handling**: Graceful offline/online transitions

### 4. iOS Deployment Preparation:
- **Bundle ID**: `com.rcpe.realitycreationengine`
- **App Store Assets**: Icons, screenshots, app description
- **Privacy Policy**: Required for App Store submission
- **TestFlight**: Beta testing before public release

## 📱 SPECIFIC CONVERSION PRIORITIES:

1. **Authentication Flow** - Critical foundation
2. **Frequency Mapper** - Core user journey (multi-step wizard)
3. **Dashboard** - Main navigation hub
4. **Calibration Tool** - Slider interactions need native feel
5. **Oracle Interface** - Display rich formatted content

## 🔧 TECHNICAL SPECIFICATIONS:

- **React Native Version**: 0.72+ with New Architecture
- **TypeScript**: Maintain full type safety
- **iOS Target**: iOS 14+ for broad compatibility
- **Performance**: 60fps animations, smooth scrolling
- **Bundle Size**: Optimize for App Store guidelines

## 📋 REFERENCE FILES:
The complete working web app is in `/Users/Aleshalegair/rcpe-frontend/rcpe-ui/` with:
- All authentication logic working
- Complete API integration
- Multi-step UI flows implemented
- Error handling patterns established
- TypeScript interfaces defined

Please create a React Native project that maintains the same functionality while providing a native iOS experience optimized for App Store deployment.
