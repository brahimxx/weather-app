# Weather App

A modern, responsive weather application built with React that provides current weather conditions and forecasts for any location worldwide.

## Features

- 🌤️ **Real-time Weather Data** - Get current weather conditions for any city
- 📊 **Detailed Weather Stats** - View temperature, humidity, wind speed, and more
- 📅 **8-Day Forecast** - Check weather predictions for the week ahead
- 🎨 **Dynamic Weather Icons** - Beautiful SVG icons that change based on weather conditions and time of day (day/night)
- 📍 **Location Search** - Search for weather in any city around the world
- 🌓 **Day/Night Themes** - Weather icons adapt to day or night conditions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **React** 18.3.1 - Frontend framework
- **Material-UI** - UI components and styling
- **Axios** - HTTP client for API requests
- **WeatherAPI.com** - Weather data provider

## Installation

1. Clone the repository:

```bash
git clone https://github.com/brahimxx/weather-app.git
cd weather-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your WeatherAPI key:

```env
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### `npm start`

Runs the app in development mode.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── ForecastCard/          # Individual forecast day card
│   ├── ForecastCardsContainer/ # Container for forecast cards
│   ├── Header/                 # App header with search
│   ├── SearchBar/              # City search functionality
│   ├── StatCard/               # Individual weather stat card
│   ├── StatCardsContainer/     # Container for stat cards
│   ├── TabNav/                 # Navigation tabs
│   ├── TheWeather/             # Main weather display
│   ├── UserLocation/           # User location component
│   └── WeatherTitle/           # Weather title display
├── services/
│   └── api.js                  # API service for weather data
├── assets/
│   ├── animated_weather/       # Weather SVG icons
│   └── icons/                  # UI icons
├── WeatherApp.js               # Main app component
└── index.js                    # App entry point
```

## API

This app uses the [WeatherAPI.com](https://www.weatherapi.com/) service. You'll need to sign up for a free API key to use this application.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is open source and available under the MIT License.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
