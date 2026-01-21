This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This application uses **Next.js App Router**, **TypeScript**, and integrates with **Firestore database** as a data source.

## Getting Started

### How to Run Locally

#### Prerequisites
- Node.js **18+** (LTS recommended)
- npm / yarn / pnpm / bun (any one)

### Setup Steps

1. Clone the repository
```bash
git clone <repository-url>
cd <project-folder>

```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Update Environment Variables `.env.local`

Create a `.env.local` file on the root directory.

## Environment Variables Needed

Example `.env.local`
```bash
# Admin panel 
ADMIN_NAME=xxxxxxxxxxxxx
ADMIN_EMAIL=AdminLoginEmail
ADMIN_PASSWORD=AdminLoginPassword
NEXTAUTH_SECRET=xxxxxxxxxxxxx

# Firebase Config
FIREBASE_PROJECT_ID=xxxxxxxxxxxxx
FIREBASE_CLIENT_EMAIL=xxxxxxxxxxxxx
FIREBASE_private_key="-----BEGIN PRIVATE KEY----------END PRIVATE KEY-----\n"
```

## Important Notes

❌ Never commit `.env.local` to Git

🔁 Restart dev server after updating env variables

5. Start the Local server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure (Overview)
```bash
app/                # App Router pages & layouts
components/         # Reusable UI components
lib/                # Utilities & helpers
public/             # Static assets
app/globals.css     # Global styles
```

You can start editing the `/calculator` page by modifying:

```bash
app/calculator/page.tsx
```

You can edit the `/calculator` page steps by modifying:

```bash
src/components/steps/BudgetStep.tsx
src/components/steps/AllocateStep.tsx
```

You can start editing the `/dashboard` page by modifying:

```bash
app/dashboard/page.tsx
```

You can start editing the `Save Progress` `Download PDF` `Download CSV` modals by modifying:

```bash
src/components/modals/SaveProgressModal.tsx
src/components/modals/DownloadReportModal.tsx
src/components/modals/DownloadReportCSVModal.tsx

```

The page auto-updates as you edit the file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### First-time Deployment

1. Push code to GitHub / GitLab / Bitbucket

2. Go to https://vercel.com/new

3. Import repository

4. Add environment variables in: `Vercel → Project Settings → Environment Variables`

5. Click Deploy

#### Vercel will automatically:

- Install dependencies
- Build the app
- Deploy automatically

### Subsequent Pushes (Automatic Deploys)

Once the project is connected to your Git repository:

Any push to the main / production branch will automatically trigger a new deployment

#### Vercel will automatically:

- Fetch the latest code
- Install any new dependencies
- Build the project
- Deploy the updated app

You don’t need to do anything manually, unless you add or update environment variables.

#### Tip:

1. For feature branches, Vercel automatically creates Preview Deployments.
2. Use these previews to test changes before merging to main/production.

## Basic Troubleshooting

### App not starting

#### Check Node version
```bash
node -v

```

#### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not working

- File must be named `.env.local`
- Restart dev server
- Check spelling of variable names

### Firestore Database Query Error

- Ensure all Firebase credentials are correctly set in `.env.local`
- Confirm the project is pointing to the correct Firebase `project ID`
- Recheck the Firestore Query
- Restart the development server after updating environment variables

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


