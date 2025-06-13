
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Shield, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">رسائل مجهولة</h1>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 fade-in">
            <div className="inline-block animate-float mb-6">
              <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                <Heart className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              شارك أفكارك بحرية
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              أرسل رسالة مجهولة بكل أمان وثقة. رأيك يهمني!
            </p>
          </div>

          {/* Message Form */}
          <Card className="bg-gray-900 border-gray-800 fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
                <Shield className="h-6 w-6 text-purple-500" />
                اكتب رسالتك
              </CardTitle>
              <CardDescription className="text-lg text-gray-400">
                رسالتك ستبقى مجهولة تماماً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  placeholder="اكتب رسالتك هنا... يمكنك التعبير عن رأيك، طرح سؤال، أو مشاركة أي شيء تريده"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] text-lg resize-none bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 transition-all duration-300"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {message.length}/500 حرف
                  </span>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !message.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        إرسال الرسالة
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 fade-in">
            {[
              { icon: Shield, title: "مجهول 100%", desc: "لا نجمع أي معلومات شخصية" },
              { icon: MessageSquare, title: "رد سريع", desc: "ستحصل على رد في أقرب وقت" },
              { icon: Heart, title: "بيئة آمنة", desc: "مساحة آمنة للتعبير عن الرأي" }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 text-center">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
