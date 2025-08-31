import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar, 
  Repeat, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  SortAsc,
  SortDesc,
  Archive,
  Pin,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Zap,
  Circle
} from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  isCompleted: boolean;
  isPinned: boolean;
  isArchived: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'work' | 'personal' | 'health' | 'shopping' | 'bills' | 'appointments';
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
    early: number; // minutes before
  };
  createdAt: Date;
}

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync meeting with the development team',
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      time: '10:00',
      isCompleted: false,
      isPinned: true,
      isArchived: false,
      priority: 'high',
      category: 'work',
      repeat: 'weekly',
      notifications: {
        email: true,
        push: true,
        sound: true,
        early: 15
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Dentist Appointment',
      description: 'Annual dental checkup and cleaning',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      time: '14:30',
      isCompleted: false,
      isPinned: false,
      isArchived: false,
      priority: 'medium',
      category: 'health',
      repeat: 'yearly',
      notifications: {
        email: true,
        push: true,
        sound: false,
        early: 60
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Pay Electricity Bill',
      description: 'Monthly electricity bill payment due',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: '09:00',
      isCompleted: false,
      isPinned: false,
      isArchived: false,
      priority: 'urgent',
      category: 'bills',
      repeat: 'monthly',
      notifications: {
        email: true,
        push: true,
        sound: true,
        early: 1440 // 24 hours
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      title: 'Buy Groceries',
      description: 'Weekly grocery shopping for the family',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      time: '16:00',
      isCompleted: false,
      isPinned: false,
      isArchived: false,
      priority: 'medium',
      category: 'shopping',
      repeat: 'weekly',
      notifications: {
        email: false,
        push: true,
        sound: false,
        early: 30
      },
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'medium' as const,
    category: 'personal' as const,
    repeat: 'none' as const,
    notifications: {
      email: true,
      push: true,
      sound: true,
      early: 15
    }
  });

  const categories = [
    { value: 'all', label: 'All Categories', icon: '📁' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'personal', label: 'Personal', icon: '👤' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'shopping', label: 'Shopping', icon: '🛒' },
    { value: 'bills', label: 'Bills', icon: '💰' },
    { value: 'appointments', label: 'Appointments', icon: '📅' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities', color: 'default' },
    { value: 'urgent', label: 'Urgent', color: 'destructive' },
    { value: 'high', label: 'High', color: 'destructive' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'low', label: 'Low', color: 'default' }
  ];

  const repeatOptions = [
    { value: 'none', label: 'No Repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const filteredReminders = reminders
    .filter(reminder => 
      (selectedCategory === 'all' || reminder.category === selectedCategory) &&
      (selectedPriority === 'all' || reminder.priority === selectedPriority) &&
      (showCompleted || !reminder.isCompleted) &&
      !reminder.isArchived &&
      (reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       reminder.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const upcomingReminders = filteredReminders
    .filter(reminder => !reminder.isCompleted && reminder.date > new Date())
    .slice(0, 5);

  const overdueReminders = filteredReminders
    .filter(reminder => !reminder.isCompleted && reminder.date < new Date())
    .slice(0, 3);

  const handleAddReminder = () => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      date: new Date(newReminder.date + 'T' + newReminder.time),
      time: newReminder.time,
      isCompleted: false,
      isPinned: false,
      isArchived: false,
      priority: newReminder.priority,
      category: newReminder.category,
      repeat: newReminder.repeat,
      notifications: newReminder.notifications,
      createdAt: new Date()
    };
    setReminders([reminder, ...reminders]);
    setNewReminder({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      priority: 'medium',
      category: 'personal',
      repeat: 'none',
      notifications: {
        email: true,
        push: true,
        sound: true,
        early: 15
      }
    });
    setIsReminderDialogOpen(false);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setNewReminder({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date.toISOString().split('T')[0],
      time: reminder.time,
      priority: reminder.priority,
      category: reminder.category,
      repeat: reminder.repeat,
      notifications: reminder.notifications
    });
    setIsReminderDialogOpen(true);
  };

  const handleUpdateReminder = () => {
    if (editingReminder) {
      const updatedReminders = reminders.map(reminder =>
        reminder.id === editingReminder.id
          ? {
              ...reminder,
              title: newReminder.title,
              description: newReminder.description,
              date: new Date(newReminder.date + 'T' + newReminder.time),
              time: newReminder.time,
              priority: newReminder.priority,
              category: newReminder.category,
              repeat: newReminder.repeat,
              notifications: newReminder.notifications
            }
          : reminder
      );
      setReminders(updatedReminders);
      setEditingReminder(null);
      setIsReminderDialogOpen(false);
    }
  };

  const handleToggleComplete = (reminderId: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, isCompleted: !reminder.isCompleted } : reminder
    ));
  };

  const handleDeleteReminder = (reminderId: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  const handlePinReminder = (reminderId: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, isPinned: !reminder.isPinned } : reminder
    ));
  };

  const handleArchiveReminder = (reminderId: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, isArchived: true } : reminder
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '📁';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 0) return `In ${diffInDays} days`;
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const isOverdue = (date: Date) => {
    return date < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Bell className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold">Reminders</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{overdueReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{reminders.filter(r => r.isCompleted).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Pin className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pinned</p>
                <p className="text-2xl font-bold">{reminders.filter(r => r.isPinned).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Reminders Alert */}
      {overdueReminders.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Overdue Reminders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-red-100 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">{reminder.title}</p>
                      <p className="text-sm text-red-700">{reminder.description}</p>
                      <p className="text-xs text-red-600">Was due: {formatDate(reminder.date)} at {reminder.time}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleToggleComplete(reminder.id)}>
                      Mark Complete
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditReminder(reminder)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <Badge variant={priority.color as any} className="mr-2">
                    {priority.label}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
          />
          <span className="text-sm">Show completed</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingReminder(null)}>
              <Plus className="w-4 h-4 mr-2" />
              New Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingReminder ? 'Edit Reminder' : 'Create New Reminder'}</DialogTitle>
              <DialogDescription>
                {editingReminder ? 'Make changes to your reminder here.' : 'Create a new reminder to stay on top of your tasks.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  placeholder="Reminder title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Textarea
                  placeholder="Reminder description"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                />
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select value={newReminder.priority} onValueChange={(value: any) => setNewReminder({ ...newReminder, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={newReminder.category} onValueChange={(value) => setNewReminder({ ...newReminder, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <span className="mr-2">{category.icon}</span>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Select value={newReminder.repeat} onValueChange={(value: any) => setNewReminder({ ...newReminder, repeat: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Repeat" />
                  </SelectTrigger>
                  <SelectContent>
                    {repeatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Notification Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newReminder.notifications.email}
                      onCheckedChange={(checked) => setNewReminder({
                        ...newReminder,
                        notifications: { ...newReminder.notifications, email: checked }
                      })}
                    />
                    <span className="text-sm">Email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newReminder.notifications.push}
                      onCheckedChange={(checked) => setNewReminder({
                        ...newReminder,
                        notifications: { ...newReminder.notifications, push: checked }
                      })}
                    />
                    <span className="text-sm">Push</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newReminder.notifications.sound}
                      onCheckedChange={(checked) => setNewReminder({
                        ...newReminder,
                        notifications: { ...newReminder.notifications, sound: checked }
                      })}
                    />
                    <span className="text-sm">Sound</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={newReminder.notifications.early.toString()}
                      onValueChange={(value) => setNewReminder({
                        ...newReminder,
                        notifications: { ...newReminder.notifications, early: parseInt(value) }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No early</SelectItem>
                        <SelectItem value="5">5 min early</SelectItem>
                        <SelectItem value="15">15 min early</SelectItem>
                        <SelectItem value="30">30 min early</SelectItem>
                        <SelectItem value="60">1 hour early</SelectItem>
                        <SelectItem value="1440">1 day early</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={editingReminder ? handleUpdateReminder : handleAddReminder}>
                {editingReminder ? 'Update Reminder' : 'Create Reminder'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Reminders</span>
          <Badge variant="outline">{filteredReminders.length}</Badge>
        </h2>
        
        <div className="space-y-3">
          {filteredReminders.map((reminder) => (
            <Card key={reminder.id} className={`${isOverdue(reminder.date) ? 'border-red-200 bg-red-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleComplete(reminder.id)}
                      className="mt-0.5"
                    >
                      {reminder.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-medium ${reminder.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {reminder.title}
                        </h4>
                        {reminder.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                        <Badge variant={getPriorityColor(reminder.priority)}>
                          {reminder.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{getCategoryIcon(reminder.category)}</span>
                      </div>
                      
                      <p className={`text-sm text-muted-foreground mt-1 ${reminder.isCompleted ? 'line-through' : ''}`}>
                        {reminder.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(reminder.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{reminder.time}</span>
                        </div>
                        {reminder.repeat !== 'none' && (
                          <div className="flex items-center space-x-1">
                            <Repeat className="w-3 h-3" />
                            <span className="capitalize">{reminder.repeat}</span>
                          </div>
                        )}
                        {reminder.notifications.early > 0 && (
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>{reminder.notifications.early} min early</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePinReminder(reminder.id)}
                    >
                      <Pin className={`w-4 h-4 ${reminder.isPinned ? 'text-yellow-600' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditReminder(reminder)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchiveReminder(reminder.id)}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
