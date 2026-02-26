# Streamrock Realty Corporation

A modern, professional MERN stack real estate platform for property listings and management.

## 📚 Documentation

**Essential Guides:**
- 📖 [**DEVELOPMENT_WORKFLOW.md**](./DEVELOPMENT_WORKFLOW.md) - Complete development workflow for project owner and co-developers
- ⚡ [**QUICK_WORKFLOW.md**](./QUICK_WORKFLOW.md) - Quick reference for daily tasks
- 🚀 [**DEPLOYMENT_GUIDE.md**](./DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- 🏃 [**QUICK_START.md**](./QUICK_START.md) - Get started in 5 minutes

**Read DEVELOPMENT_WORKFLOW.md first for complete team workflow!**

## 🏗️ Project Structure

```
streamrock/
├── backend/           # Node.js + Express + MongoDB API
├── frontend/          # React + Vite + Tailwind CSS
├── mobile/           # React Native (Future Development)
├── DEVELOPMENT_WORKFLOW.md   # Complete workflow guide
├── QUICK_WORKFLOW.md          # Quick reference
├── DEPLOYMENT_GUIDE.md        # Deployment instructions
└── README.md
```

## ✨ Features

- 🏠 **Property Listings**: Browse premium properties across multiple locations
- 🔍 **Advanced Search**: Filter by location, price, property type, and more
- 📱 **Fully Responsive**: Mobile-first design with tablet and desktop support
- 💼 **Property Categories**: 
  - Nuvali Properties
  - Vermosa Properties
  - Southmont Properties
  - Batangas Beach Properties
  - Pre-selling Properties
  - Bank Foreclosed Properties
- 📧 **Contact Forms**: Direct inquiry system with MongoDB storage
- 🎨 **Modern UI/UX**: Clean, minimalist design with smooth animations
- ⚡ **Fast Performance**: Built with Vite for optimal loading speeds

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env`:
- MongoDB connection string included
- Default port: 5000

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📦 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library

## 🎨 Design Features

- **Color Scheme**:
  - Primary: `#1a365d` (Deep Blue)
  - Secondary: `#2c5282` (Medium Blue)
  - Accent: `#c7996b` (Gold/Bronze)
  - Light: `#f7fafc` (Off White)
  - Dark: `#1a202c` (Dark Gray)

- **Typography**:
  - Headings: Georgia (Serif)
  - Body: Inter (Sans-serif)

- **Responsive Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## 📱 Mobile App (Future)

The `mobile/` directory is prepared for React Native development. See [mobile/README.md](mobile/README.md) for details.

## 🔧 API Endpoints

### Properties
- `GET /api/properties` - Get all properties (supports filtering)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Inquiries
- `GET /api/inquiries` - Get all inquiries
- `GET /api/inquiries/:id` - Get single inquiry
- `POST /api/inquiries` - Create inquiry
- `PATCH /api/inquiries/:id` - Update inquiry status

## 🌐 Deployment

### Backend Deployment (Example: Heroku)
```bash
cd backend
heroku create streamrock-api
git push heroku main
```

### Frontend Deployment (Example: Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://grafrafraftorres28:y33CwzAkoHffENbQ@cluster0.0c5qorv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
NODE_ENV=development
```

## 🎯 Pages

1. **Home** (`/`) - Hero section, features, featured properties, contact form
2. **Properties** (`/properties`) - Full property listings with filters
3. **About** (`/about`) - Company information and values
4. **Contact** (`/contact`) - Contact information and inquiry form

## 🔐 Security Notes

- MongoDB credentials are included (consider rotating for production)
- Add authentication middleware for admin routes
- Implement rate limiting for API endpoints
- Enable HTTPS in production
- Add input validation and sanitization

## 🛠️ Development

### Adding New Properties (Sample Data)

You can add properties via the API or directly in MongoDB:

```javascript
POST /api/properties
{
  "name": "Property Name",
  "category": "Nuvali Properties",
  "location": "Sta. Rosa, Laguna",
  "price": 4500000,
  "description": "Property description",
  "propertyType": "House and Lot",
  "bedrooms": 3,
  "bathrooms": 2,
  "lotArea": 120,
  "featured": true
}
```

## 📄 License

This project is private and confidential.

## 👤 Contact

**Streamrock Realty Corporation**
- Phone: +63 912 345 6789
- Email: info@streamrockrealty.com
- Address: Blk 8 Lot 3 Iris St., Camella Homes I, Brgy. Putatan, Muntinlupa City 1770

## 🎨 Customization

### Updating Logo
Replace the placeholder logo:
- Frontend: `frontend/public/favicon.svg`
- Update the navbar logo in `frontend/src/components/Navbar.jsx`

### Color Scheme
Modify colors in `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#1a365d',
  secondary: '#2c5282',
  accent: '#c7996b',
  // ... add your colors
}
```

## ✅ Checklist

- [x] Backend API setup
- [x] MongoDB connection
- [x] React frontend with Vite
- [x] Responsive design (mobile-first)
- [x] Property listing and filtering
- [x] Contact/inquiry forms
- [x] Navigation and routing
- [x] Sample property data
- [x] Tailwind CSS styling
- [x] React Native directory prepared
- [ ] Add authentication
- [ ] Add admin dashboard
- [ ] Deploy to production
- [ ] Add image upload
- [ ] Implement pagination
- [ ] Add property details page
- [ ] SEO optimization

---

**Built with ❤️ for Streamrock Realty Corporation**
