import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Activity, Cpu, MemoryStick, HardDrive, Wifi, Monitor, Zap, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  temperature: number;
  uptime: string;
  processes: number;
  threads: number;
}

const System: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    temperature: 45,
    uptime: '0 days, 0 hours',
    processes: 0,
    threads: 0
  });

  const [cpuHistory, setCpuHistory] = useState<Array<{ time: string; value: number }>>([]);
  const [memoryHistory, setMemoryHistory] = useState<Array<{ time: string; value: number }>>([]);

  useEffect(() => {
    // Simulate real-time system monitoring
    const interval = setInterval(() => {
      const newCpu = Math.random() * 100;
      const newMemory = 20 + Math.random() * 60;
      const newDisk = 30 + Math.random() * 40;
      const newNetwork = Math.random() * 100;
      const newTemp = 40 + Math.random() * 20;

      setMetrics(prev => ({
        ...prev,
        cpu: newCpu,
        memory: newMemory,
        disk: newDisk,
        network: newNetwork,
        temperature: newTemp,
        processes: Math.floor(100 + Math.random() * 200),
        threads: Math.floor(500 + Math.random() * 1000)
      }));

      const now = new Date().toLocaleTimeString();
      setCpuHistory(prev => [...prev.slice(-19), { time: now, value: newCpu }]);
      setMemoryHistory(prev => [...prev.slice(-19), { time: now, value: newMemory }]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'destructive';
    if (value >= thresholds.warning) return 'warning';
    return 'default';
  };

  const getStatusText = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'Critical';
    if (value >= thresholds.warning) return 'Warning';
    return 'Normal';
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div className="flex items-center space-x-2">
        <Activity className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold">System Monitor</h1>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Cpu className="w-4 h-4" />
              <span>CPU Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
            <Progress value={metrics.cpu} className="mt-2" />
            <Badge 
              variant={getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}
              className="mt-2"
            >
              {getStatusText(metrics.cpu, { warning: 70, critical: 90 })}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <MemoryStick className="w-4 h-4" />
              <span>Memory Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.toFixed(1)}%</div>
            <Progress value={metrics.memory} className="mt-2" />
            <Badge 
              variant={getStatusColor(metrics.memory, { warning: 80, critical: 95 })}
              className="mt-2"
            >
              {getStatusText(metrics.memory, { warning: 80, critical: 95 })}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <HardDrive className="w-4 h-4" />
              <span>Disk Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk.toFixed(1)}%</div>
            <Progress value={metrics.disk} className="mt-2" />
            <Badge 
              variant={getStatusColor(metrics.disk, { warning: 85, critical: 95 })}
              className="mt-2"
            >
              {getStatusText(metrics.disk, { warning: 85, critical: 95 })}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Thermometer className="w-4 h-4" />
              <span>Temperature</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.temperature.toFixed(1)}°C</div>
            <Progress value={(metrics.temperature / 100) * 100} className="mt-2" />
            <Badge 
              variant={getStatusColor(metrics.temperature, { warning: 70, critical: 85 })}
              className="mt-2"
            >
              {getStatusText(metrics.temperature, { warning: 70, critical: 85 })}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage Over Time</CardTitle>
            <CardDescription>Real-time CPU utilization monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cpuHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage Over Time</CardTitle>
            <CardDescription>Real-time memory utilization monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={memoryHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Operating System</p>
                <p className="font-medium">Windows 11 Pro</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Architecture</p>
                <p className="font-medium">x64</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="font-medium">{metrics.uptime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Processes</p>
                <p className="font-medium">{metrics.processes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="w-5 h-5" />
              <span>Network Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Network Utilization</span>
                <Badge variant="outline">{metrics.network.toFixed(1)}%</Badge>
              </div>
              <Progress value={metrics.network} />
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Download Speed</p>
                  <p className="font-medium">125.5 Mbps</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Upload Speed</p>
                  <p className="font-medium">45.2 Mbps</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Latency</p>
                  <p className="font-medium">12ms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Connection</p>
                  <Badge variant="default" className="text-xs">Connected</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default System;
