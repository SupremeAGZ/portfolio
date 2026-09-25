# Roblox Creative Portfolio

A polished, responsive static portfolio website for Roblox UI, GFX and development work.

## Edit your site

Open `projects.js`.

### Change your identity
Edit:
- `SITE.name`
- `SITE.email`
- `SITE.x`
- `SITE.heroDescription`
- `SITE.about`

### Add your work
1. Put your images in `assets/images/`.
2. Add a project object to `PROJECTS`.
3. Use a path like `assets/images/my-ui.png`.
4. Set `category` to `UI`, `GFX`, `DEV`, or another category.
5. Put your public project/post URL in `link`.

## Preview locally

Double-clicking `index.html` will usually work for the visual site, but a local server is better.

If you have VS Code:
1. Install the "Live Server" extension.
2. Right-click `index.html`.
3. Choose "Open with Live Server".

## Publish it so people can click a link

### GitHub Pages (free)
1. Create a GitHub account at https://github.com if you do not already have one.
2. Create a new public repository, for example `portfolio`.
3. Upload everything inside this folder to the repository.
4. In the repository go to Settings → Pages.
5. Under the deployment/source option, choose the branch containing your files (normally `main`) and the root folder `/`.
6. Save.
7. GitHub will give you a public URL similar to:
   `https://YOUR_USERNAME.github.io/portfolio/`

Send that URL to people, or put it in your X profile.

### Custom domain (optional)
Later you can buy a domain such as `yourname.dev` and connect it to GitHub Pages. GitHub Pages supports custom domains.

## Important
This version is intentionally static: no database, no server, no login and no monthly hosting bill is required. Your portfolio content lives in `projects.js` and your images live in `assets/images/`.
