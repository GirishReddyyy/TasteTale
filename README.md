# TasteTale 📖✨

TasteTale is a beautiful, storybook-style recipe archive built with Next.js. It features a stunning public-facing recipe library with a CSS-powered 3D "book-opening" effect, and a secure, private Admin Editor with a Tiptap rich-text interface for creating and managing recipes.

## 🚀 Project Workflow & Features

1. **Public Archive**: Visitors arrive at the homepage (`/`) where they can view a responsive grid of recipe cards and use a client-side search bar to filter by title or tags.
2. **Interactive Recipe Pages**: Clicking a recipe card navigates to `/recipe/[slug]`. On desktop, the page visually flips open like a book to reveal the recipe ingredients and method. The text is fully selectable and overlaid on top of a decorative background illustration. On mobile, it degrades gracefully to a scrolling card view.
3. **Secure Admin Login**: Administrators can access the editor by navigating to `/login` and authenticating with the credentials configured in the environment variables.
4. **Rich-Text Editor**: Authenticated admins can create (`/edit/new`) or edit (`/edit/[slug]`) recipes. The editor uses a zoned layout powered by Tiptap, allowing admins to customize fonts, colors, text alignment, and upload background illustrations directly to Vercel Blob.
5. **Live Preview**: While editing, admins can toggle a "Live Preview" to instantly see how their recipe will look on the public page before hitting save.

## 📦 Dependencies & Tech Stack

This project uses a modern full-stack Next.js architecture (App Router):

*   **Framework**: [Next.js (App Router)](https://nextjs.org/) & [React](https://react.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling and CSS 3D transforms.
*   **Database**: [MongoDB](https://www.mongodb.com/) via the [Mongoose](https://mongoosejs.com/) ODM.
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider with JWT sessions).
*   **Image Storage**: [@vercel/blob](https://vercel.com/docs/storage/vercel-blob) for uploading and hosting background illustrations.
*   **Rich Text Editor**: [Tiptap](https://tiptap.dev/) along with its extensions (`StarterKit`, `TextStyle`, `Color`, `TextAlign`, `FontFamily`) for the zoned recipe editor.
*   **Icons**: [Lucide React](https://lucide.dev/) for clean, customizable SVG icons.

*(Note: `framer-motion` and `react-pageflip` are installed as optional animation dependencies, but the core 3D book effect is achieved via pure CSS and Tailwind utility classes for maximum performance).*

## 📂 Project Structure

```text
TasteTale/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth secure authentication
│   │   │   ├── recipes/                     # CRUD endpoints (GET, POST, PUT, DELETE)
│   │   │   └── upload/route.ts              # Vercel Blob image upload endpoint
│   │   ├── edit/
│   │   │   ├── [slug]/page.tsx              # Admin Editor (Edit mode)
│   │   │   └── new/page.tsx                 # Admin Editor (Create mode)
│   │   ├── login/page.tsx                   # Admin Login Page
│   │   ├── recipe/[slug]/page.tsx           # Public Recipe Detail (3D Book Page)
│   │   ├── globals.css                      # Global Tailwind CSS and Theme variables
│   │   ├── layout.tsx                       # Root layout & Google Fonts (Inter, Caveat)
│   │   └── page.tsx                         # Public Homepage (Recipe Grid)
│   ├── components/
│   │   ├── RecipeBook.tsx                   # Interactive 3D book component
│   │   ├── RecipeEditor.tsx                 # Reusable admin form & live preview
│   │   ├── RecipeGrid.tsx                   # Homepage grid & search filter
│   │   └── TiptapEditor.tsx                 # Reusable Tiptap rich-text zone
│   ├── lib/
│   │   └── mongodb.ts                       # Cached MongoDB connection utility
│   ├── models/
│   │   ├── Comment.ts                       # Mongoose schema (Phase 2)
│   │   ├── Recipe.ts                        # Mongoose schema for Recipes
│   │   └── User.ts                          # Mongoose schema for Users
│   └── middleware.ts                        # Protects /edit routes via NextAuth
├── .env.example                             # Environment variable documentation
├── next.config.ts                           # Next.js configuration
└── tailwind.config.ts / postcss.config.mjs  # Styling configuration
```

## 🛠️ Getting Started

1. **Clone the repository** and run `npm install` to install all dependencies.
2. **Set up Environment Variables**: Create a `.env.local` file in the root directory (you can copy the structure from `.env.example`). You will need:
   *   `MONGODB_URI`: Your MongoDB Atlas connection string.
   *   `ADMIN_EMAIL` & `ADMIN_PASSWORD`: The credentials you will use to log in.
   *   `NEXTAUTH_SECRET`: A secure random string for JWT encryption.
   *   `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob API key.
3. **Run the Development Server**: Execute `npm run dev`.
4. **View the App**: Open [http://localhost:3000](http://localhost:3000) in your browser. Navigate to `/login` to access the admin editor and start creating recipes!
