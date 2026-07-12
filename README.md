# TasteTale
A storybook-style recipe archive featuring a CSS-powered 3D "book-opening" effect.

## 🚀 Project Workflow & Features

1. **The public homepage**: Features a responsive recipe grid and a client-side search bar to filter recipes by title or tag.
2. **The recipe detail page**: On desktop, clicking a recipe visually flips the page open like a book to reveal the recipe's ingredients and method, overlaid on a background illustration. On mobile, the experience degrades gracefully to a scrolling card view without the 3D flip.
3. **Admin login**: Access to the editor is gated behind a `/login` page, requiring admin credentials stored in environment variables to authenticate.
4. **The admin dashboard**: Lists all recipes and includes a search bar. Each recipe card offers quick actions to view the live page, edit the content, toggle visibility (hide/show), and delete the recipe permanently.
5. **The recipe visibility system**: Recipes can be hidden from the public by toggling their visibility. Hidden recipes do not appear for public visitors and their direct links will return a 404, but admins can still see, preview, and edit them on the dashboard. This differs from permanent deletion, which completely removes the recipe from the database.
6. **The recipe editor**: Exposes fields for Title, Slug, Background Image URL, Tags, Cook Times (Stove, Oven, Air Fryer), Theme (Fonts and Colors), Ingredients, and Method. It utilizes a Tiptap rich-text editor for the ingredients and method zones. Background images can be downloaded from the public view, though they are manually linked via URL in the editor.
7. **Live preview**: The editor includes a "Live Preview" toggle that instantly renders the recipe as it will appear on the public page before saving.

## 📦 Tech Stack

*   **Framework**: next@16.2.10, react@19.2.4, react-dom@19.2.4
*   **Styling**: tailwindcss@^4, @tailwindcss/postcss@^4
*   **Database**: mongoose@^9.7.4
*   **Auth**: next-auth@^4.24.14
*   **Image Storage**: @vercel/blob@^2.6.1
*   **Rich Text Editor**: @tiptap/react@^3.27.3, @tiptap/starter-kit@^3.27.3, @tiptap/extension-placeholder@^3.27.3, @tiptap/extension-text-align@^3.27.3, @tiptap/extension-text-style@^3.27.3
*   **Icons**: lucide-react@^1.24.0
*   **Fonts**: next/font/google (Fredoka, Nunito)

**Note on installed-but-unused dependencies:** `framer-motion` and `react-pageflip` are installed in `package.json` but are not imported or used anywhere in the source code.

## 📂 Project Structure

```text
src/
├── middleware.ts                        # NextAuth middleware protecting /edit routes
├── app/
│   ├── favicon.ico                      # Standard favicon
│   ├── globals.css                      # Global Tailwind CSS and Theme variables
│   ├── layout.tsx                       # Root layout & Google Fonts (Fredoka, Nunito)
│   ├── page.tsx                         # Public Homepage (Recipe Grid)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth secure authentication
│   │   ├── recipes/route.ts             # CRUD endpoint (GET for list, POST for create)
│   │   ├── recipes/[slug]/route.ts      # CRUD endpoint (GET, PUT for edit, PATCH for visibility, DELETE for hard delete)
│   │   └── upload/route.ts              # Vercel Blob image upload POST endpoint
│   ├── edit/
│   │   ├── page.tsx                     # Admin Dashboard listing recipes
│   │   ├── new/page.tsx                 # Admin Editor (Create mode)
│   │   └── [slug]/page.tsx              # Admin Editor (Edit mode)
│   ├── login/page.tsx                   # Admin Login Page
│   └── recipe/[slug]/page.tsx           # Public Recipe Detail (3D Book Page)
├── components/
│   ├── Flourish.tsx                     # Decorative corner SVG components
│   ├── ImageDownloader.tsx              # Button component to download recipe background images
│   ├── RecipeBook.tsx                   # Interactive 3D book component for recipe details
│   ├── RecipeEditor.tsx                 # Reusable admin form & live preview for creating/editing recipes
│   ├── RecipeGrid.tsx                   # Reusable grid component for displaying recipes (used on homepage)
│   └── TiptapEditor.tsx                 # Reusable Tiptap rich-text zone for editor
├── lib/
│   ├── auth.ts                          # NextAuth configuration and credentials logic
│   └── mongodb.ts                       # Cached MongoDB connection utility
└── models/
    ├── Comment.ts                       # Mongoose schema for Comments
    ├── Recipe.ts                        # Mongoose schema for Recipes
    └── User.ts                          # Mongoose schema for Users
```

## 🔐 Environment Variables

The following environment variables are required to run the app locally and must be set in your `.env.local` file:

*   `MONGODB_URI`: The connection string for your MongoDB database.
*   `NEXTAUTH_SECRET`: A secure random string used to encrypt NextAuth JWT sessions.
*   `ADMIN_EMAIL`: The email address used to log into the admin dashboard.
*   `ADMIN_PASSWORD`: The password used to log into the admin dashboard.
*   `BLOB_READ_WRITE_TOKEN`: The API token for Vercel Blob storage uploads.

## 🛠️ Getting Started

1. Clone the repository to your local machine.
2. Run `npm install` to install all dependencies.
3. Create a `.env.local` file in the root directory and populate it with the environment variables listed above.
4. Run the development server with `npm run dev`.
5. Navigate to `http://localhost:3000/login` to authenticate as an admin and begin creating recipes.

---

**Note on Unused Files:**
The `src/models/Comment.ts` file contains a Mongoose schema that is defined but not yet wired up or imported anywhere in the application. Future contributors should be aware that this is currently dead code.
