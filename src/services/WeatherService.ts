export interface WeatherData {
  location: string;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    pressure: number;
    visibility: number;
    description: string;
    icon: string;
    uv_index: number;
  };
  hourly: Array<{
    time: string;
    temp: number;
    icon: string;
    description: string;
  }>;
  daily: Array<{
    day: string;
    high: number;
    low: number;
    icon: string;
    description: string;
    precipitation: number;
  }>;
}

export interface OpenWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    pop: number;
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    // You'll need to get a free API key from https://openweathermap.org/api
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenWeather API key not found. Please set VITE_OPENWEATHER_API_KEY in your .env file');
    }
  }

  private getWeatherIcon(weatherId: number): string {
    // Map OpenWeather icon codes to our icon names
    if (weatherId >= 200 && weatherId < 300) return 'cloud-lightning';
    if (weatherId >= 300 && weatherId < 500) return 'cloud-rain';
    if (weatherId >= 500 && weatherId < 600) return 'cloud-rain';
    if (weatherId >= 600 && weatherId < 700) return 'cloud-rain';
    if (weatherId >= 700 && weatherId < 800) return 'cloud';
    if (weatherId === 800) return 'sun';
    if (weatherId >= 801 && weatherId < 900) return 'cloud';
    return 'cloud';
  }

  private celsiusToCelsius(celsius: number): number {
    return Math.round(celsius);
  }

  private metersPerSecondToMph(mps: number): number {
    return Math.round(mps * 2.237);
  }

  private metersToMiles(meters: number): number {
    return Math.round(meters * 0.000621371);
  }

  private hPaToHpa(hpa: number): number {
    return Math.round(hpa);
  }

  private improveCityName(city: string): string {
    // Common city name improvements for better API results
    const cityMappings: { [key: string]: string } = {
      'new york': 'New York, US',
      'nyc': 'New York, US',
      'london': 'London, GB',
      'tokyo': 'Tokyo, JP',
      'mumbai': 'Mumbai, IN',
      'bombay': 'Mumbai, IN',
      'paris': 'Paris, FR',
      'sydney': 'Sydney, AU',
      'delhi': 'Delhi, IN',
      'bangalore': 'Bangalore, IN',
      'chennai': 'Chennai, IN',
      'kolkata': 'Kolkata, IN',
      'hyderabad': 'Hyderabad, IN',
      'pune': 'Pune, IN',
      'ahmedabad': 'Ahmedabad, IN',
      'jaipur': 'Jaipur, IN',
      'lucknow': 'Lucknow, IN',
      'kanpur': 'Kanpur, IN',
      'nagpur': 'Nagpur, IN',
      'indore': 'Indore, IN'
    };

    const normalizedCity = city.toLowerCase().trim();
    return cityMappings[normalizedCity] || city;
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Try to improve city name for better API results
    const improvedCityName = this.improveCityName(city);

    try {
      // Get current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(improvedCityName)}&appid=${this.apiKey}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error(`City not found: ${city}. Try using the full city name or adding country code (e.g., "New York, US")`);
      }

      const currentData: OpenWeatherResponse = await currentResponse.json();

      // Get 5-day forecast
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(improvedCityName)}&appid=${this.apiKey}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const forecastData: ForecastResponse = await forecastResponse.json();

      // Process current weather
      const current = {
        temp: this.celsiusToCelsius(currentData.main.temp),
        feels_like: this.celsiusToCelsius(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: this.metersPerSecondToMph(currentData.wind.speed),
        pressure: this.hPaToHpa(currentData.main.pressure),
        visibility: this.metersToMiles(currentData.visibility),
        description: currentData.weather[0].description,
        icon: this.getWeatherIcon(currentData.weather[0].id),
        uv_index: 6 // OpenWeather free API doesn't include UV index
      };

      // Process hourly forecast (next 8 hours)
      const hourly = forecastData.list
        .slice(0, 8)
        .map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            hour12: true 
          }),
          temp: this.celsiusToCelsius(item.main.temp),
          icon: this.getWeatherIcon(item.weather[0].id),
          description: item.weather[0].description
        }));

      // Process daily forecast (next 7 days)
      const daily = forecastData.list
        .filter((item, index) => index % 8 === 0) // Get one forecast per day
        .slice(0, 7)
        .map(item => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return {
            day: day === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? 'Today' : day,
            high: this.celsiusToCelsius(item.main.temp_max),
            low: this.celsiusToCelsius(item.main.temp_min),
            icon: this.getWeatherIcon(item.weather[0].id),
            description: item.weather[0].description,
            precipitation: Math.round(item.pop * 100)
          };
        });

      return {
        location: `${currentData.name}, ${currentData.sys.country}`,
        current,
        hourly,
        daily
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    try {
      // Get current weather by coordinates
      const currentResponse = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!currentResponse.ok) {
        throw new Error('Failed to fetch weather data for coordinates');
      }

      const currentData: OpenWeatherResponse = await currentResponse.json();

      // Get 5-day forecast by coordinates
      const forecastResponse = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data for coordinates');
      }

      const forecastData: ForecastResponse = await forecastResponse.json();

      // Process data similar to city search
      const current = {
        temp: this.celsiusToCelsius(currentData.main.temp),
        feels_like: this.celsiusToCelsius(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: this.metersPerSecondToMph(currentData.wind.speed),
        pressure: this.hPaToHpa(currentData.main.pressure),
        visibility: this.metersToMiles(currentData.visibility),
        description: currentData.weather[0].description,
        icon: this.getWeatherIcon(currentData.weather[0].id),
        uv_index: 6
      };

      const hourly = forecastData.list
        .slice(0, 8)
        .map(item => ({
          time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            hour12: true 
          }),
          temp: this.celsiusToCelsius(item.main.temp),
          icon: this.getWeatherIcon(item.weather[0].id),
          description: item.weather[0].description
        }));

      const daily = forecastData.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 7)
        .map(item => {
          const date = new Date(item.dt * 1000);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return {
            day: day === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? 'Today' : day,
            high: this.celsiusToCelsius(item.main.temp_max),
            low: this.celsiusToCelsius(item.main.temp_min),
            icon: this.getWeatherIcon(item.weather[0].id),
            description: item.weather[0].description,
            precipitation: Math.round(item.pop * 100)
          };
        });

      return {
        location: `${currentData.name}, ${currentData.sys.country}`,
        current,
        hourly,
        daily
      };
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();
