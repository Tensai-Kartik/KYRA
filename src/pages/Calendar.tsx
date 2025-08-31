import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users, Bell, Edit, Trash2 } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, isToday, isSameDay, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number;
  location?: string;
  attendees?: string[];
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'meeting' | 'reminder';
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'shopping' | 'health';
}

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync meeting',
      date: new Date(),
      time: '10:00',
      duration: 60,
      location: 'Conference Room A',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      priority: 'high',
      category: 'meeting'
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      date: addDays(new Date(), 2),
      time: '14:30',
      duration: 30,
      priority: 'medium',
      category: 'personal'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Prepare presentation',
      description: 'Create slides for client meeting',
      dueDate: addDays(new Date(), 1),
      completed: false,
      priority: 'high',
      category: 'work'
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk, bread, eggs, vegetables',
      dueDate: new Date(),
      completed: false,
      priority: 'medium',
      category: 'shopping'
    }
  ]);

  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '09:00',
    duration: 60,
    location: '',
    attendees: '',
    priority: 'medium' as const,
    category: 'work' as const
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium' as const,
    category: 'work' as const
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const handleAddEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      attendees: newEvent.attendees ? newEvent.attendees.split(',').map(a => a.trim()) : []
    };
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      time: '09:00',
      duration: 60,
      location: '',
      attendees: '',
      priority: 'medium',
      category: 'work'
    });
    setIsEventDialogOpen(false);
  };

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      category: 'work'
    });
    setIsTaskDialogOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      location: event.location || '',
      attendees: event.attendees?.join(', ') || '',
      priority: event.priority,
      category: event.category
    });
    setIsEventDialogOpen(true);
  };

  const handleUpdateEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.map(event =>
        event.id === editingEvent.id
          ? {
              ...editingEvent,
              ...newEvent,
              attendees: newEvent.attendees ? newEvent.attendees.split(',').map(a => a.trim()) : []
            }
          : event
      );
      setEvents(updatedEvents);
      setEditingEvent(null);
      setIsEventDialogOpen(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'default';
      case 'personal': return 'secondary';
      case 'meeting': return 'outline';
      case 'reminder': return 'destructive';
      case 'shopping': return 'secondary';
      case 'health': return 'outline';
      default: return 'default';
    }
  };

  const calendarDays = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Calendar</h1>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingEvent(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                <DialogDescription>
                  {editingEvent ? 'Make changes to your event here.' : 'Create a new event for your calendar.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    placeholder="Event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Textarea
                    placeholder="Event description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={format(newEvent.date, 'yyyy-MM-dd')}
                    onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                  />
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                  />
                  <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent({ ...newEvent, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Input
                    placeholder="Location (optional)"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    placeholder="Attendees (comma-separated)"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                  />
                </div>
                <Select value={newEvent.category} onValueChange={(value: any) => setNewEvent({ ...newEvent, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a new task for your to-do list.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Textarea
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={format(newTask.dueDate, 'yyyy-MM-dd')}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                  />
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Select value={newTask.category} onValueChange={(value: any) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>{format(selectedDate, 'MMMM yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiers={{
                  today: isToday,
                  selected: selectedDate
                }}
                modifiersStyles={{
                  today: { backgroundColor: '#3b82f6', color: 'white' },
                  selected: { backgroundColor: '#1e40af', color: 'white' }
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Events and Tasks for Selected Date */}
        <div className="space-y-6">
          {/* Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Events - {format(selectedDate, 'MMM dd')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No events scheduled</p>
                ) : (
                  getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{event.time} ({event.duration}min)</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Badge variant={getPriorityColor(event.priority)} className="text-xs">
                            {event.priority}
                          </Badge>
                          <Badge variant={getCategoryColor(event.category)} className="text-xs">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Tasks - {format(selectedDate, 'MMM dd')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTasksForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No tasks due</p>
                ) : (
                  getTasksForDate(selectedDate).map((task) => (
                    <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h4>
                        <p className={`text-sm ${task.completed ? 'text-muted-foreground' : ''}`}>
                          {task.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                            {task.priority}
                          </Badge>
                          <Badge variant={getCategoryColor(task.category)} className="text-xs">
                            {task.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
