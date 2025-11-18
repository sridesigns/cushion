# Cushion - Savings & Expense Tracker

A modern, clean web application to track your savings and expenses. Built with the latest web technologies and designed for simplicity and ease of use.

![Cushion App](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- **Savings Tracking** - Easily track deposits and withdrawals
- **Dashboard Overview** - View your total savings, monthly trends, and averages at a glance
- **Transaction History** - See all your savings transactions in an organized list
- **Dark Mode** - Seamless dark/light mode support with system preference detection
- **Local Storage** - Your data persists locally in your browser
- **Clean UI** - Modern, intuitive interface inspired by Monarch
- **Responsive Design** - Works perfectly on desktop and mobile devices

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

### Adding a Savings Entry

1. Click the "Add Savings" button in the top right
2. Choose whether it's a deposit or withdrawal
3. Enter the amount and category
4. Optionally add a description
5. Select the date
6. Click "Save Entry"

### Viewing Your Dashboard

The dashboard displays:
- **Total Savings**: Your cumulative savings balance
- **This Month**: Savings for the current month
- **Last Month**: Previous month's savings
- **Monthly Average**: Average monthly savings across all time

### Managing Transactions

- View all transactions in the "Recent Transactions" section
- Delete any transaction by clicking the trash icon
- Transactions are sorted by date (most recent first)

## Deployment

This app is optimized for deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy
4. Your app will be live!

## Roadmap

- [ ] Expense tracking functionality
- [ ] Categories management
- [ ] Data export (CSV, PDF)
- [ ] Budget goals and targets
- [ ] Charts and visualizations
- [ ] Backend integration (database)
- [ ] User authentication
- [ ] Multi-currency support
- [ ] Mobile apps (iOS & Android)
- [ ] Recurring transactions

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
