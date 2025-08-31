import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Music2, 
  Play, 
  Heart, 
  List, 
  Search,
  Plus,
  ExternalLink,
  Headphones,
  Radio,
  Disc3,
  Mic,
  Clock,
  Star,
  Circle
} from 'lucide-react';

interface MusicService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  url: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songCount: number;
  cover: string;
  service: string;
  url: string;
}

const Music: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'playlists' | 'recent'>('services');

  const musicServices: MusicService[] = [
    {
      id: 'spotify',
      name: 'Spotify',
      description: 'Stream millions of songs, podcasts, and playlists',
      icon: <Circle className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      url: 'https://open.spotify.com'
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      description: 'Official music streaming from YouTube',
      icon: <Circle className="w-8 h-8" />,
      color: 'from-red-500 to-red-600',
      url: 'https://music.youtube.com'
    },
    {
      id: 'apple',
      name: 'Apple Music',
      description: 'Stream over 90 million songs ad-free',
      icon: <Music2 className="w-8 h-8" />,
      color: 'from-pink-500 to-pink-600',
      url: 'https://music.apple.com'
    },
    {
      id: 'amazon',
      name: 'Amazon Music',
      description: 'Stream millions of songs with Prime',
      icon: <Music2 className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      url: 'https://music.amazon.com'
    }
  ];

  const featuredPlaylists: Playlist[] = [
    {
      id: '1',
      name: 'Today\'s Top Hits',
      description: 'The hottest tracks right now',
      songCount: 50,
      cover: '🔥',
      service: 'spotify',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'
    },
    {
      id: '2',
      name: 'Chill Vibes',
      description: 'Relaxing music for any mood',
      songCount: 35,
      cover: '🌙',
      service: 'spotify',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX3WvGXE8FqYX'
    },
    {
      id: '3',
      name: 'Workout Mix',
      description: 'High energy tracks to keep you moving',
      songCount: 40,
      cover: '💪',
      service: 'spotify',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP'
    },
    {
      id: '4',
      name: 'Classic Rock',
      description: 'Timeless rock anthems',
      songCount: 60,
      cover: '🎸',
      service: 'spotify',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX5Vy6DFOcx00'
    },
    {
      id: '5',
      name: 'Jazz Lounge',
      description: 'Smooth jazz for sophisticated listening',
      songCount: 45,
      cover: '🎷',
      service: 'spotify',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt'
    },
    {
      id: '6',
      name: 'Electronic Beats',
      description: 'Electronic and dance music',
      songCount: 55,
      cover: '🎧',
      service: 'spotify',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6'
    }
  ];

  const recentSearches = [
    'Bohemian Rhapsody',
    'Hotel California',
    'Imagine',
    'Stairway to Heaven',
    'Like a Rolling Stone'
  ];

  const handleServiceClick = (service: MusicService) => {
    window.open(service.url, '_blank');
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    window.open(playlist.url, '_blank');
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Search on Spotify by default
      const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
      window.open(spotifySearchUrl, '_blank');
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const filteredPlaylists = featuredPlaylists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Music2 className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold">Music</h1>
      </div>

      {/* Quick Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-primary" />
            <span>Quick Search</span>
          </CardTitle>
          <CardDescription>
            Search for songs, artists, or albums across music services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Search for music..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="flex-1"
            />
            <Button onClick={() => handleSearch(searchQuery)}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 border-b">
        <Button
          variant={activeTab === 'services' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('services')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <Headphones className="w-4 h-4 mr-2" />
          Music Services
        </Button>
        <Button
          variant={activeTab === 'playlists' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('playlists')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <List className="w-4 h-4 mr-2" />
          Featured Playlists
        </Button>
        <Button
          variant={activeTab === 'recent' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('recent')}
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <Clock className="w-4 h-4 mr-2" />
          Recent Searches
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Connect to Music Services</h2>
            <Badge variant="outline">{musicServices.length} services</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {musicServices.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => handleServiceClick(service)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white`}>
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open {service.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured Playlists</h2>
            <Badge variant="outline">{filteredPlaylists.length} playlists</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlaylists.map((playlist) => (
              <Card 
                key={playlist.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <CardContent className="p-4">
                  <div className="text-4xl mb-3">{playlist.cover}</div>
                  <h3 className="font-medium text-lg mb-1">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{playlist.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{playlist.songCount} songs</Badge>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Listen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Searches</h2>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleRecentSearch(search)}
              >
                <div className="flex items-center space-x-3">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{search}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => window.open('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', '_blank')}
            >
              <Play className="w-6 h-6" />
              <span>Top Hits</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => window.open('https://music.youtube.com/playlist?list=PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI', '_blank')}
            >
              <Radio className="w-6 h-6" />
              <span>Discover</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => window.open('https://open.spotify.com/genre/0JQ5DAqbMKFSCjnQr8QZef', '_blank')}
            >
              <Disc3 className="w-6 h-6" />
              <span>Genres</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Music;
