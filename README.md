# Phone Fix - Phone Repair Pickup & Delivery Platform

A modern web-based platform connecting customers with verified phone repair engineers through convenient doorstep pickup and delivery services across Nigeria.

## 🎯 Project Overview

Phone Fix eliminates the hassle of traveling to repair shops by bringing professional phone repair services directly to customers. The platform uses location-based matching to connect customers with nearby verified engineers, ensuring fast, safe, and transparent repair experiences.

### Key Features
- **Verified Engineers**: All technicians are background-checked and certified
- **Doorstep Service**: Pickup and delivery at your location
- **Real-time Tracking**: Monitor your device throughout the repair process
- **Transparent Pricing**: Clear estimates before service begins
- **Secure Transactions**: Safe payment and device handling protocols

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 16.1.1
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 3.4.19
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)
- **Deployment**: Vercel (recommended)

### Backend (See `/backend` folder)
- **Runtime**: Node.js 18+ with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT with bcrypt
- **Face Verification**: AWS Rekognition
- **File Storage**: AWS S3
- **Payment**: Paystack/Flutterwave
- **SMS/OTP**: Termii/Twilio
- **Email**: SendGrid/AWS SES
- **Real-time**: Socket.io
- **Job Queue**: Bull

For detailed backend documentation, see [backend/README.md](./backend/README.md)

## 📁 Project Structure

```
my-app/
├── app/
│   ├── components/          # Reusable components
│   │   ├── Header.js       # Navigation header
│   │   └── Footer.js       # Footer with state search
│   ├── page.js             # Landing page
│   ├── login/              # Authentication
│   ├── pickup/             # Pickup request form
│   ├── confirmation/       # Order confirmation
│   ├── tracking/           # Real-time order tracking
│   ├── dashboardC/         # Customer dashboard
│   ├── dashboardE/         # Engineer dashboard
│   ├── dashboardA/         # Admin dashboard
│   ├── details/            # Job details (Engineer)
│   ├── profileE/           # Engineer profile
│   ├── settingsPage/       # User settings
│   ├── support/            # Help & support
│   ├── layout.js           # Root layout
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.mjs         # Next.js configuration
└── package.json            # Dependencies
```

## 🎨 User Roles & Features

### 👤 Customer Features
- **Landing Page**: Service overview with trust badges and testimonials
- **Authentication**: Sign up/login with role selection
- **Request Pickup**: Multi-step form with device details and location selection
- **Dashboard**: View active repairs and order history
- **Order Tracking**: Real-time status updates with map preview
- **Profile & Settings**: Manage personal info, security, and notifications
- **Support**: FAQ, contact form, and help resources

### 🔧 Engineer Features
- **Dashboard**: View assigned jobs with filtering and status updates
- **Job Details**: Complete job information with customer contact
- **Status Management**: Update repair progress with confirmation
- **Notes & Proof**: Document repairs and upload completion photos
- **Profile**: Display credentials, ratings, and completed jobs

### 👨‍💼 Admin Features
- **Analytics Dashboard**: Platform metrics and KPIs
- **Engineer Approval**: Review and approve new engineer applications
- **Order Oversight**: Monitor all active orders in real-time
- **Platform Management**: Comprehensive control center

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 🗺️ Page Routes

| Route | Description | User Role |
|-------|-------------|-----------|
| `/` | Landing page | Public |
| `/login` | Authentication | Public |
| `/pickup` | Request pickup form | Customer |
| `/confirmation` | Order confirmation | Customer |
| `/tracking` | Real-time tracking | Customer |
| `/dashboardC` | Customer dashboard | Customer |
| `/dashboardE` | Engineer dashboard | Engineer |
| `/dashboardA` | Admin dashboard | Admin |
| `/details` | Job details | Engineer |
| `/profileE` | Engineer profile | Engineer |
| `/settingsPage` | User settings | All |
| `/support` | Help & support | All |

## 🎯 Core Workflows

### Customer Journey
1. **Discover** → Landing page with service info
2. **Sign Up** → Create account (Customer role)
3. **Request** → Fill pickup form with device details
4. **Select Location** → Choose state and LGA
5. **Confirm** → Review details and assigned engineer
6. **Track** → Monitor repair progress in real-time
7. **Receive** → Get device back at doorstep

### Engineer Journey
1. **Apply** → Submit application with credentials
2. **Approval** → Admin reviews and approves
3. **Dashboard** → View assigned jobs
4. **Accept** → Review job details
5. **Update** → Change status as repair progresses
6. **Complete** → Upload proof and mark done

### Admin Journey
1. **Monitor** → View platform analytics
2. **Approve** → Review engineer applications
3. **Oversee** → Track all active orders
4. **Manage** → Handle platform operations

## 🔐 Key Features Breakdown

### Location-Based Matching
- Nigerian states dropdown (all 36 states + FCT)
- LGA selection based on chosen state
- Validation for recognized locations
- Real-time engineer assignment

### Real-Time Tracking
- 4-stage progress timeline (Pending → Picked Up → In Repair → Returned)
- Live map preview
- Engineer contact information
- Estimated completion time

### Engineer Verification
- Document verification system
- Background checks
- Certification display
- Rating and review system

### Notification System
- Email notifications (order updates, marketing)
- Push notifications (real-time updates, messages)
- SMS notifications (critical updates)
- Granular preference controls

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) - Trust, reliability
- **Success**: Green (#16a34a) - Completed, verified
- **Warning**: Yellow (#eab308) - In progress, pending
- **Danger**: Red (#dc2626) - Urgent, errors
- **Neutral**: Gray - Backgrounds, text

### Typography
- **Font**: System fonts (Apple, Segoe UI, Roboto)
- **Headers**: Bold, 2xl-4xl
- **Body**: Regular, sm-base
- **Labels**: Medium, sm

### Components
- Card-based layouts
- Rounded corners (lg, xl)
- Shadow elevation (sm, md)
- Smooth transitions
- Responsive grid system

## 📱 Responsive Design

- **Mobile-first approach**
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly buttons (min 44px)
- Collapsible navigation
- Horizontal scroll for tables

## 🔒 Security Features

- Password strength validation
- Current password verification for changes
- Confirmation modals for critical actions
- Role-based access control
- Secure data handling

## 🚧 Future Enhancements

- [ ] Google Maps API integration
- [ ] Payment gateway integration
- [ ] Real-time chat system
- [ ] Mobile app (React Native)
- [ ] Device insurance options
- [ ] Multi-device repair support
- [ ] Advanced analytics dashboard
- [ ] Automated engineer matching algorithm

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

- **Developer**: [Your Name]
- **Project Type**: Phone Repair Logistics Platform
- **Target Market**: Nigeria

## 📞 Support

For questions or issues:
- Email: support@phonefix.com
- Phone: +234 800 123 4567
- Website: [Your Website]

---

**Built with ❤️ using Next.js and Tailwind CSS**
