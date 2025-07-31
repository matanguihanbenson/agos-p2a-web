<div align="center">

# 🌊 AGOS - Autonomous Garbage-cleaning Operation System

> 🚀 Revolutionary autonomous technology for river cleanup and environmental monitoring

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Available-brightgreen?style=for-the-badge)](https://your-demo-url.vercel.app)
[![Status](https://img.shields.io/badge/📊_Status-Active-success?style=for-the-badge)](https://your-demo-url.vercel.app)
[![License](https://img.shields.io/badge/📄_License-MIT-blue?style=for-the-badge)](#-license)

**AGOS** is a comprehensive web platform that manages autonomous cleaning boats and provides real-time environmental monitoring for rivers and waterways. Built with Next.js, TypeScript, and Firebase, it empowers environmental conservation through intelligent automation.

</div>

---

## 🎯 **Try It Live!**

<div align="center">

### 🌐 **Published Project Available for Testing**

We've deployed AGOS and it's ready for you to explore! 

**🔗 [Access Live Demo](https://your-demo-url.vercel.app)**

### 🔐 **Test Account Credentials**

| Role | Email | Password |
|------|--------|----------|
| 👤 **Admin** | `admin@gmail.com` | `12345678` |

> 💡 **Tip**: Use the admin account to explore all features including bot management, user administration, and analytics dashboards.

---

</div>

## ✨ Features

### 🤖 **Autonomous Bot Management**

- 📡 **Real-time Bot Control**: Monitor, deploy, and recall cleanup boats remotely
- 📈 **Fleet Performance Tracking**: View operational metrics and efficiency statistics
- 🚨 **Emergency Override**: Built-in safety overrides for critical situations
- 📍 **Live Status Updates**: Real-time boat positioning and operational status

### 🗑️ **Intelligent Trash Detection**

- 🔍 **AI-Powered Detection**: Computer vision for identifying floating debris
- 🏷️ **Trash Type Classification**: Categorizes plastic bottles, containers, bags, metal cans
- 🗺️ **Hotspot Mapping**: Identifies pollution concentration areas
- 📊 **Collection Analytics**: Detailed statistics on waste removal

### 💧 **Water Quality Monitoring**

- 📡 **Real-time Sensors**: pH, turbidity, temperature, dissolved oxygen tracking
- ⚠️ **Environmental Alerts**: Automated notifications for quality changes
- 📈 **Historical Trends**: Long-term water quality analysis
- ✅ **Compliance Reporting**: Environmental standard compliance tracking

### 📊 **Data Analytics & Reporting**

- 📈 **Interactive Dashboards**: Real-time system overview and metrics
- 📋 **Custom Reports**: Environmental impact and operational performance reports
- 💾 **Export Capabilities**: PDF, Excel, and CSV data export
- 📉 **Trend Analysis**: Historical data visualization and insights

### 👥 **User Management**

- 🔐 **Role-based Access**: Admin, field operator, and supervisor roles
- 📱 **Field Operator Tools**: Mobile-friendly interface for on-ground operations
- 👨‍💼 **Team Management**: User assignment and bot delegation
- 📝 **Activity Tracking**: Comprehensive system logs and user actions

## 🛠️ **Technology Stack**

<div align="center">

| Category | Technologies |
|----------|-------------|
| **🖥️ Frontend** | Next.js 15.3.5, React 19, TypeScript, Tailwind CSS 4.0 |
| **🎨 UI/UX** | Radix UI, Lucide React, Recharts |
| **🗺️ Maps** | Leaflet, OpenStreetMap |
| **🔐 Backend** | Firebase Auth, Cloud Firestore, Realtime Database |
| **☁️ Storage** | Firebase Storage |

</div>

### 🖥️ **Frontend**

- ⚛️ **Framework**: Next.js 15.3.5 (React 19)
- 📝 **Language**: TypeScript
- 🎨 **Styling**: Tailwind CSS 4.0
- 🧩 **UI Components**: Radix UI primitives
- 🎯 **Icons**: Lucide React
- 🗺️ **Maps**: Leaflet with OpenStreetMap

### 🔙 **Backend & Database**

- 🔐 **Authentication**: Firebase Auth
- 🗄️ **Database**: Cloud Firestore
- ⚡ **Real-time Updates**: Firebase Realtime Database
- 📁 **File Storage**: Firebase Storage

### 📚 **Key Libraries**

- 📊 **Charts**: Recharts for data visualization
- 📅 **Date Handling**: Native JavaScript Date API
- 🔄 **State Management**: React Context API
- ✅ **Form Validation**: Built-in TypeScript validation

## 🚀 **Quick Start**

### 📋 **Prerequisites**

- 📦 Node.js 18+
- 🛠️ npm, yarn, pnpm, or bun
- 🔥 Firebase project with Firestore enabled

### ⬇️ **Installation**

1. **📥 Clone the repository**

```bash
git clone https://github.com/your-org/p2a-agos-web.git
cd p2a-agos-web
```

2. **📦 Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **⚙️ Environment Setup**
   Create `.env.local` in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. **🔥 Firebase Configuration**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
```

5. **▶️ Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

🌐 Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 **Project Structure**

```
p2a-agos-web/
├── 📂 src/
│   ├── 📂 app/                          # Next.js App Router pages
│   │   ├── 📂 admin/                    # Admin dashboard pages
│   │   │   ├── 📊 dashboard/            # Main admin dashboard
│   │   │   ├── 👥 user-bot-management/  # User & bot management
│   │   │   ├── 🗑️ trash-deposits/       # Trash analysis & mapping
│   │   │   ├── 📈 reports/              # Analytics & reporting
│   │   │   └── 📝 logs/                 # System logs viewer
│   │   ├── 🎨 layout.tsx                # Root layout
│   │   ├── 🏠 page.tsx                  # Landing page
│   │   └── 🎨 globals.css               # Global styles
│   ├── 📂 components/                   # Reusable UI components
│   │   ├── 🧩 ui/                       # Base UI components (shadcn/ui)
│   │   └── 🌤️ weather/                  # Weather dashboard components
│   ├── 📂 contexts/                     # React Context providers
│   │   └── 🔐 AuthContext.tsx           # Firebase authentication
│   ├── 📂 lib/                          # Utility libraries
│   │   └── 🔥 firebase.ts               # Firebase configuration
│   └── 📂 types/                        # TypeScript type definitions
│       └── 📝 index.ts                  # Shared type definitions
├── 📂 public/                           # Static assets
│   └── 🖼️ img/                          # Application images
├── 📋 package.json                      # Dependencies and scripts
├── ⚙️ tailwind.config.js                # Tailwind CSS configuration
├── 📝 tsconfig.json                     # TypeScript configuration
└── ⚙️ next.config.js                    # Next.js configuration
```

## 🔐 **Authentication & Authorization**

### 👤 **User Roles**

- 👨‍💼 **Admin**: Full system access, user management, bot registration
- 🔧 **Field Operator**: Bot operation, data collection, status reporting
- 👨‍💼 **Supervisor**: Team oversight, operational monitoring

### 🛡️ **Security Features**

- 🔥 Firebase Authentication integration
- 🔐 Role-based route protection
- 🔒 Secure API endpoints
- ⏱️ Session management

## 🗄️ **Database Schema**

### 📊 **Core Collections**

#### 👥 **Users**

```typescript
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "field_operator" | "supervisor";
  isActive: boolean;
  organization: string;
  ecoPoints: number;
  created_by_admin: string;
}
```

#### 🤖 **Bots**

```typescript
interface Bot {
  id: string;
  bot_id: string;
  name: string;
  organization: string;
  assigned_to?: string;
  owner_admin_id: string;
  status: "active" | "maintenance" | "offline";
}
```

#### 🗑️ **Trash Deposits**

```typescript
interface TrashDeposit {
  id: string;
  location: { latitude: number; longitude: number };
  area: string;
  totalItems: number;
  breakdown: {
    plasticBottles: number;
    foodContainers: number;
    plasticBags: number;
    metalCans: number;
    other: number;
  };
  density: "low" | "medium" | "high" | "very-high";
}
```

## 🌍 **API Integration**

### 🌐 **External APIs**

- 🗺️ **OpenStreetMap**: Mapping and geocoding services
- 🌤️ **Weather API**: Real-time weather data
- 📍 **Reverse Geocoding**: Location name resolution

### 🔄 **Internal APIs**

- 📡 Real-time bot telemetry
- 💧 Water quality sensor data
- 🤖 Trash detection AI models

## 📱 **Features by Page**

### 🏠 **Landing Page** (`/`)

- 📖 Project overview and team information
- 📊 Real-time statistics display
- 📱 Mobile app download links
- 📞 Contact information

### 📊 **Admin Dashboard** (`/admin/dashboard`)

- 📈 System overview with key metrics
- 🌊 Real-time river monitoring
- 🌤️ Weather integration
- 🗺️ Trash density hotspots
- ⚡ Quick action buttons

### 👥 **User & Bot Management** (`/admin/user-bot-management`)

- 👨‍💼 Field operator management
- 🤖 Bot registration and assignment
- ⚡ Real-time status monitoring
- 📈 Performance tracking

### 🗑️ **Trash Deposits Analysis** (`/admin/trash-deposits`)

- 🗺️ Interactive map with pollution markers
- 🔍 Filterable data by area and trash type
- 📊 Density visualization
- 📈 Statistical breakdowns

### 📈 **Reports & Analytics** (`/admin/reports`)

- 📋 Custom report generation
- 🌱 Environmental impact analysis
- ⚡ Operational performance metrics
- 💾 Export capabilities

### 📝 **System Logs** (`/admin/logs`)

- ⚡ Real-time activity monitoring
- 🔍 Filterable log entries
- 💾 Export functionality
- 🔄 Auto-refresh capabilities

## 🎨 **UI/UX Design**

### 🎨 **Design System**

- 🎨 **Color Palette**: Blue/cyan gradients for water themes
- ✍️ **Typography**: Geist font family
- 🧩 **Components**: Consistent shadcn/ui components
- 📱 **Responsive**: Mobile-first design approach

### ♿ **Accessibility**

- ✅ WCAG 2.1 AA compliance
- ⌨️ Keyboard navigation support
- 🔊 Screen reader compatibility
- 🌗 High contrast mode support

## 🚀 **Deployment**

### 🔨 **Build Process**

```bash
# Production build
npm run build

# Start production server
npm start
```

### ⚡ **Vercel Deployment** (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### 🌍 **Environment Variables for Production**

Ensure all Firebase configuration variables are set in your deployment platform.

## 🧪 **Development**

### ⚡ **Development Commands**

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### 📝 **Code Style**

- ✅ ESLint configuration for code quality
- 📝 TypeScript strict mode enabled
- 🎨 Prettier for code formatting
- 📋 Conventional commit messages

## 🤝 **Contributing**

### 🔄 **Development Workflow**

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

### 📏 **Code Standards**

- 📝 TypeScript for type safety
- 🧩 Component-based architecture
- 📱 Responsive design principles
- ⚡ Performance optimization

## 🐛 **Troubleshooting**

### ❗ **Common Issues**

#### 🔥 **Firebase Connection Issues**

```bash
# Check Firebase configuration
firebase projects:list

# Verify environment variables
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

#### 🗺️ **Map Not Loading**

- ✅ Verify Leaflet CSS is imported
- 🌐 Check network connectivity
- 🔍 Ensure proper tile server access

#### 🔨 **Build Errors**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📊 **Performance Monitoring**

### 📈 **Key Metrics**

- ⚡ Page load times
- 🗄️ Database query performance
- ⚡ Real-time update latency
- 👆 User interaction responsiveness

### ⚡ **Optimization Features**

- 🖼️ Image optimization with Next.js
- 📦 Code splitting and lazy loading
- 🔥 Firebase query optimization
- 💾 Caching strategies

## 🔒 **Security Considerations**

### 🛡️ **Data Protection**

- 🔐 Secure authentication flows
- 🔒 Data encryption in transit
- 👤 Role-based access control
- ✅ Input validation and sanitization

### 🛡️ **Best Practices**

- 🔍 Regular security audits
- 🔍 Dependency vulnerability scanning
- 🔐 Environment variable protection
- 🔒 HTTPS enforcement

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

### 👥 **Team**

- **👨‍💻 Mark Benson Matanguihan**: Full-Stack Developer & Mobile App Lead
- **🤖 Jacqueline Reyes**: AI/ML Engineer & Technical Documentation
- **📊 Alexandra Andrea Fortu**: Data Scientist & Documentation Specialist
- **🔧 Mk Cañanes**: Hardware Engineer & 3D Design
- **🤖 Maria Aceveda**: Robotics Engineer & System Architecture
- **💼 Kimberly Mataba**: Business Analyst & Market Validation Lead

### 🛠️ **Technologies**

- ⚛️ Next.js and React team for the amazing framework
- 🔥 Firebase team for robust backend services
- 🎨 Tailwind CSS for utility-first styling
- 🗺️ OpenStreetMap for mapping services

## 📞 **Support**

For support and questions:

- **📧 Email**: contact@agos-systems.com
- **📚 Documentation**: [Project Wiki](https://github.com/your-org/p2a-agos-web/wiki)
- **🐛 Issues**: [GitHub Issues](https://github.com/your-org/p2a-agos-web/issues)

---

<div align="center">

**🌊 Built with 💙 for environmental conservation**

_Making our rivers cleaner, one autonomous bot at a time._

[![⭐ Star this project](https://img.shields.io/badge/⭐_Star_this_project-Help_us_grow-yellow?style=for-the-badge)](https://github.com/your-org/p2a-agos-web)

</div>
