import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  Wifi,
  WifiOff,
  HardDrive,
  Network,
  Smartphone,
  Monitor,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: 'malware' | 'phishing' | 'intrusion' | 'suspicious';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  status: 'detected' | 'quarantined' | 'resolved' | 'investigating';
  source: string;
}

interface SecurityDevice {
  id: string;
  name: string;
  type: 'computer' | 'phone' | 'tablet' | 'router';
  status: 'secure' | 'warning' | 'at-risk' | 'compromised';
  lastScan: Date;
  threats: number;
  antivirus: boolean;
  firewall: boolean;
  encryption: boolean;
}

const Security: React.FC = () => {
  const [overallSecurity, setOverallSecurity] = useState(87);
  const [isRealTimeProtection, setIsRealTimeProtection] = useState(true);
  const [isFirewallEnabled, setIsFirewallEnabled] = useState(true);
  const [isNetworkEncryption, setIsNetworkEncryption] = useState(true);
  const [isAutoUpdate, setIsAutoUpdate] = useState(true);

  const [threats] = useState<SecurityThreat[]>([
    {
      id: '1',
      type: 'malware',
      severity: 'high',
      description: 'Suspicious executable file detected in downloads folder',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'quarantined',
      source: 'Downloads/unknown_file.exe'
    },
    {
      id: '2',
      type: 'phishing',
      severity: 'medium',
      description: 'Suspicious email link blocked',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      status: 'resolved',
      source: 'Email: support@fakebank.com'
    },
    {
      id: '3',
      type: 'intrusion',
      severity: 'low',
      description: 'Multiple failed login attempts detected',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      status: 'investigating',
      source: 'IP: 192.168.1.100'
    }
  ]);

  const [devices] = useState<SecurityDevice[]>([
    {
      id: '1',
      name: 'Main Computer',
      type: 'computer',
      status: 'secure',
      lastScan: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      threats: 0,
      antivirus: true,
      firewall: true,
      encryption: true
    },
    {
      id: '2',
      name: 'iPhone 15',
      type: 'phone',
      status: 'secure',
      lastScan: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      threats: 0,
      antivirus: true,
      firewall: true,
      encryption: true
    },
    {
      id: '3',
      name: 'Home Router',
      type: 'router',
      status: 'warning',
      lastScan: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      threats: 2,
      antivirus: false,
      firewall: true,
      encryption: true
    }
  ]);

  const [recentActivity] = useState([
    {
      action: 'Threat quarantined',
      description: 'Malware file isolated and removed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'success'
    },
    {
      action: 'Firewall rule updated',
      description: 'New security rule applied for network traffic',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'info'
    },
    {
      action: 'System scan completed',
      description: 'Full system scan finished - no threats found',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'success'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'default';
      case 'warning': return 'warning';
      case 'at-risk': return 'destructive';
      case 'compromised': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <ShieldCheck className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'at-risk': return <ShieldX className="w-5 h-5 text-red-600" />;
      case 'compromised': return <ShieldX className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'info': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const runQuickScan = () => {
    // Simulate quick scan
    console.log('Running quick security scan...');
  };

  const runFullScan = () => {
    // Simulate full scan
    console.log('Running full security scan...');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold">Security</h1>
      </div>

      {/* Overall Security Score */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span>Overall Security Status</span>
          </CardTitle>
          <CardDescription>Your system security overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{overallSecurity}%</div>
                <div className="text-sm text-muted-foreground">Secure</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Security Score</div>
                <Progress value={overallSecurity} className="w-32" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={runQuickScan} variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Quick Scan
              </Button>
              <Button onClick={runFullScan}>
                <Shield className="w-4 h-4 mr-2" />
                Full Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Protection Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Real-time Protection</div>
                <div className="text-sm text-muted-foreground">Monitor system for threats</div>
              </div>
              <Switch
                checked={isRealTimeProtection}
                onCheckedChange={setIsRealTimeProtection}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Firewall</div>
                <div className="text-sm text-muted-foreground">Block unauthorized access</div>
              </div>
              <Switch
                checked={isFirewallEnabled}
                onCheckedChange={setIsFirewallEnabled}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Network Encryption</div>
                <div className="text-sm text-muted-foreground">Secure network traffic</div>
              </div>
              <Switch
                checked={isNetworkEncryption}
                onCheckedChange={setIsNetworkEncryption}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Auto Updates</div>
                <div className="text-sm text-muted-foreground">Keep security patches current</div>
              </div>
              <Switch
                checked={isAutoUpdate}
                onCheckedChange={setIsAutoUpdate}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Recent Threats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {threats.length === 0 ? (
                <div className="text-center py-4">
                  <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No threats detected</p>
                </div>
              ) : (
                threats.map((threat) => (
                  <div key={threat.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge variant="outline">{threat.type}</Badge>
                        </div>
                        <p className="font-medium mt-1">{threat.description}</p>
                        <p className="text-sm text-muted-foreground">{threat.source}</p>
                      </div>
                      <Badge variant="secondary">{threat.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(threat.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" />
            <span>Protected Devices</span>
          </CardTitle>
          <CardDescription>Security status of all connected devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div key={device.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(device.status)}
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">{device.type}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(device.status)}>
                    {device.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Last Scan:</span>
                    <span>{formatTimeAgo(device.lastScan)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Threats:</span>
                    <span className={device.threats > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {device.threats}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Antivirus: {device.antivirus ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Firewall: {device.firewall ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>Encryption: {device.encryption ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Security Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                {getActivityIcon(activity.status)}
                <div className="flex-1">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.description}</div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Security Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Update Router Firmware</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Your home router has outdated firmware. Update to the latest version to patch security vulnerabilities.
                </p>
                <Button size="sm" className="mt-2" variant="outline">
                  Update Now
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Add an extra layer of security to your accounts by enabling two-factor authentication.
                </p>
                <Button size="sm" className="mt-2" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Regular Backups</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your system is configured for regular backups. This helps protect against ransomware attacks.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
