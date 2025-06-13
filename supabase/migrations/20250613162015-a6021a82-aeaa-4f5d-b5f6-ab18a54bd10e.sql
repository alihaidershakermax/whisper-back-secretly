
-- إنشاء جدول الرسائل المجهولة
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  reply text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- إنشاء جدول الإعدادات لحفظ كلمة مرور المالك
CREATE TABLE IF NOT EXISTS public.config (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- إدخال كلمة مرور المالك المشفرة (32 حرف: AdminPassword123456789012345678)
INSERT INTO public.config (key, value) 
VALUES ('master_password_hash', encode(digest('AdminPassword123456789012345678', 'sha256'), 'hex'))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- إنشاء دالة للتحقق من كلمة مرور المالك
CREATE OR REPLACE FUNCTION public.validate_master_password(password_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT value INTO stored_hash FROM config WHERE key = 'master_password_hash';
    RETURN stored_hash = encode(digest(password_input, 'sha256'), 'hex');
END;
$$;

-- تعطيل Row Level Security للسماح بالوصول العام للرسائل (موقع رسائل مجهولة)
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.config DISABLE ROW LEVEL SECURITY;
