# Cushion - Savings & Expense Tracker

A modern, clean web application to track your savings and expenses. Built with the latest web technologies and designed for simplicity and ease of use.

![Cushion App](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- ✨ **Modern Design** - Sleek glassmorphism UI with neon green branding
- 📊 **Savings Tracking** - Track deposits and withdrawals with categories
- 💰 **Multi-Currency** - Support for INR, USD, EUR, SGD, HKD, CNY, JPY
- 🎨 **Theme Support** - Light, dark, and system themes
- 🌐 **Notion Integration** - Optional auto-sync to Notion database
- 👤 **User Profiles** - Personalized welcome messages with time-based greetings
- 🔐 **Secure** - Input validation and sanitization for all user data
- 📱 **Responsive** - Works beautifully on mobile and desktop
- 💾 **Local Storage** - Your data persists locally with optional cloud sync

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cushion
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### For End Users

When you first open the app, you'll see a login screen with two options:

1. **Continue with Notion** (if enabled by app owner)
   - Syncs your data to Notion automatically
   - Requires a Notion account
   - Data backed up to the cloud

2. **Continue as Guest**
   - Works entirely offline
   - Data stored in your browser
   - No account required
   - Enter your name for a personalized experience

### Adding a Savings Entry

1. Click the "+" button in the bottom navigation
2. Choose whether it's a deposit or withdrawal
3. Enter the amount (quick presets available)
4. Add a category for organization
5. Optionally add a description and select date
6. Review and save

### Viewing Your Dashboard

The dashboard shows:
- **Personalized greeting** - Changes based on time of day
- **Total Savings** - Your cumulative savings balance
- **This Month** - Savings for the current month
- **Last Month** - Previous month's savings
- **Monthly Average** - Average monthly savings

### Settings

Access settings to:
- Change theme (Light/Dark/System)
- Select your preferred currency
- Connect/disconnect Notion (if enabled)
- View account information
- Log out

## Deployment

This app is optimized for deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy
4. Your app will be live!

## Notion Integration Setup (Optional - For App Owners)

If you want to enable Notion sync for your users, follow these steps:

### Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "+ New integration"
3. Fill in the details:
   - **Name**: Cushion Savings Tracker
   - **Type**: Public
   - **Capabilities**: Select "Read content", "Update content", "Insert content"
4. Add Redirect URIs:
   - Development: `http://localhost:3000/api/notion/callback`
   - Production: `https://yourdomain.com/api/notion/callback`
5. Click "Submit"
6. Copy your **OAuth client ID** and **OAuth client secret**

### Step 2: Set Environment Variables

**For Local Development:**

1. Copy `.env.example` to `.env.local`
2. Add your credentials:
```env
NEXT_PUBLIC_NOTION_CLIENT_ID=your_client_id_here
NOTION_CLIENT_SECRET=your_client_secret_here
```

**For Production:**

Add these environment variables in your Vercel/hosting platform settings:
- `NEXT_PUBLIC_NOTION_CLIENT_ID`: Your integration's OAuth client ID
- `NOTION_CLIENT_SECRET`: Your integration's OAuth client secret

### Important Notes

- **You only need to do this once** - all your users will connect through YOUR integration
- If you skip this, the app still works perfectly - users just won't see the Notion option
- Users will see "Continue with Notion" only if you've configured these environment variables
- Make sure to add your production domain to Notion's Redirect URIs!

## Roadmap

### Completed ✅
- [x] Multi-currency support
- [x] User authentication (Notion/Guest)
- [x] Backend integration (Notion database)
- [x] Categories management
- [x] Dark mode support
- [x] Responsive mobile design

### Coming Soon
- [ ] Expense tracking functionality
- [ ] Data export (CSV, PDF)
- [ ] Budget goals and targets
- [ ] Charts and visualizations
- [ ] Mobile apps (iOS & Android)
- [ ] Recurring transactions
- [ ] More integrations (Google Sheets, Airtable, etc.)

## Contributing

This is an open-source project. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by [Monarch](https://www.monarchmoney.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
