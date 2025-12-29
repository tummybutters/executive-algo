# The Executive Algorithm

## Overview
A newsletter landing page built with Vite and vanilla JavaScript. The site promotes "The Executive Algorithm" newsletter which distills insights from influential leaders and CEOs.

## Project Architecture
- **Build System**: Vite 7.x
- **Language**: Vanilla JavaScript (ES Modules)
- **Styling**: Custom CSS with Google Fonts (Outfit)

## Project Structure
```
/
├── public/           # Static assets
│   └── hero/people/  # Executive profile images
├── src/
│   ├── main.js       # Main entry point
│   ├── counter.js    # Counter component
│   ├── newsletter.js # Newsletter functionality
│   └── style.css     # Main stylesheet
├── index.html        # Main HTML file
├── vite.config.js    # Vite configuration
└── package.json      # Project dependencies
```

## Development
- Run `npm run dev` to start the development server on port 5000
- Run `npm run build` to build for production (outputs to `dist/`)
- Run `npm run preview` to preview the production build

## Deployment
Configured as a static site deployment. The build command runs `npm run build` and serves the `dist` directory.
