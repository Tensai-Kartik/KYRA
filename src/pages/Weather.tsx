import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, Thermometer, Eye, Gauge, Navigation } from 'lucide-react';
import { Search, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { weatherService, WeatherData } from '@/services/WeatherService';
import { useToast } from '@/hooks/use-toast';

const Weather: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState('Mumbai');
  const { toast } = useToast();

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Use coordinates to get weather for user's location
          getWeatherByCoordinates.mutate({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.log('Geolocation not available:', error);
          // Fallback to default city
          getWeatherByCity.mutate('Mumbai');
        }
      );
    } else {
      // Fallback to default city
      getWeatherByCity.mutate('Mumbai');
    }
  }, []);

  // Query for weather data
  const { data: weather, isLoading, error, refetch } = useQuery({
    queryKey: ['weather', currentCity],
    queryFn: () => weatherService.getWeatherByCity(currentCity),
    enabled: !!currentCity,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Mutation for city search
  const getWeatherByCity = useMutation({
    mutationFn: (city: string) => weatherService.getWeatherByCity(city),
    onSuccess: (data, city) => {
      setCurrentCity(city);
      toast({
        title: "Weather Updated",
        description: `Weather data for ${data.location} has been loaded.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch weather data",
        variant: "destructive",
      });
    },
  });

  // Mutation for coordinates search
  const getWeatherByCoordinates = useMutation({
    mutationFn: ({ lat, lon }: { lat: number; lon: number }) => 
      weatherService.getWeatherByCoordinates(lat, lon),
    onSuccess: (data) => {
      setCurrentCity(data.location.split(',')[0]);
      toast({
        title: "Location Detected",
        description: `Weather data for your current location (${data.location}) has been loaded.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch weather data for your location",
        variant: "destructive",
      });
      // Fallback to default city
      getWeatherByCity.mutate('Mumbai');
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      getWeatherByCity.mutate(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const refreshWeather = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Weather data is being refreshed...",
    });
  };

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloud': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'cloud-rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'cloud-lightning': return <CloudLightning className="w-8 h-8 text-yellow-600" />;
      default: return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  const getWeatherIconSmall = (icon: string) => {
    switch (icon) {
      case 'sun': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloud': return <Cloud className="w-5 h-5 text-gray-400" />;
      case 'cloud-rain': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'cloud-lightning': return <CloudLightning className="w-5 h-5 text-yellow-600" />;
      default: return <Cloud className="w-5 h-5 text-gray-400" />;
    }
  };

  // Loading state
  if (isLoading && !weather) {
    return (
      <div className="p-6 space-y-6 min-h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Weather</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto" />
            <p className="text-lg text-muted-foreground">Loading weather data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !weather) {
    return (
      <div className="p-6 space-y-6 min-h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Weather</h1>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
              <h3 className="text-xl font-semibold">Failed to Load Weather</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'An error occurred while loading weather data.'}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Try searching for a different city or check your API key configuration.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => refetch()}>Try Again</Button>
                  <Button onClick={() => getWeatherByCity.mutate('Mumbai')} variant="outline">
                    Load Mumbai
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No weather data
  if (!weather) {
    return (
      <div className="p-6 space-y-6 min-h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Weather</h1>
          </div>
        </div>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Enter a city name to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cloud className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Weather</h1>
        </div>
        <Button 
          onClick={refreshWeather} 
          disabled={isLoading} 
          variant="outline" 
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for a city (e.g., London, Tokyo, Mumbai)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
                disabled={getWeatherByCity.isPending}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={getWeatherByCity.isPending || !searchQuery.trim()}
            >
              {getWeatherByCity.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            💡 Try: London, Tokyo, Mumbai, New York, Paris, Sydney
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{weather.location}</span>
              </CardTitle>
              <CardDescription>{weather.current.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{weather.current.temp}°C</div>
              <div className="text-sm text-muted-foreground">Feels like {weather.current.feels_like}°C</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            {getWeatherIcon(weather.current.icon)}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="font-medium">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Wind</p>
                <p className="font-medium">{weather.current.wind_speed} mph</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pressure</p>
                <p className="font-medium">{weather.current.pressure} hPa</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Visibility</p>
                <p className="font-medium">{weather.current.visibility} mi</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Forecast</CardTitle>
          <CardDescription>Next 8 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {weather.hourly.map((hour, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 min-w-[80px]">
                <span className="text-sm font-medium">{hour.time}</span>
                {getWeatherIconSmall(hour.icon)}
                <span className="text-lg font-bold">{hour.temp}°C</span>
                <span className="text-xs text-muted-foreground text-center">{hour.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
          <CardDescription>Extended weather outlook</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weather.daily.map((day, index) => (
              <div key={index}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-16 font-medium">{day.day}</span>
                    {getWeatherIconSmall(day.icon)}
                    <span className="text-sm text-muted-foreground w-20">{day.description}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">{day.precipitation}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{day.high}°C</span>
                      <span className="text-sm text-muted-foreground">{day.low}°C</span>
                    </div>
                  </div>
                </div>
                {index < weather.daily.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts - This would need to be implemented with a paid API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CloudLightning className="w-5 h-5 text-yellow-600" />
            <span>Weather Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Weather alerts are not available with the free API tier.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;
