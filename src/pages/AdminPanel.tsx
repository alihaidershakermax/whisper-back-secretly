
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Trash2, Edit, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  reply: string | null;
}

const AdminPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem('anonymousMessages') || '[]');
    setMessages(storedMessages.sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  };

  const markAsRead = (messageId: number) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('anonymousMessages', JSON.stringify(updatedMessages));
  };

  const deleteMessage = (messageId: number) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem('anonymousMessages', JSON.stringify(updatedMessages));
    toast({
      title: "تم الحذف",
      description: "تم حذف الرسالة بنجاح"
    });
  };

  const handleReply = () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    const updatedMessages = messages.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, reply: replyText, isRead: true }
        : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('anonymousMessages', JSON.stringify(updatedMessages));
    
    toast({
      title: "تم الرد",
      description: "تم حفظ ردك بنجاح"
    });
    
    setReplyText('');
    setIsReplyDialogOpen(false);
    setSelectedMessage(null);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-gray-600">إدارة الرسائل المجهولة</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                العودة للموقع
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                  <p className="text-gray-600">إجمالي الرسائل</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                  <p className="text-gray-600">رسائل جديدة</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{messages.filter(m => m.reply).length}</p>
                  <p className="text-gray-600">تم الرد عليها</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>الرسائل الواردة</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="px-3 py-1">
                  {unreadCount} جديدة
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              جميع الرسائل المجهولة التي وصلت إليك
            </CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد رسائل بعد</h3>
                <p className="text-gray-600">ستظهر الرسائل المجهولة هنا عند وصولها</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                    }`}
                    onClick={() => !message.isRead && markAsRead(message.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {!message.isRead && (
                          <Badge variant="destructive" className="text-xs">جديدة</Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={isReplyDialogOpen && selectedMessage?.id === message.id} onOpenChange={setIsReplyDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              رد
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>الرد على الرسالة</DialogTitle>
                              <DialogDescription>
                                اكتب ردك على هذه الرسالة المجهولة
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{selectedMessage?.content}</p>
                              </div>
                              <Textarea
                                placeholder="اكتب ردك هنا..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[100px]"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                                  إلغاء
                                </Button>
                                <Button onClick={handleReply} disabled={!replyText.trim()}>
                                  حفظ الرد
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          حذف
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-900 leading-relaxed mb-3">
                      {message.content}
                    </p>
                    
                    {message.reply && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 mb-1">ردك:</p>
                        <p className="text-green-700">{message.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;
