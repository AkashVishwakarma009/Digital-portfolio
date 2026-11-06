# THE DIGITAL ROOM — 3D Developer Portfolio

A cinematic, interactive developer portfolio starter built with React, TypeScript, Vite, React Three Fiber, Drei, GSAP, Framer Motion and Tailwind CSS.

## Run locally
1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite.

## Production build
Run `npm run build`, then `npm run preview`.

## Personalize your portfolio
Edit the data in `src/data/portfolio.ts`:
- name, role, intro and email
- projects and links
- skills, education and experience
- social profiles

Replace `public/resume.pdf` with your own resume. Add your own images to `public/images` and update project image paths.

## Firebase admin panel
The separate admin console is available at `/admin`. It uses Firebase Email/Password Authentication and Realtime Database.

1. Create a Firebase project and enable **Email/Password** under Authentication.
2. Create a Realtime Database and add an admin user under Authentication.
3. Copy `.env.example` to `.env` and add the Firebase web app values.
4. Configure Realtime Database rules so only authenticated users can write the `portfolio` path.
5. Run `npm run dev`, then open `/admin` to sign in and manage the complete portfolio.

The admin console manages profile details, social links, skills, projects, experience and education/certifications. Changes are saved to the `portfolio` node and appear on the public portfolio automatically. Project images can be changed through their image URL/path; upload the image to your hosting or image service first. The public portfolio uses the local sample data until the Firebase database has a `portfolio` object. Never commit `.env`.
For Firebase Hosting, run `npm run build`, then `firebase deploy`. The included `firebase.json` rewrites `/admin` to the SPA entry point; set your Firebase project with `firebase use <project-id>` first.

## Notes
- The 3D room is constructed from Three.js geometries, so it works without downloading external models.
- The scene is interactive: click the monitor, hologram, photo frame, bookshelf or terminal.
- The portfolio panels and top navigation remain usable on mobile; the 3D scene automatically simplifies.
- The supplied profile and project content is clearly marked as editable sample content. Replace it before publishing.
- Ambient audio is intentionally not auto-played. The sound button is a user-controlled toggle; add your own licensed audio file at `public/audio/ambient.mp3` if desired.
