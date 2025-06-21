# React MapLibre GL Example

This is a simple example application demonstrating the React MapLibre GL wrapper with various features.

**Note:** This example uses React 17 to maintain compatibility with the library components.

## Features Demonstrated

- ✅ Basic Map with TomTom API key
- ✅ Navigation Controls (zoom, compass, pitch)
- ✅ Geolocate Control (user location tracking)
- ✅ Scale Control (metric/imperial units)
- ✅ Interactive Markers with custom styling
- ✅ Popups with custom content
- ✅ GeoJSON Layer with points and lines
- ✅ Dynamic show/hide functionality

## Setup

1. **Install Dependencies**

   ```bash
   cd example
   yarn install
   ```

2. **Configure API Key**

   - The example includes a `.env` file with a sample API key
   - If you need to use your own key, edit `example/.env` and replace the value:
     ```
     VITE_TOMTOM_API_KEY=your_actual_api_key_here
     ```
   - Get a free API key from [developer.tomtom.com](https://developer.tomtom.com/)

3. **Run the Development Server**

   ```bash
   yarn dev
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - You should see the map with all the interactive features

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## Project Structure

```
example/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # Vite environment types
├── .env                 # Environment variables (API key)
├── package.json         # Dependencies and scripts
├── yarn.lock            # Yarn lock file
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── index.html           # HTML template
```

## Environment Variables

The example uses Vite's environment variable system:

- `VITE_TOMTOM_API_KEY` - Your TomTom API key for map tiles and services

## Notes

- The example uses Vite for fast development and building
- React 17 is used for compatibility with the library components
- All map components are imported from the parent `src/` directory
- The map uses TomTom's tile service with MapLibre GL for rendering
- Interactive features include clickable markers, popups, and toggleable layers
