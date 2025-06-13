
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  reply: string | null;
  created_at: string;
}

const Index = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repliedMessages, setRepliedMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  // جلب الرسائل التي تم الرد عليها
  useEffect(() => {
    fetchRepliedMessages();
  }, []);

  const fetchRepliedMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .not('reply', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching replied messages:', error);
        return;
      }

      setRepliedMessages(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة رسالة قبل الإرسال",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: message,
            is_read: false,
            reply: null
          }
        ]);

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "خطأ",
          description: "فشل في إرسال الرسالة. حاول مرة أخرى",
          variant: "destructive"
        });
        return;
      }

      setMessage('');
      toast({
        title: "تم الإرسال!",
        description: "تم إرسال رسالتك بنجاح ✨"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إرسال الرسالة",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* رأس الصفحة */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-bold">رسائل مجهولة</h1>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* نموذج إرسال الرسالة */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {message.length}/500
                </span>
                <Button 
                  type="submit" 
                  disabled={isLoading || !message.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      إرسال...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      إرسال
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* عرض الردود */}
        {repliedMessages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-300 border-b border-gray-800 pb-2">
              آخر الردود
            </h2>
            {repliedMessages.map((msg) => (
              <Card key={msg.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="text-gray-400 text-sm border-r-2 border-gray-700 pr-3">
                      {msg.content}
                    </div>
                    <div className="bg-purple-900/30 border border-purple-800/50 rounded-lg p-3">
                      <div className="text-purple-200 font-medium mb-1">رد الإدارة:</div>
                      <div className="text-white">{msg.reply}</div>
                    </div>
                    <div className="text-xs text-gray-500 text-left">
                      {formatDate(msg.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
