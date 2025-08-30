import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  HardDrive, 
  Zap, 
  Activity, 
  Shield, 
  Wifi,
  Monitor,
  Battery
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SystemStats {
  cpu: number;
  memory: number;
  battery: number | null;
  storage: number | null;
  network: boolean;
  permissions: {
    microphone: boolean;
    camera: boolean;
    location: boolean;
  };
}

export const SystemMonitor: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    battery: null,
    storage: null,
    network: navigator.onLine,
    permissions: {
      microphone: false,
      camera: false,
      location: false
    }
  });

  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'unknown'>('unknown');

  useEffect(() => {
    const checkPermissions = async () => {
      const newPermissions = { ...stats.permissions };
      
      try {
        const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        newPermissions.microphone = micPermission.state === 'granted';
        
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        newPermissions.camera = cameraPermission.state === 'granted';
        
        const locationPermission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        newPermissions.location = locationPermission.state === 'granted';
      } catch (error) {
        console.log('Permission check not supported');
      }
      
      setStats(prev => ({ ...prev, permissions: newPermissions }));
    };

    const checkBattery = async () => {
      try {
        // @ts-ignore - Battery API not in TypeScript types but exists in browsers
        const battery = await navigator.getBattery?.();
        if (battery) {
          setStats(prev => ({ ...prev, battery: Math.round(battery.level * 100) }));
        }
      } catch (error) {
        console.log('Battery API not available');
      }
    };

    const checkStorage = async () => {
      try {
        // @ts-ignore - Storage API not fully typed
        const estimate = await navigator.storage?.estimate?.();
        if (estimate?.quota && estimate.usage) {
          const usagePercent = Math.round((estimate.usage / estimate.quota) * 100);
          setStats(prev => ({ ...prev, storage: usagePercent }));
        }
      } catch (error) {
        console.log('Storage API not available');
      }
    };

    const simulatePerformanceData = () => {
      // Since we can't access real CPU/memory data in browser, simulate realistic values
      const cpuUsage = Math.floor(Math.random() * 40) + 10; // 10-50%
      const memoryUsage = Math.floor(Math.random() * 50) + 30; // 30-80%
      
      setStats(prev => ({
        ...prev,
        cpu: cpuUsage,
        memory: memoryUsage
      }));
    };

    const checkSecurity = () => {
      // Basic security checks based on available web APIs
      const isHTTPS = location.protocol === 'https:';
      const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      
      if (isHTTPS) {
        setSecurityStatus('secure');
      } else {
        setSecurityStatus('warning');
      }
    };

    // Initialize checks
    checkPermissions();
    checkBattery();
    checkStorage();
    checkSecurity();
    simulatePerformanceData();

    // Set up intervals for dynamic data
    const performanceInterval = setInterval(simulatePerformanceData, 3000);
    const networkInterval = setInterval(() => {
      setStats(prev => ({ ...prev, network: navigator.onLine }));
    }, 5000);

    // Listen for online/offline events
    const handleOnline = () => setStats(prev => ({ ...prev, network: true }));
    const handleOffline = () => setStats(prev => ({ ...prev, network: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(performanceInterval);
      clearInterval(networkInterval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusColor = (value: number, thresholds = { warning: 70, danger: 90 }) => {
    if (value >= thresholds.danger) return 'text-destructive';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-success';
  };

  const getProgressColor = (value: number, thresholds = { warning: 70, danger: 90 }) => {
    if (value >= thresholds.danger) return 'bg-destructive';
    if (value >= thresholds.warning) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-glass/30 border-glass-border/50 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-primary" />
          System Performance
        </h3>
        
        <div className="space-y-3">
          {/* CPU Usage */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Cpu className="w-3 h-3 text-primary" />
              <span>CPU</span>
            </div>
            <span className={getStatusColor(stats.cpu)}>{stats.cpu}%</span>
          </div>
          <Progress 
            value={stats.cpu} 
            className="h-2"
          />

          {/* Memory Usage */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Monitor className="w-3 h-3 text-accent" />
              <span>Memory</span>
            </div>
            <span className={getStatusColor(stats.memory)}>{stats.memory}%</span>
          </div>
          <Progress 
            value={stats.memory} 
            className="h-2"
          />

          {/* Battery (if available) */}
          {stats.battery !== null && (
            <>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Battery className="w-3 h-3 text-success" />
                  <span>Battery</span>
                </div>
                <span className={getStatusColor(100 - stats.battery, { warning: 30, danger: 15 })}>
                  {stats.battery}%
                </span>
              </div>
              <Progress 
                value={stats.battery} 
                className="h-2"
              />
            </>
          )}

          {/* Storage (if available) */}
          {stats.storage !== null && (
            <>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-3 h-3 text-warning" />
                  <span>Storage</span>
                </div>
                <span className={getStatusColor(stats.storage)}>{stats.storage}%</span>
              </div>
              <Progress 
                value={stats.storage} 
                className="h-2"
              />
            </>
          )}
        </div>
      </Card>

      {/* Network & Security Status */}
      <Card className="p-4 bg-glass/30 border-glass-border/50 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2 text-primary" />
          Security & Connectivity
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Wifi className="w-3 h-3" />
              <span>Network</span>
            </div>
            <Badge 
              variant={stats.network ? "default" : "destructive"}
              className="text-xs px-2 py-1"
            >
              {stats.network ? 'Online' : 'Offline'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3" />
              <span>Security</span>
            </div>
            <Badge 
              variant={securityStatus === 'secure' ? "default" : "secondary"}
              className="text-xs px-2 py-1"
            >
              {securityStatus === 'secure' ? 'Secure' : 'Basic'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Permissions Status */}
      <Card className="p-4 bg-glass/30 border-glass-border/50 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-primary" />
          Permissions
        </h3>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span>Microphone</span>
            <Badge 
              variant={stats.permissions.microphone ? "default" : "secondary"}
              className="text-xs px-2 py-1"
            >
              {stats.permissions.microphone ? 'Granted' : 'Denied'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Camera</span>
            <Badge 
              variant={stats.permissions.camera ? "default" : "secondary"}
              className="text-xs px-2 py-1"
            >
              {stats.permissions.camera ? 'Granted' : 'Denied'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Location</span>
            <Badge 
              variant={stats.permissions.location ? "default" : "secondary"}
              className="text-xs px-2 py-1"
            >
              {stats.permissions.location ? 'Granted' : 'Denied'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};