
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Shield, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
    
    // محاكاة إرسال الرسالة
    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem('anonymousMessages') || '[]');
      const newMessage = {
        id: Date.now(),
        content: message,
        timestamp: new Date().toISOString(),
        isRead: false,
        reply: null
      };
      messages.push(newMessage);
      localStorage.setItem('anonymousMessages', JSON.stringify(messages));
      
      setMessage('');
      setIsLoading(false);
      toast({
        title: "تم الإرسال!",
        description: "تم إرسال رسالتك بنجاح ✨"
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">رسائل مجهولة</h1>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center glass-effect">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              شارك أفكارك بحرية
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              أرسل رسالة مجهولة بكل أمان وثقة. رأيك يهمني!
            </p>
          </div>

          {/* Message Form */}
          <Card className="glass-effect border-white/20 fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                اكتب رسالتك
              </CardTitle>
              <CardDescription className="text-lg">
                رسالتك ستبقى مجهولة تماماً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  placeholder="اكتب رسالتك هنا... يمكنك التعبير عن رأيك، طرح سؤال، أو مشاركة أي شيء تريده"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] text-lg resize-none border-white/20 bg-white/50 focus:bg-white/70 transition-all duration-300"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {message.length}/500 حرف
                  </span>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !message.trim()}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
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
              <Card key={index} className="glass-effect border-white/20 text-center">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
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
