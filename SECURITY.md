# دليل الأمان - Security Guide

## التحسينات الأمنية المطبقة

### 1. حماية البيانات الحساسة
- تم نقل مفاتيح Supabase إلى متغيرات البيئة
- إنشاء ملف `.env.example` كمرجع للإعدادات
- إضافة ملف `.gitignore` محدث لحماية الملفات الحساسة

### 2. إعدادات الأمان في HTML
- Content Security Policy (CSP) لمنع هجمات XSS
- X-Frame-Options لمنع Clickjacking
- X-Content-Type-Options لمنع MIME sniffing
- X-XSS-Protection للحماية من XSS
- Referrer-Policy للتحكم في معلومات المرجع
- Permissions-Policy لتقييد الصلاحيات

### 3. تكوين Vite الآمن
- تفعيل HTTPS في الإنتاج
- إضافة headers أمنية للخادم
- إزالة source maps في الإنتاج
- إزالة console logs في الإنتاج
- تفعيل minification متقدم

### 4. مكتبة الأمان المخصصة
تم إنشاء `src/lib/security.ts` التي تحتوي على:
- تنظيف المدخلات من XSS
- Rate limiting للحماية من الهجمات
- تشفير وفك تشفير البيانات الحساسة
- توليد tokens آمنة
- التحقق من صحة المدخلات
- hashing للبيانات الحساسة

### 5. إزالة المراجع الخارجية
- إزالة جميع المراجع إلى `https://lovable.dev/`
- تنظيف ملفات README و HTML من الروابط الخارجية

## إرشادات الاستخدام الآمن

### متغيرات البيئة
قم بإنشاء ملف `.env` وأضف المتغيرات التالية:
```
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
VITE_APP_DOMAIN=your_domain.com
```

### استخدام مكتبة الأمان
```typescript
import { SecurityUtils } from '@/lib/security';

// تنظيف المدخلات
const cleanInput = SecurityUtils.sanitizeInput(userInput);

// التحقق من صحة المدخلات
const isValid = SecurityUtils.validateInput(userInput);

// تشفير البيانات الحساسة
const encrypted = await SecurityUtils.encryptData(data, key);

// Rate limiting
const rateLimiter = SecurityUtils.createRateLimiter(10, 60000); // 10 requests per minute
const allowed = rateLimiter(userIP);
```

## التوصيات الإضافية

### 1. HTTPS
- تأكد من استخدام HTTPS في الإنتاج
- استخدم شهادات SSL صالحة
- فعل HSTS (HTTP Strict Transport Security)

### 2. مراقبة الأمان
- راقب محاولات الوصول المشبوهة
- فعل logging للأحداث الأمنية المهمة
- استخدم أدوات مراقبة الأمان

### 3. تحديث التبعيات
- راجع التبعيات بانتظام باستخدام `npm audit`
- حدث المكتبات للإصدارات الآمنة
- استخدم أدوات مثل Dependabot للتحديثات التلقائية

### 4. النسخ الاحتياطية
- قم بعمل نسخ احتياطية منتظمة للبيانات
- اختبر استعادة النسخ الاحتياطية
- احتفظ بالنسخ في مواقع آمنة ومتعددة

### 5. اختبار الأمان
- أجر اختبارات اختراق دورية
- استخدم أدوات فحص الثغرات الأمنية
- راجع الكود بانتظام للثغرات الأمنية

## الثغرات المعروفة والحلول

### esbuild vulnerability
- الثغرة: esbuild يسمح لأي موقع بإرسال طلبات لخادم التطوير
- الحل: هذه الثغرة تؤثر فقط على بيئة التطوير وليس الإنتاج
- التوصية: استخدم firewall لحماية خادم التطوير

## جهات الاتصال للأمان
في حالة اكتشاف ثغرة أمنية، يرجى التواصل مع فريق الأمان فوراً.

---
آخر تحديث: 13 يونيو 2025

