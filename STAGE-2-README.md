# Ko‘rchi — 2-bosqich

## Nimalar qo‘shildi
- Buyurtma formasida mijoz ismi, telefon va mahsulot miqdori.
- Ombordagi miqdorni tekshiradigan, bitta do‘kon savatini atomar saqlaydigan checkout.
- Har buyurtmaga maxfiy tracking token va mijoz kuzatuv sahifasi.
- Buyurtma tarkibi `order_items` jadvalida saqlanadi.
- Hamkor panelida mijoz/buyurtma miqdori va holatni tasdiqlash, olib ketildi yoki bekor qilish.
- Narx, hudud va yaroqlilik filtrlari; hamkorlar va ishlash tartibi bo‘limlari.
- Ixtiyoriy Telegram xabarnomasi (sozlanmasa buyurtmaga ta’sir qilmaydi).

Demo takliflar va demo hamkor nomlari namuna sifatida belgilangan; ularni haqiqiy hamkorlik yoki natija deb talqin qilmang.

## O‘rnatish
1. Stage 1 dagi sozlangan Neon bazasida `db-migration-customer.sql` faylini bir marta bajaring.
2. Hosting muhitida `DATABASE_URL` ni sozlang. Telegram uchun `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ixtiyoriy.
3. `npm install` va `npm run build` bajaring, so‘ng deploy qiling.

Migration mavjud buyurtmalarga tracking token va `order_items` yozuvlarini qo‘shadi. Ishlab turgan production bazasida avval backup oling.

## Tekshiruv
`npm run build` muvaffaqiyatli yakunlandi (Next.js production build ва TypeScript текшируви). SQL migration real Neon bazasida ishga tushirilmadi; deploydan oldin backup olib migratsiyani bazada sinang.
