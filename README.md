# Premium Görev Yöneticisi - Proje ve Kurulum Notları

Bu proje, modern ve estetik bir "To-Do List" (Yapılacaklar Listesi) uygulamasıdır. HTML, CSS ve JavaScript kullanılarak geliştirilmiştir.

## 🚀 Projeyi Canlıya Alma (Deploy)

Bu projeyi internette yayınlamak için aşağıdaki yöntemleri kullanabilirsiniz. En kolayı **Netlify Drop** yöntemidir.

### Yöntem 1: Netlify Drop (En Kolay)
1. Tarayıcıda [app.netlify.com/drop](https://app.netlify.com/drop) adresine gidin.
2. Bilgisayarınızdaki `premium_todo` klasörünü tutun ve sayfadaki kutucuğa sürükleyip bırakın.
3. Birkaç saniye içinde siteniz yayına girecek ve size bir link verilecektir.

### Yöntem 2: Vercel (Önerilen)
1. [Vercel.com](https://vercel.com) adresinden üye olun.
2. "Add New Project" butonuna tıklayın.
3. GitHub hesabınızı bağlayarak bu repoyu seçin (veya Vercel CLI kullanın).
4. "Deploy" butonuna basın.

### Yöntem 3: GitHub Pages
1. Bu kodu bir GitHub deposuna (repository) yükleyin.
2. Deponuzda **Settings (Ayarlar) > Pages** sekmesine gidin.
3. **Source** kısmından `main` (veya `master`) branch'ini seçip **Save** deyin.
4. Siteniz `kullaniciadi.github.io/repo-adi` adresinde yayında olacaktır.

## 📂 Dosya Yapısı
- `index.html`: Ana sayfa iskeleti.
- `style.css`: Tüm görsel stiller ve animasyonlar.
- `app.js`: Uygulama mantığı (ekleme, silme, istatistikler).

## ✨ Özellikler
- **Premium Tasarım:** Glassmorphism etkileri, animasyonlar.
- **Akıllı Özellikler:** Sıralama, filtreleme, arama.
- **Güvenlik:** Silme işlemi için özel onay penceresi.
- **İstatistikler:** Detaylı durum paneli.
