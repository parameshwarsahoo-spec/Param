# Param Personal Finance Static Publish

This folder is a dependency-free public web build.

## Publish Options

Netlify Drop:

1. Open https://app.netlify.com/drop
2. Drag the entire `apps/web-static` folder into the browser.
3. Netlify will return a public HTTPS URL.

Cloudflare Pages:

1. Create a Pages project.
2. Upload the contents of this folder.
3. Set the output directory to `/`.

Firebase Hosting:

```bash
firebase init hosting
firebase deploy
```

Use `apps/web-static` as the public directory.

## Local Preview

Open `index.html` directly, or serve this folder with any static file server.
