
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Trash2, Edit, ArrowRight, Clock, CheckCircle, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLogin from '@/components/AdminLogin';

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  reply: string | null;
}

const AdminPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('adminAuthenticated');
      setIsAuthenticated(auth === 'true');
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
    }
  }, [isAuthenticated]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل الرسائل",
          variant: "destructive"
        });
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الرسائل",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking as read:', error);
        return;
      }

      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
        toast({
          title: "خطأ",
          description: "فشل في حذف الرسالة",
          variant: "destructive"
        });
        return;
      }

      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      toast({
        title: "تم الحذف",
        description: "تم حذف الرسالة بنجاح"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الرسالة",
        variant: "destructive"
      });
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          reply: replyText,
          is_read: true 
        })
        .eq('id', selectedMessage.id);

      if (error) {
        console.error('Error saving reply:', error);
        toast({
          title: "خطأ",
          description: "فشل في حفظ الرد",
          variant: "destructive"
        });
        return;
      }

      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === selectedMessage.id 
            ? { ...msg, reply: replyText, is_read: true }
            : msg
        )
      );
      
      toast({
        title: "تم الرد",
        description: "تم حفظ ردك بنجاح"
      });
      
      setReplyText('');
      setIsReplyDialogOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ الرد",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
                <p className="text-gray-400">إدارة الرسائل المجهولة</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800">
                  <ArrowRight className="h-4 w-4" />
                  العودة للموقع
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="flex items-center gap-2 border-red-700 text-red-400 hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{messages.length}</p>
                  <p className="text-gray-400">إجمالي الرسائل</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-500">{unreadCount}</p>
                  <p className="text-gray-400">رسائل جديدة</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-500">{messages.filter(m => m.reply).length}</p>
                  <p className="text-gray-400">تم الرد عليها</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span>الرسائل الواردة</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="px-3 py-1">
                  {unreadCount} جديدة
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-gray-400">
              جميع الرسائل المجهولة التي وصلت إليك
            </CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">لا توجد رسائل بعد</h3>
                <p className="text-gray-400">ستظهر الرسائل المجهولة هنا عند وصولها</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                      !message.is_read ? 'bg-purple-900/20 border-purple-700' : 'bg-gray-800 border-gray-700'
                    }`}
                    onClick={() => !message.is_read && markAsRead(message.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {!message.is_read && (
                          <Badge variant="destructive" className="text-xs">جديدة</Badge>
                        )}
                        <span className="text-sm text-gray-400">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={isReplyDialogOpen && selectedMessage?.id === message.id} onOpenChange={setIsReplyDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
                              className="flex items-center gap-1 border-gray-700 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="h-3 w-3" />
                              رد
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md bg-gray-900 border-gray-800">
                            <DialogHeader>
                              <DialogTitle className="text-white">الرد على الرسالة</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                اكتب ردك على هذه الرسالة المجهولة
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                                <p className="text-sm text-gray-300">{selectedMessage?.content}</p>
                              </div>
                              <Textarea
                                placeholder="اكتب ردك هنا..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[100px] bg-gray-800 border-gray-700 text-white"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)} className="border-gray-700 text-gray-300">
                                  إلغاء
                                </Button>
                                <Button onClick={handleReply} disabled={!replyText.trim()} className="bg-purple-600 hover:bg-purple-700">
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
                          className="flex items-center gap-1 border-red-700 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3" />
                          حذف
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-gray-200 leading-relaxed mb-3">
                      {message.content}
                    </p>
                    
                    {message.reply && (
                      <div className="mt-3 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                        <p className="text-sm font-semibold text-green-400 mb-1">ردك:</p>
                        <p className="text-green-300">{message.reply}</p>
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
