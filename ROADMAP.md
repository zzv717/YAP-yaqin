# Ko‘rchi — loyiha xaritasi va taqdimot uchun texnik eslatma

## 0. Stage 1 demo/foundation holati
Kod paketida brend Ko‘rchi, to‘rtta ochiqchasiga `[DEMO]` deb belgilangan namuna-do‘kon, 12 demo taklif, mahsulot rasmlari, yaroqli sana, Neon uchun demo migratsiyasi va bu fayldagi texnik izohlar mavjud. Haqiqiy bizneslar, manzillar, telefonlar va traction emas. ZIP’ni repo root’ga qo‘yib push/redeploy qilish va `db-migration-demo.sql`ni Neon’da bir marta bajarish kerak; shundan keyingina demo saytda ko‘rinadi.

## 1. Hozirgi mahsulot nima?
Ko‘rchi — chegirmali oziq-ovqat takliflarini topish va oldindan band qilish uchun MVP. Demo oqimi: xaridor takliflarni ko‘radi → band qiladi → Neon’da buyurtma yoziladi va qoldiq kamayadi. Hamkor administrator panelidan taklif qo‘shadi, rasm yuklaydi va buyurtma holatini boshqaradi.

## 2. Hozirgi texnik tarkib
- **Frontend:** Next.js App Router, React, TypeScript va CSS (`app/page.tsx`, `app/globals.css`).
- **API:** Next.js Route Handlers (`app/api/**/route.ts`).
- **Ma’lumotlar bazasi:** Neon PostgreSQL. `products` — takliflar; `orders` — bandlar.
- **Rasm saqlash:** Vercel Blob. Bazada rasmning URL’i saqlanadi, faylning o‘zi Blob’da.
- **Admin autentifikatsiyasi:** hozircha bitta umumiy `MERCHANT_PANEL_PASSWORD`; bu alohida do‘kon hisoblari degani emas.
- **Deploy:** Vercel; server sirlarini GitHub’ga emas, Vercel Environment Variables’ga kiritish kerak.

### Asosiy API’lar
- `GET /api/products` — faol takliflar.
- `POST /api/products` — login bo‘lgan admin yangi taklif qo‘shadi.
- `POST /api/orders` — mahsulotni band qiladi; Neon’da zaxirani kamaytirib, buyurtma yaratadi.
- `GET/PATCH /api/merchant/orders` — admin buyurtmalarni ko‘radi va holatini yangilaydi.
- `POST /api/merchant/upload` — admin rasmni Blob’ga yuklaydi.
- `POST/GET/DELETE /api/merchant/session` — panelga kirish, tekshirish va chiqish.
- `GET /api/impact` — bekor qilinmagan bandlar soni. Bu ko‘rsatkich real bandlar soni, tasdiqlangan chiqindi kamayishi yoki CO₂ hisobi emas.

## 3. Hozir ishlamaydigan yoki hali yo‘q narsalar
Alohida do‘kon loginlari/ro‘yxatdan o‘tishi; yaroqlilik muddati va avtomatik markdown; mahsulot tafsiloti/do‘kon sahifasi; savat; Telegram/SMS; onlayn to‘lov; QR bilan olib ketishni tasdiqlash; yetkazish; xarita va geolokatsiya; sharhlar; ishonchli food-safety tekshiruvi; haqiqiy Eco-score; AI tavsiya. Bularni demo’da bor deb aytmaslik kerak.

## 4. Bosqichlar
### A. Tanlovgacha bo‘lgan MVP
- Ko‘rchi nomi, o‘qilishi oson dizayn va mobil tekshiruv.
- 10–15 ta **demo ekanligi aniq yozilgan** mahsulot; ruxsat bilan olingan rasmlar.
- Demo buyurtma, paneldan yangi taklif, rasm yuklash, miqdor birligi, buyurtmani tasdiqlash.
- Xato holatlari, bazaning ishlashi, redeploy tekshiruvi.
- Taqdimotda bozor/traction raqamlarini faqat manba yoki real testdan keyin aytish.

### B. Pilot
- 3–5 ta haqiqий hamkor bilan kelishuv.
- Yaroqlilik/sotuv oynasi, olib ketish vaqti va food-safety qoidalarini aniqlash.
- Har bir hamkor uchun alohida kirish va faqat o‘z taklif/buyurtmalarini ko‘rish.
- 5–10 foydalanuvchida test; banddan keyin do‘kon bilan tasdiqlash kanali.
- Asosiy o‘lchovlar: ko‘rilgan taklif → band → olib ketildi; bekor qilish; sotilmay qolgan haqiqiy mahsulot miqdori.

### C. Keyingi versiya
- Mijoz/do‘kon akkauntlari, Telegram bildirishnomalari, QR yoki bir martalik pickup-kod.
- Expiry/time-window asosida tavsiya qilingan chegirma va qolgan mahsulot analitikasi.
- Payme/Click, xarita, review, delivery — faqat pilot va hamkorlar talabi tasdiqlansa.
- AI narx/tavсияни data yig‘ilgандан кейин текшириш; ҳозирча AI деб даъво қилмаслик.

## 5. Raqобat ва лойиҳани тўғри позициялаш
Uzum Market keng assortimentli marketplace bo‘lib, oziq-ovqat ham taklif qiladi. Bundan tashqari, O‘zbekistonda ortiqcha/sotilmay qolgan taomlarni chegirmada taklif qiluvchi o‘xshash yo‘nalishlar ham topiladi: Sawab, Savr va Saqla. Shuning uchun “birinchi” yoki “raqobatchisi yo‘q” demang.

Ko‘rchi uchun tekshiriladigan farqlanish gipotezasi: do‘konlar uchun qoldiqni yuritish + vaqt/yaroqlilik oynasi bo‘yicha narx tavsiyasi + xaridor uchun yaqin, bugun olib ketiladigan takliflar. Bu gipoteza, hozirgi to‘liq funksiya emas; hamkorlar bilan intervyuda tasdiqlash kerak.

Manbalar: https://play.google.com/store/apps/details?id=uz.uzum.app&hl=en_AU ; https://sawab.uz/en ; http://www.savrgo.uz/ ; https://saqla.app/about/

## 6. Qisqa pitch (haqiqatga mos)
“Ko‘rchi mahalliy do‘kon va kafelarga sotilmay qolishi mumkin bo‘lgan oziq-ovqat takliflarini yaqin xaridorlarga chegirma bilan ko‘rsatish va olib ketish uchun band qilishga yordam beradi. Hozir MVP bosqichidamiz: katalog, Neon bazasiga band qilish va hamkor admin paneli bor. Keyingi qadam — bir nechta hamkor bilan pilot qilib, real band va olib ketish ko‘rsatkichlarini tekshirish.”

## 7. Demo ma’lumotlari
Seed mahsulotlar va do‘kon nomlari namuna. Haqiqiy hamkor deb ko‘rsatishdan oldin ularning ruxsati bilan almashtiring. Bajarilgan buyurtma yoki waste/CO₂ raqamlarini o‘lchamasdan uydirmang.
