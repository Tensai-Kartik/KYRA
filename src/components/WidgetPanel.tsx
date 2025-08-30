import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle2, 
  Plus, 
  X, 
  Edit2,
  Save,
  Trash2
} from 'lucide-react';
import { SystemMonitor } from './SystemMonitor';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export const WidgetPanel: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Team meeting',
      time: '14:00',
      completed: false
    },
    {
      id: '2', 
      title: 'Review reports',
      time: '16:30',
      completed: false
    }
  ]);
  
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [newReminder, setNewReminder] = useState({ title: '', time: '' });
  const [editingNote, setEditingNote] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title || 'Untitled',
        content: newNote.content,
        timestamp: new Date()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const addReminder = () => {
    if (newReminder.title.trim() && newReminder.time.trim()) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        title: newReminder.title,
        time: newReminder.time,
        completed: false
      };
      setReminders([...reminders, reminder]);
      setNewReminder({ title: '', time: '' });
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <div className="h-full overflow-y-auto space-y-4 p-4">
      {/* Current Time */}
      <Card className="p-4 bg-glass/30 border-glass-border/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-sm font-semibold text-foreground">Current Time</h3>
          </div>
          <div className="text-2xl font-mono text-primary font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </Card>

      {/* System Monitor */}
      <SystemMonitor />

      {/* Quick Notes */}
      <Card className="p-4 bg-glass/30 border-glass-border/50 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Edit2 className="w-4 h-4 mr-2 text-primary" />
          Quick Notes
        </h3>
        
        {/* Add Note Form */}
        <div className="space-y-2 mb-4">
          <Input
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="bg-background-secondary/50 border-input-border text-sm"
          />
          <Textarea
            placeholder="Note content..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="bg-background-secondary/50 border-input-border text-sm resize-none"
            rows={2}
          />
          <Button 
            onClick={addNote}
            size="sm"
            className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="bg-background-secondary/30 p-2 rounded border border-border/30">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-foreground truncate">
                    {note.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {note.content}
                  </p>
                  <span className="text-xs text-muted-foreground/60">
                    {note.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No notes yet
            </p>
          )}
        </div>
      </Card>

      {/* Reminders */}
      <Card className="p-4 bg-glass/30 border-glass-border/50 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
          Reminders
        </h3>
        
        {/* Add Reminder Form */}
        <div className="space-y-2 mb-4">
          <Input
            placeholder="Reminder title..."
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            className="bg-background-secondary/50 border-input-border text-sm"
          />
          <Input
            type="time"
            value={newReminder.time}
            onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
            className="bg-background-secondary/50 border-input-border text-sm"
          />
          <Button 
            onClick={addReminder}
            size="sm"
            className="w-full bg-accent/20 hover:bg-accent/30 border border-accent/30"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Reminder
          </Button>
        </div>

        {/* Reminders List */}
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center space-x-2 bg-background-secondary/30 p-2 rounded border border-border/30">
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  reminder.completed
                    ? 'bg-success border-success'
                    : 'border-border hover:border-primary'
                }`}
              >
                {reminder.completed && (
                  <CheckCircle2 className="w-3 h-3 text-white" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <span className={`text-xs ${
                  reminder.completed 
                    ? 'text-muted-foreground line-through' 
                    : 'text-foreground'
                }`}>
                  {reminder.title}
                </span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {reminder.time}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteReminder(reminder.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
          {reminders.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No reminders set
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};