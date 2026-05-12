"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Lang = "en" | "tr" | "es" | "pl";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
];

// ── Translation keys ──────────────────────────────────────────────────────
const translations = {
  // ── Navigation ──
  "nav.home": { en: "Home", tr: "Ana Sayfa", es: "Inicio", pl: "Strona główna" },
  "nav.tasks": { en: "Tasks", tr: "Görevler", es: "Tareas", pl: "Zadania" },
  "nav.timetable": { en: "Timetable", tr: "Ders Programı", es: "Horario", pl: "Plan zajęć" },
  "nav.explore": { en: "Explore", tr: "Keşfet", es: "Explorar", pl: "Odkrywaj" },

  // ── Greetings ──
  "greeting.night": { en: "Good night", tr: "İyi geceler", es: "Buenas noches", pl: "Dobranoc" },
  "greeting.morning": { en: "Good morning", tr: "Günaydın", es: "Buenos días", pl: "Dzień dobry" },
  "greeting.afternoon": { en: "Good afternoon", tr: "İyi günler", es: "Buenas tardes", pl: "Dzień dobry" },
  "greeting.evening": { en: "Good evening", tr: "İyi akşamlar", es: "Buenas noches", pl: "Dobry wieczór" },

  // ── Dashboard ──
  "dashboard.university": { en: "Gdańsk University of Technology", tr: "Gdańsk Teknoloji Üniversitesi", es: "Universidad Tecnológica de Gdańsk", pl: "Politechnika Gdańska" },
  "dashboard.journey": { en: "Your Gdańsk Journey", tr: "Gdańsk Yolculuğun", es: "Tu Viaje en Gdańsk", pl: "Twoja podróż w Gdańsku" },
  "dashboard.whatsNext": { en: "What's next on your list", tr: "Sıradaki görevlerin", es: "Qué sigue en tu lista", pl: "Co dalej na liście" },
  "dashboard.seeAll": { en: "See all →", tr: "Tümünü gör →", es: "Ver todo →", pl: "Zobacz wszystko →" },
  "dashboard.explore": { en: "Explore Gdańsk", tr: "Gdańsk'ı Keşfet", es: "Explora Gdańsk", pl: "Odkryj Gdańsk" },
  "dashboard.exploreAll": { en: "Explore all →", tr: "Tümünü keşfet →", es: "Explorar todo →", pl: "Odkryj wszystko →" },
  "dashboard.eats": { en: "Student Eats & Shopping", tr: "Öğrenci Yemek & Alışveriş", es: "Comida y Compras", pl: "Jedzenie i Zakupy" },
  "dashboard.jumpTo": { en: "Jump to...", tr: "Hızlı erişim...", es: "Ir a...", pl: "Przejdź do..." },
  "dashboard.didYouKnow": { en: "Did you know?", tr: "Biliyor muydun?", es: "¿Sabías que?", pl: "Czy wiesz?" },
  "dashboard.allSorted": { en: "You're all sorted!", tr: "Her şey tamam!", es: "¡Todo listo!", pl: "Wszystko gotowe!" },
  "dashboard.allSortedSub": { en: "Time to explore Gdańsk and enjoy your Erasmus 🌍", tr: "Gdańsk'ı keşfetme ve Erasmus'un tadını çıkarma zamanı 🌍", es: "Es hora de explorar Gdańsk y disfrutar tu Erasmus 🌍", pl: "Czas odkrywać Gdańsk i cieszyć się Erasmusem 🌍" },
  "dashboard.doFirst": { en: "⚡ Do first", tr: "⚡ Önce yap", es: "⚡ Hazlo primero", pl: "⚡ Zrób najpierw" },
  "dashboard.loading": { en: "Loading…", tr: "Yükleniyor…", es: "Cargando…", pl: "Ładowanie…" },

  // ── Journey stages ──
  "stage.landed": { en: "Just Landed", tr: "Yeni Geldin", es: "Recién Llegado", pl: "Właśnie Wylądowałeś" },
  "stage.landed.msg": { en: "Welcome to Gdańsk! Let's get you settled.", tr: "Gdańsk'a hoş geldin! Yerleşelim.", es: "¡Bienvenido a Gdańsk! Vamos a instalarte.", pl: "Witaj w Gdańsku! Zacznijmy się urządzać." },
  "stage.started": { en: "Getting Started", tr: "Başlıyoruz", es: "Empezando", pl: "Zaczynamy" },
  "stage.started.msg": { en: "You're figuring things out — nice!", tr: "İşleri çözüyorsun — harika!", es: "Estás averiguando las cosas — ¡genial!", pl: "Ogarniasz sprawy — super!" },
  "stage.settling": { en: "Settling In", tr: "Yerleşiyorsun", es: "Acomodándose", pl: "Osiedlanie się" },
  "stage.settling.msg": { en: "Bureaucracy? Done. Now the fun begins!", tr: "Bürokratik işler? Tamam. Şimdi eğlence başlıyor!", es: "¿Burocracia? Hecho. ¡Ahora empieza la diversión!", pl: "Biurokracja? Gotowe. Teraz zaczyna się zabawa!" },
  "stage.student": { en: "Student Life", tr: "Öğrenci Hayatı", es: "Vida Estudiantil", pl: "Życie Studenckie" },
  "stage.student.msg": { en: "You're officially a PG student!", tr: "Artık resmi bir PG öğrencisisin!", es: "¡Eres oficialmente un estudiante de PG!", pl: "Jesteś oficjalnie studentem PG!" },
  "stage.explorer": { en: "Gdańsk Explorer", tr: "Gdańsk Kaşifi", es: "Explorador de Gdańsk", pl: "Odkrywca Gdańska" },
  "stage.explorer.msg": { en: "You're basically a local now 😎", tr: "Artık neredeyse yerlisin 😎", es: "Ya eres prácticamente un local 😎", pl: "Jesteś już praktycznie lokalnym 😎" },

  // ── Quick access ──
  "quick.explore": { en: "Explore", tr: "Keşfet", es: "Explorar", pl: "Odkrywaj" },
  "quick.explore.sub": { en: "Guides & places", tr: "Rehberler & yerler", es: "Guías y lugares", pl: "Przewodniki i miejsca" },
  "quick.timetable": { en: "Timetable", tr: "Program", es: "Horario", pl: "Plan" },
  "quick.timetable.sub": { en: "Build your schedule", tr: "Programını oluştur", es: "Crea tu horario", pl: "Ułóż swój plan" },
  "quick.tasks": { en: "Tasks", tr: "Görevler", es: "Tareas", pl: "Zadania" },
  "quick.tasks.sub": { en: "Your to-do list", tr: "Yapılacaklar listen", es: "Tu lista de tareas", pl: "Twoja lista zadań" },

  // ── Tasks page ──
  "tasks.title": { en: "My Tasks", tr: "Görevlerim", es: "Mis Tareas", pl: "Moje Zadania" },
  "tasks.subtitle": { en: "Your first 2 weeks — one step at a time 💪", tr: "İlk 2 haftanız — adım adım 💪", es: "Tus primeras 2 semanas — paso a paso 💪", pl: "Twoje pierwsze 2 tygodnie — krok po kroku 💪" },
  "tasks.essentials": { en: "First week essentials", tr: "İlk hafta gereklilikler", es: "Esenciales de la primera semana", pl: "Niezbędne w pierwszym tygodniu" },
  "tasks.academic": { en: "Academic setup", tr: "Akademik kurulum", es: "Configuración académica", pl: "Konfiguracja akademicka" },
  "tasks.done": { en: "Done — nice work!", tr: "Tamam — harika iş!", es: "Hecho — ¡buen trabajo!", pl: "Gotowe — dobra robota!" },
  "tasks.allSorted": { en: "You're all sorted!", tr: "Her şey tamam!", es: "¡Todo listo!", pl: "Wszystko gotowe!" },
  "tasks.allSortedSub": { en: "Time to explore Gdańsk and enjoy your Erasmus 🌍", tr: "Gdańsk'ı keşfetme zamanı 🌍", es: "Es hora de explorar Gdańsk 🌍", pl: "Czas odkrywać Gdańsk 🌍" },
  "tasks.essentialsLabel": { en: "essentials", tr: "temel", es: "esenciales", pl: "podstawowe" },
  "tasks.academicLabel": { en: "academic", tr: "akademik", es: "académico", pl: "akademickie" },
  "tasks.loadingTasks": { en: "Loading tasks…", tr: "Görevler yükleniyor…", es: "Cargando tareas…", pl: "Ładowanie zadań…" },
  "tasks.badgeDone": { en: "Done", tr: "Tamam", es: "Hecho", pl: "Gotowe" },

  // ── Tasks data ──
  "task.pesel": { en: "PESEL Application", tr: "PESEL Başvurusu", es: "Solicitud de PESEL", pl: "Wniosek o PESEL" },
  "task.pesel.desc": { en: "Legal ID number", tr: "Yasal kimlik numarası", es: "Número de identificación", pl: "Numer identyfikacyjny" },
  "task.bank": { en: "Open Bank Account", tr: "Banka Hesabı Aç", es: "Abrir Cuenta Bancaria", pl: "Otwórz Konto Bankowe" },
  "task.bank.desc": { en: "PKO BP or Santander", tr: "PKO BP veya Santander", es: "PKO BP o Santander", pl: "PKO BP lub Santander" },
  "task.zus": { en: "ZUS Registration", tr: "ZUS Kaydı", es: "Registro en ZUS", pl: "Rejestracja w ZUS" },
  "task.zus.desc": { en: "Health insurance", tr: "Sağlık sigortası", es: "Seguro de salud", pl: "Ubezpieczenie zdrowotne" },
  "task.ola": { en: "Online Learning Agreement", tr: "Online Öğrenim Anlaşması", es: "Acuerdo de Aprendizaje", pl: "Porozumienie o Programie Zajęć" },
  "task.ola.desc": { en: "Submit OLA before deadline", tr: "OLA'yı son tarihe kadar gönder", es: "Enviar OLA antes del plazo", pl: "Złóż OLA przed terminem" },
  "task.sis-courses": { en: "SIS Course Selection", tr: "SIS Ders Seçimi", es: "Selección de Cursos SIS", pl: "Wybór Przedmiotów SIS" },
  "task.sis-courses.desc": { en: "Choose your courses", tr: "Derslerini seç", es: "Elige tus cursos", pl: "Wybierz przedmioty" },
  "task.student-id": { en: "Student ID Card", tr: "Öğrenci Kimlik Kartı", es: "Tarjeta de Estudiante", pl: "Legitymacja Studencka" },
  "task.student-id.desc": { en: "Collect from dean's office", tr: "Dekanlıktan al", es: "Recoger en decanato", pl: "Odbierz w dziekanacie" },
  "task.email": { en: "Email Setup", tr: "E-posta Kurulumu", es: "Configurar Email", pl: "Konfiguracja Email" },
  "task.email.desc": { en: "PG student email", tr: "PG öğrenci e-postası", es: "Email de estudiante PG", pl: "Email studencki PG" },
  "task.accommodation": { en: "Accommodation Check-in", tr: "Konaklama Giriş", es: "Check-in de Alojamiento", pl: "Zameldowanie" },
  "task.accommodation.desc": { en: "Dorm registration", tr: "Yurt kaydı", es: "Registro de dormitorio", pl: "Rejestracja w akademiku" },
  "task.sis-login": { en: "SIS First Login", tr: "SIS İlk Giriş", es: "Primer Inicio SIS", pl: "Pierwszy Login SIS" },
  "task.sis-login.desc": { en: "Activate your account", tr: "Hesabını aktifleştir", es: "Activa tu cuenta", pl: "Aktywuj swoje konto" },

  // ── Timetable ──
  "timetable.title": { en: "Timetable", tr: "Ders Programı", es: "Horario", pl: "Plan Zajęć" },
  "timetable.courses": { en: "course", tr: "ders", es: "curso", pl: "kurs" },
  "timetable.coursesPlural": { en: "courses", tr: "ders", es: "cursos", pl: "kursy" },
  "timetable.added": { en: "added", tr: "eklendi", es: "añadido", pl: "dodano" },
  "timetable.conflicts": { en: "conflict", tr: "çakışma", es: "conflicto", pl: "konflikt" },
  "timetable.conflictsPlural": { en: "conflicts", tr: "çakışma", es: "conflictos", pl: "konflikty" },
  "timetable.conflictMsg": { en: "detected — check your schedule", tr: "tespit edildi — programını kontrol et", es: "detectados — revisa tu horario", pl: "wykryto — sprawdź plan" },
  "timetable.addCourse": { en: "Add Course", tr: "Ders Ekle", es: "Añadir Curso", pl: "Dodaj Kurs" },
  "timetable.courseName": { en: "Course name *", tr: "Ders adı *", es: "Nombre del curso *", pl: "Nazwa kursu *" },
  "timetable.code": { en: "Code (e.g. CS101)", tr: "Kod (ör. CS101)", es: "Código (ej. CS101)", pl: "Kod (np. CS101)" },
  "timetable.room": { en: "Room", tr: "Oda", es: "Aula", pl: "Sala" },
  "timetable.day": { en: "Day", tr: "Gün", es: "Día", pl: "Dzień" },
  "timetable.start": { en: "Start", tr: "Başlangıç", es: "Inicio", pl: "Start" },
  "timetable.end": { en: "End", tr: "Bitiş", es: "Fin", pl: "Koniec" },
  "timetable.color": { en: "Color", tr: "Renk", es: "Color", pl: "Kolor" },
  "timetable.cancel": { en: "Cancel", tr: "İptal", es: "Cancelar", pl: "Anuluj" },
  "timetable.loading": { en: "Loading timetable...", tr: "Program yükleniyor...", es: "Cargando horario...", pl: "Ładowanie planu..." },

  // ── Days ──
  "day.mon": { en: "Mon", tr: "Pzt", es: "Lun", pl: "Pon" },
  "day.tue": { en: "Tue", tr: "Sal", es: "Mar", pl: "Wt" },
  "day.wed": { en: "Wed", tr: "Çar", es: "Mié", pl: "Śr" },
  "day.thu": { en: "Thu", tr: "Per", es: "Jue", pl: "Czw" },
  "day.fri": { en: "Fri", tr: "Cum", es: "Vie", pl: "Pt" },

  // ── Explore / Places ──
  "explore.title": { en: "Explore", tr: "Keşfet", es: "Explorar", pl: "Odkrywaj" },
  "explore.subtitle": { en: "Guides, offices & useful spots 📍", tr: "Rehberler, ofisler & faydalı yerler 📍", es: "Guías, oficinas y lugares útiles 📍", pl: "Przewodniki, biura i przydatne miejsca 📍" },
  "explore.guides": { en: "📖 Guides", tr: "📖 Rehberler", es: "📖 Guías", pl: "📖 Przewodniki" },
  "explore.places": { en: "📍 Places", tr: "📍 Yerler", es: "📍 Lugares", pl: "📍 Miejsca" },
  "explore.startWith": { en: "Start with these", tr: "Bunlarla başla", es: "Empieza con estos", pl: "Zacznij od tych" },
  "explore.alsoImportant": { en: "Also important", tr: "Bunlar da önemli", es: "También importante", pl: "Również ważne" },
  "explore.campusMap": { en: "Interactive Campus Map", tr: "İnteraktif Kampüs Haritası", es: "Mapa Interactivo del Campus", pl: "Interaktywna Mapa Kampusu" },
  "explore.backToExplore": { en: "Back to Explore", tr: "Keşfet'e Dön", es: "Volver a Explorar", pl: "Wróć do Odkrywaj" },
  "explore.guideNotFound": { en: "Guide not found", tr: "Rehber bulunamadı", es: "Guía no encontrada", pl: "Nie znaleziono przewodnika" },
  "explore.steps": { en: "Steps", tr: "Adımlar", es: "Pasos", pl: "Kroki" },
  "explore.documents": { en: "Documents needed", tr: "Gerekli belgeler", es: "Documentos necesarios", pl: "Potrzebne dokumenty" },
  "explore.faq": { en: "FAQ", tr: "SSS", es: "Preguntas Frecuentes", pl: "FAQ" },

  // ── Settings ──
  "settings.title": { en: "Settings", tr: "Ayarlar", es: "Ajustes", pl: "Ustawienia" },
  "settings.subtitle": { en: "Customize your experience", tr: "Deneyimini özelleştir", es: "Personaliza tu experiencia", pl: "Dostosuj swoje doświadczenie" },
  "settings.back": { en: "Back", tr: "Geri", es: "Volver", pl: "Wróć" },
  "settings.profile": { en: "Profile", tr: "Profil", es: "Perfil", pl: "Profil" },
  "settings.university": { en: "University", tr: "Üniversite", es: "Universidad", pl: "Uczelnia" },
  "settings.appearance": { en: "Appearance", tr: "Görünüm", es: "Apariencia", pl: "Wygląd" },
  "settings.darkMode": { en: "Dark Mode", tr: "Karanlık Mod", es: "Modo Oscuro", pl: "Tryb Ciemny" },
  "settings.language": { en: "Language", tr: "Dil", es: "Idioma", pl: "Język" },
  "settings.about": { en: "About", tr: "Hakkında", es: "Acerca de", pl: "O aplikacji" },
  "settings.version": { en: "Version", tr: "Sürüm", es: "Versión", pl: "Wersja" },
  "settings.madeBy": { en: "Made by", tr: "Yapımcılar", es: "Hecho por", pl: "Autorzy" },
  "settings.signOut": { en: "Sign Out", tr: "Çıkış Yap", es: "Cerrar Sesión", pl: "Wyloguj się" },
  "settings.loading": { en: "Loading…", tr: "Yükleniyor…", es: "Cargando…", pl: "Ładowanie…" },

  // ── Login ──
  "login.title": { en: "ErasmusBuddy", tr: "ErasmusBuddy", es: "ErasmusBuddy", pl: "ErasmusBuddy" },
  "login.subtitle": { en: "Your student guide to settling in at\nGdańsk University of Technology", tr: "Gdańsk Teknoloji Üniversitesi'ne\nyerleşme rehberin", es: "Tu guía para instalarte en la\nUniversidad Tecnológica de Gdańsk", pl: "Twój przewodnik po osiedleniu się na\nPolitechnice Gdańskiej" },
  "login.tagline": { en: "Made by students, for students", tr: "Öğrencilerden, öğrencilere", es: "Hecho por estudiantes, para estudiantes", pl: "Stworzone przez studentów, dla studentów" },
  "login.google": { en: "Sign in with Google", tr: "Google ile Giriş Yap", es: "Iniciar sesión con Google", pl: "Zaloguj się przez Google" },
  "login.or": { en: "or", tr: "veya", es: "o", pl: "lub" },
  "login.signIn": { en: "Sign In", tr: "Giriş Yap", es: "Iniciar Sesión", pl: "Zaloguj się" },
  "login.createAccount": { en: "Create Account", tr: "Hesap Oluştur", es: "Crear Cuenta", pl: "Utwórz Konto" },
  "login.email": { en: "Email address", tr: "E-posta adresi", es: "Correo electrónico", pl: "Adres email" },
  "login.password": { en: "Password", tr: "Şifre", es: "Contraseña", pl: "Hasło" },
  "login.passwordMin": { en: "Password (min 6 characters)", tr: "Şifre (en az 6 karakter)", es: "Contraseña (mín. 6 caracteres)", pl: "Hasło (min. 6 znaków)" },
  "login.name": { en: "Your name (optional)", tr: "Adınız (isteğe bağlı)", es: "Tu nombre (opcional)", pl: "Twoje imię (opcjonalne)" },
  "login.forgotPassword": { en: "Forgot password?", tr: "Şifreni mi unuttun?", es: "¿Olvidaste tu contraseña?", pl: "Zapomniałeś hasła?" },
  "login.noAccount": { en: "No account?", tr: "Hesabın yok mu?", es: "¿No tienes cuenta?", pl: "Nie masz konta?" },
  "login.createOne": { en: "Create one", tr: "Hesap oluştur", es: "Crear una", pl: "Utwórz jedno" },
  "login.haveAccount": { en: "Already have one?", tr: "Zaten hesabın var mı?", es: "¿Ya tienes una?", pl: "Masz już konto?" },
  "login.signingIn": { en: "Signing in…", tr: "Giriş yapılıyor…", es: "Iniciando sesión…", pl: "Logowanie…" },
  "login.creatingAccount": { en: "Creating account…", tr: "Hesap oluşturuluyor…", es: "Creando cuenta…", pl: "Tworzenie konta…" },
  "login.checkEmail": { en: "Check your email to confirm your account, then sign in.", tr: "Hesabını onaylamak için e-postanı kontrol et.", es: "Revisa tu email para confirmar tu cuenta.", pl: "Sprawdź email, aby potwierdzić konto." },
  "login.free": { en: "Free to use · Your PG university account", tr: "Ücretsiz · PG üniversite hesabınız", es: "Gratis · Tu cuenta universitaria PG", pl: "Bezpłatne · Twoje konto PG" },
  "login.noRegistration": { en: "No separate registration needed", tr: "Ayrı kayıt gerekmez", es: "No se necesita registro separado", pl: "Nie jest potrzebna osobna rejestracja" },
  "login.resetPassword": { en: "Reset Password", tr: "Şifre Sıfırla", es: "Restablecer Contraseña", pl: "Zresetuj Hasło" },
  "login.resetSub": { en: "Enter your email and we'll send you a reset link.", tr: "E-postanı gir, sıfırlama bağlantısı gönderelim.", es: "Ingresa tu email y te enviaremos un enlace.", pl: "Wpisz email, a wyślemy link do resetowania." },
  "login.sendReset": { en: "Send Reset Link", tr: "Sıfırlama Linki Gönder", es: "Enviar Enlace", pl: "Wyślij Link" },
  "login.sending": { en: "Sending…", tr: "Gönderiliyor…", es: "Enviando…", pl: "Wysyłanie…" },
  "login.resetSent": { en: "Password reset link sent! Check your email.", tr: "Sıfırlama linki gönderildi! E-postanı kontrol et.", es: "¡Enlace enviado! Revisa tu email.", pl: "Link do resetowania wysłany! Sprawdź email." },
  "login.backToSignIn": { en: "← Back to Sign In", tr: "← Giriş'e Dön", es: "← Volver a Iniciar Sesión", pl: "← Wróć do Logowania" },

  // ── Fun tips ──
  "tip.0": { en: "Get a ZTM monthly pass — it covers trams, buses, and SKM trains to Sopot & Gdynia!", tr: "ZTM aylık kartı al — tramvay, otobüs ve Sopot & Gdynia'ya SKM trenlerini kapsar!", es: "Consigue un pase mensual ZTM — cubre tranvías, buses y trenes SKM a Sopot y Gdynia!", pl: "Kup miesięczny bilet ZTM — obejmuje tramwaje, autobusy i pociągi SKM do Sopotu i Gdyni!" },
  "tip.1": { en: "Thursday is the unofficial Erasmus party night in Gdańsk. Check ESN events!", tr: "Perşembe Gdańsk'ta resmi olmayan Erasmus parti gecesi. ESN etkinliklerine bak!", es: "El jueves es la noche no oficial de fiesta Erasmus en Gdańsk. ¡Mira los eventos ESN!", pl: "Czwartek to nieoficjalna noc imprezowa Erasmusa w Gdańsku. Sprawdź wydarzenia ESN!" },
  "tip.2": { en: "Stogi beach is just 20 min by tram — perfect for summer sunsets.", tr: "Stogi plajı tramvayla sadece 20 dakika — yaz günbatımları için mükemmel.", es: "La playa Stogi está a solo 20 min en tranvía — perfecta para atardeceres.", pl: "Plaża Stogi jest 20 min tramwajem — idealna na letnie zachody słońca." },
  "tip.3": { en: "Oliwa Cathedral has free organ concerts — one of Gdańsk's hidden gems.", tr: "Oliwa Katedrali'nde ücretsiz organ konserleri var — Gdańsk'ın gizli hazinelerinden.", es: "La Catedral de Oliwa tiene conciertos de órgano gratis — una joya oculta.", pl: "Katedra w Oliwie ma darmowe koncerty organowe — jeden z ukrytych skarbów Gdańska." },
  "tip.4": { en: "Galeria Bałtycka is the biggest shopping mall near PG. 5 min walk!", tr: "Galeria Bałtycka PG'ye en yakın AVM. 5 dakika yürüyüş!", es: "Galeria Bałtycka es el centro comercial más grande cerca de PG. ¡5 min a pie!", pl: "Galeria Bałtycka to największe centrum handlowe blisko PG. 5 min pieszo!" },
  "tip.5": { en: "Lechia Gdańsk matches at Stadion Energa are super cheap with a student ID.", tr: "Lechia Gdańsk maçları öğrenci kimliğiyle çok ucuz.", es: "Los partidos del Lechia Gdańsk son muy baratos con carné de estudiante.", pl: "Mecze Lechii Gdańsk na Stadionie Energa są super tanie z legitymacją studencką." },
} as const;

export type TranslationKey = keyof typeof translations;

// ── Context ────────────────────────────────────────────────────────────────
type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("erasmus-language") as Lang | null;
    if (saved && ["en", "tr", "es", "pl"].includes(saved)) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("erasmus-language", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[lang] || entry.en;
    },
    [lang]
  );

  // Avoid flash of English before localStorage loads
  if (!mounted) return null;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
