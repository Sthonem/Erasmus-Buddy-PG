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
  "dashboard.startAdventure": { en: "Let's start your Gdańsk adventure!", tr: "Gdańsk macerana başlayalım!", es: "¡Comencemos tu aventura en Gdańsk!", pl: "Rozpocznijmy twoją przygodę w Gdańsku!" },
  "dashboard.halfway": { en: "More than halfway there! 🎉", tr: "Yarıdan fazlasını tamamladın! 🎉", es: "¡Más de la mitad hecho! 🎉", pl: "Ponad połowa zrobiona! 🎉" },
  "dashboard.left": { en: "left 💪", tr: "kaldı 💪", es: "restantes 💪", pl: "pozostało 💪" },

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
  "settings.account": { en: "Account", tr: "Hesap", es: "Cuenta", pl: "Konto" },
  "settings.fullName": { en: "Full Name", tr: "Ad Soyad", es: "Nombre Completo", pl: "Imię i Nazwisko" },
  "settings.email": { en: "Email", tr: "E-posta", es: "Correo", pl: "E-mail" },
  "settings.security": { en: "Security", tr: "Güvenlik", es: "Seguridad", pl: "Bezpieczeństwo" },
  "settings.changePassword": { en: "Change Password", tr: "Şifre Değiştir", es: "Cambiar Contraseña", pl: "Zmień Hasło" },
  "settings.currentPassword": { en: "Current Password", tr: "Mevcut Şifre", es: "Contraseña Actual", pl: "Obecne Hasło" },
  "settings.newPassword": { en: "New Password", tr: "Yeni Şifre", es: "Nueva Contraseña", pl: "Nowa Hasło" },
  "settings.confirmPassword": { en: "Confirm Password", tr: "Şifre Tekrar", es: "Confirmar Contraseña", pl: "Potwierdź Hasło" },
  "settings.updatePassword": { en: "Update Password", tr: "Şifreyi Güncelle", es: "Actualizar Contraseña", pl: "Zaktualizuj Hasło" },
  "settings.passwordUpdated": { en: "Password updated successfully!", tr: "Şifre başarıyla güncellendi!", es: "¡Contraseña actualizada!", pl: "Hasło zaktualizowane!" },
  "settings.passwordMismatch": { en: "Passwords don't match", tr: "Şifreler eşleşmiyor", es: "Las contraseñas no coinciden", pl: "Hasła nie pasują" },
  "settings.passwordTooShort": { en: "Min 6 characters", tr: "Min 6 karakter", es: "Mín 6 caracteres", pl: "Min 6 znaków" },
  "settings.updating": { en: "Updating…", tr: "Güncelleniyor…", es: "Actualizando…", pl: "Aktualizowanie…" },
  "settings.editProfile": { en: "Edit Profile", tr: "Profili Düzenle", es: "Editar Perfil", pl: "Edytuj Profil" },
  "settings.saveProfile": { en: "Save", tr: "Kaydet", es: "Guardar", pl: "Zapisz" },
  "settings.profileSaved": { en: "Profile updated!", tr: "Profil güncellendi!", es: "¡Perfil actualizado!", pl: "Profil zaktualizowany!" },
  "settings.cancel": { en: "Cancel", tr: "İptal", es: "Cancelar", pl: "Anuluj" },
  "settings.erasmusStudent": { en: "Erasmus Student", tr: "Erasmus Öğrencisi", es: "Estudiante Erasmus", pl: "Student Erasmus" },
  "settings.memberSince": { en: "Member since", tr: "Üyelik tarihi", es: "Miembro desde", pl: "Członek od" },
  "settings.changeEmail": { en: "Change Email", tr: "E-posta Değiştir", es: "Cambiar Correo", pl: "Zmień E-mail" },
  "settings.newEmail": { en: "New Email", tr: "Yeni E-posta", es: "Nuevo Correo", pl: "Nowy E-mail" },
  "settings.updateEmail": { en: "Update Email", tr: "E-postayı Güncelle", es: "Actualizar Correo", pl: "Zaktualizuj E-mail" },
  "settings.emailUpdated": { en: "Confirmation email sent! Check your inbox.", tr: "Onay e-postası gönderildi! Gelen kutunu kontrol et.", es: "Correo de confirmación enviado! Revisa tu bandeja.", pl: "E-mail potwierdzający wysłany! Sprawdź skrzynkę." },
  "settings.invalidEmail": { en: "Please enter a valid email", tr: "Geçerli bir e-posta gir", es: "Introduce un correo válido", pl: "Wprowadź prawidłowy e-mail" },

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

  // ── Explore cards ──
  "explore.sopot": { en: "Longest wooden pier in Europe", tr: "Avrupa'nın en uzun ahşap iskelesi", es: "El muelle de madera más largo de Europa", pl: "Najdłuższe drewniane molo w Europie" },
  "explore.sopot.dist": { en: "25 min by SKM", tr: "SKM ile 25 dk", es: "25 min en SKM", pl: "25 min SKM" },
  "explore.dlugi": { en: "The heart of old town Gdańsk", tr: "Gdańsk eski şehrinin kalbi", es: "El corazón del casco antiguo", pl: "Serce starego Gdańska" },
  "explore.dlugi.dist": { en: "15 min by tram", tr: "Tramvayla 15 dk", es: "15 min en tranvía", pl: "15 min tramwajem" },
  "explore.oliwa": { en: "Cathedral organ concerts", tr: "Katedral org konserleri", es: "Conciertos de órgano en la catedral", pl: "Koncerty organowe w katedrze" },
  "explore.oliwa.dist": { en: "10 min by tram", tr: "Tramvayla 10 dk", es: "10 min en tranvía", pl: "10 min tramwajem" },
  "explore.hel": { en: "Beach day trip paradise", tr: "Plaj günübirlik cenneti", es: "Paraíso de excursión a la playa", pl: "Raj na jednodniową wycieczkę na plażę" },
  "explore.hel.dist": { en: "2h by ferry", tr: "Feribot ile 2 saat", es: "2h en ferry", pl: "2h promem" },
  "explore.wester": { en: "WWII memorial & views", tr: "II. Dünya Savaşı anıtı & manzara", es: "Memorial de la IIGM y vistas", pl: "Pomnik II WŚ i widoki" },
  "explore.wester.dist": { en: "Ferry from town", tr: "Şehirden feribot", es: "Ferry desde la ciudad", pl: "Prom z miasta" },
  "explore.gdynia": { en: "Modern city by the sea", tr: "Deniz kenarında modern şehir", es: "Ciudad moderna junto al mar", pl: "Nowoczesne miasto nad morzem" },
  "explore.gdynia.dist": { en: "30 min by SKM", tr: "SKM ile 30 dk", es: "30 min en SKM", pl: "30 min SKM" },

  // ── Eats cards ──
  "eats.pierogi": { en: "Best pierogi in town", tr: "Şehrin en iyi pierogisi", es: "Los mejores pierogi de la ciudad", pl: "Najlepsze pierogi w mieście" },
  "eats.pierogi.tip": { en: "Student favorite", tr: "Öğrenci favorisi", es: "Favorito estudiantil", pl: "Ulubione wśród studentów" },
  "eats.biedronka": { en: "Cheapest grocery chain", tr: "En ucuz market zinciri", es: "Cadena de supermercados más barata", pl: "Najtańsza sieć sklepów" },
  "eats.biedronka.tip": { en: "Closest to PG", tr: "PG'ye en yakın", es: "Más cercano a PG", pl: "Najbliżej PG" },
  "eats.kebab": { en: "Late night go-to food", tr: "Gece atıştırmalığı", es: "Comida nocturna favorita", pl: "Nocne jedzenie" },
  "eats.kebab.tip": { en: "ul. Rajska area", tr: "ul. Rajska bölgesi", es: "Zona ul. Rajska", pl: "Okolice ul. Rajskiej" },
  "eats.stacja": { en: "Many cuisines, one place", tr: "Birçok mutfak, tek yer", es: "Muchas cocinas, un lugar", pl: "Wiele kuchni, jedno miejsce" },
  "eats.stacja.tip": { en: "Great for groups", tr: "Gruplar için harika", es: "Ideal para grupos", pl: "Świetne dla grup" },

  // ── Guide detail page UI ──
  "guide.backToExplore": { en: "Back to Explore", tr: "Keşfet'e Dön", es: "Volver a Explorar", pl: "Wróć do Odkrywaj" },
  "guide.critical": { en: "Critical", tr: "Kritik", es: "Crítico", pl: "Krytyczne" },
  "guide.cat.Admin": { en: "Admin", tr: "İdari", es: "Admin", pl: "Administracja" },
  "guide.cat.Academic": { en: "Academic", tr: "Akademik", es: "Académico", pl: "Akademicki" },
  "guide.cat.Campus": { en: "Campus", tr: "Kampüs", es: "Campus", pl: "Kampus" },
  "guide.notFound": { en: "Guide not found", tr: "Rehber bulunamadı", es: "Guía no encontrada", pl: "Nie znaleziono przewodnika" },

  // ── Guide: PESEL ──
  "guide.pesel.title": { en: "PESEL Application", tr: "PESEL Başvurusu", es: "Solicitud de PESEL", pl: "Wniosek o PESEL" },
  "guide.pesel.time": { en: "~2 hours", tr: "~2 saat", es: "~2 horas", pl: "~2 godziny" },
  "guide.pesel.intro": { en: "PESEL is your Polish national identification number. You need it to open a bank account, register for health insurance, and many other services.", tr: "PESEL, Polonya ulusal kimlik numaranızdır. Banka hesabı açmak, sağlık sigortası yaptırmak ve daha birçok hizmet için gereklidir.", es: "PESEL es tu número de identificación nacional polaco. Lo necesitas para abrir una cuenta bancaria, registrarte en el seguro médico y muchos otros servicios.", pl: "PESEL to twój polski numer identyfikacyjny. Potrzebujesz go, aby otworzyć konto bankowe, zarejestrować się w ubezpieczeniu zdrowotnym i wielu innych usługach." },
  "guide.pesel.s1": { en: "Prepare your documents", tr: "Belgelerini hazırla", es: "Prepara tus documentos", pl: "Przygotuj dokumenty" },
  "guide.pesel.s1d": { en: "Passport + university acceptance letter + passport photo", tr: "Pasaport + üniversite kabul mektubu + vesikalık fotoğraf", es: "Pasaporte + carta de aceptación + foto de pasaporte", pl: "Paszport + list akceptacyjny + zdjęcie paszportowe" },
  "guide.pesel.s2": { en: "Go to Urząd Miejski", tr: "Urząd Miejski'ye git", es: "Ve al Urząd Miejski", pl: "Idź do Urzędu Miejskiego" },
  "guide.pesel.s2d": { en: "Address: Wały Jagiellońskie 1, Gdańsk. Open Mon-Fri 8:00-16:00", tr: "Adres: Wały Jagiellońskie 1, Gdańsk. Pzt-Cum 8:00-16:00", es: "Dirección: Wały Jagiellońskie 1, Gdańsk. Lun-Vie 8:00-16:00", pl: "Adres: Wały Jagiellońskie 1, Gdańsk. Pon-Pt 8:00-16:00" },
  "guide.pesel.s3": { en: "Fill in the form", tr: "Formu doldur", es: "Rellena el formulario", pl: "Wypełnij formularz" },
  "guide.pesel.s3d": { en: "Ask for 'Zgłoszenie pobytu czasowego' (temporary residence registration)", tr: "'Zgłoszenie pobytu czasowego' (geçici ikamet kaydı) formunu iste", es: "Pide el 'Zgłoszenie pobytu czasowego' (registro de residencia temporal)", pl: "Poproś o 'Zgłoszenie pobytu czasowego'" },
  "guide.pesel.s4": { en: "Submit your application", tr: "Başvurunu gönder", es: "Envía tu solicitud", pl: "Złóż wniosek" },
  "guide.pesel.s4d": { en: "It's free. PESEL is usually issued the same day or within 1-2 days.", tr: "Ücretsizdir. PESEL genellikle aynı gün veya 1-2 gün içinde verilir.", es: "Es gratis. El PESEL suele emitirse el mismo día o en 1-2 días.", pl: "Jest bezpłatny. PESEL wydawany jest zazwyczaj tego samego dnia lub w ciągu 1-2 dni." },
  "guide.pesel.doc1": { en: "Passport (original)", tr: "Pasaport (orijinal)", es: "Pasaporte (original)", pl: "Paszport (oryginał)" },
  "guide.pesel.doc2": { en: "University acceptance letter", tr: "Üniversite kabul mektubu", es: "Carta de aceptación universitaria", pl: "List akceptacyjny z uczelni" },
  "guide.pesel.doc3": { en: "1 passport photo", tr: "1 vesikalık fotoğraf", es: "1 foto de pasaporte", pl: "1 zdjęcie paszportowe" },
  "guide.pesel.doc4": { en: "Completed residence form", tr: "Tamamlanmış ikamet formu", es: "Formulario de residencia completado", pl: "Wypełniony formularz meldunkowy" },
  "guide.pesel.faq1q": { en: "Can I open a bank account without PESEL?", tr: "PESEL olmadan banka hesabı açabilir miyim?", es: "¿Puedo abrir una cuenta bancaria sin PESEL?", pl: "Czy mogę otworzyć konto bankowe bez PESEL?" },
  "guide.pesel.faq1a": { en: "Some banks allow it, but PESEL makes the process much easier. Get it first.", tr: "Bazı bankalar izin verir ama PESEL işlemi çok kolaylaştırır. Önce PESEL al.", es: "Algunos bancos lo permiten, pero el PESEL facilita mucho el proceso. Consíguelo primero.", pl: "Niektóre banki na to pozwalają, ale PESEL bardzo ułatwia proces. Załatw go najpierw." },
  "guide.pesel.faq2q": { en: "How long does it take?", tr: "Ne kadar sürer?", es: "¿Cuánto tiempo tarda?", pl: "Ile to trwa?" },
  "guide.pesel.faq2a": { en: "Usually same day or 1-2 business days.", tr: "Genellikle aynı gün veya 1-2 iş günü.", es: "Generalmente el mismo día o 1-2 días hábiles.", pl: "Zazwyczaj tego samego dnia lub 1-2 dni robocze." },
  "guide.pesel.faq3q": { en: "Is the office open on weekends?", tr: "Ofis hafta sonu açık mı?", es: "¿Está abierta la oficina los fines de semana?", pl: "Czy urząd jest otwarty w weekendy?" },
  "guide.pesel.faq3a": { en: "No, Mon-Fri only, 8:00-16:00.", tr: "Hayır, sadece Pzt-Cum, 8:00-16:00.", es: "No, solo Lun-Vie, 8:00-16:00.", pl: "Nie, tylko Pon-Pt, 8:00-16:00." },
  "guide.pesel.faq4q": { en: "Is it free?", tr: "Ücretsiz mi?", es: "¿Es gratis?", pl: "Czy jest bezpłatny?" },
  "guide.pesel.faq4a": { en: "Yes, completely free of charge.", tr: "Evet, tamamen ücretsizdir.", es: "Sí, totalmente gratis.", pl: "Tak, całkowicie bezpłatny." },
  "guide.pesel.link": { en: "PG International Office — official info", tr: "PG Uluslararası Ofis — resmi bilgi", es: "Oficina Internacional PG — info oficial", pl: "Biuro Międzynarodowe PG — oficjalne info" },

  // ── Guide: Bank ──
  "guide.bank.title": { en: "Open Bank Account", tr: "Banka Hesabı Aç", es: "Abrir Cuenta Bancaria", pl: "Otwórz Konto Bankowe" },
  "guide.bank.time": { en: "~1 hour", tr: "~1 saat", es: "~1 hora", pl: "~1 godzina" },
  "guide.bank.intro": { en: "You need a Polish bank account to receive your Erasmus grant, pay rent, and manage daily expenses.", tr: "Erasmus bursunu almak, kira ödemek ve günlük harcamalarını yönetmek için Polonya banka hesabına ihtiyacın var.", es: "Necesitas una cuenta bancaria polaca para recibir tu beca Erasmus, pagar alquiler y gestionar gastos diarios.", pl: "Potrzebujesz polskiego konta bankowego, aby otrzymać stypendium Erasmus, płacić czynsz i zarządzać codziennymi wydatkami." },
  "guide.bank.s1": { en: "Get your PESEL first", tr: "Önce PESEL'ini al", es: "Obtén tu PESEL primero", pl: "Najpierw załatw PESEL" },
  "guide.bank.s1d": { en: "Most banks require PESEL to open an account", tr: "Çoğu banka hesap açmak için PESEL ister", es: "La mayoría de bancos requieren PESEL", pl: "Większość banków wymaga PESEL do otwarcia konta" },
  "guide.bank.s2": { en: "Choose your bank", tr: "Bankani seç", es: "Elige tu banco", pl: "Wybierz bank" },
  "guide.bank.s2d": { en: "PKO BP and Santander are most popular among students", tr: "PKO BP ve Santander öğrenciler arasında en popüler", es: "PKO BP y Santander son los más populares entre estudiantes", pl: "PKO BP i Santander są najpopularniejsze wśród studentów" },
  "guide.bank.s3": { en: "Visit the branch", tr: "Şubeye git", es: "Visita la sucursal", pl: "Odwiedź oddział" },
  "guide.bank.s3d": { en: "Bring passport + PESEL confirmation + student ID", tr: "Pasaport + PESEL onayı + öğrenci kimliği getir", es: "Lleva pasaporte + confirmación PESEL + carné de estudiante", pl: "Weź paszport + potwierdzenie PESEL + legitymację" },
  "guide.bank.s4": { en: "Activate online banking", tr: "Online bankacılığı aktif et", es: "Activa la banca online", pl: "Aktywuj bankowość online" },
  "guide.bank.s4d": { en: "Set up the mobile app for easy transfers", tr: "Kolay transferler için mobil uygulamayı kur", es: "Configura la app móvil para transferencias fáciles", pl: "Skonfiguruj aplikację mobilną do łatwych przelewów" },
  "guide.bank.doc1": { en: "Passport (original)", tr: "Pasaport (orijinal)", es: "Pasaporte (original)", pl: "Paszport (oryginał)" },
  "guide.bank.doc2": { en: "PESEL number", tr: "PESEL numarası", es: "Número PESEL", pl: "Numer PESEL" },
  "guide.bank.doc3": { en: "Student ID or acceptance letter", tr: "Öğrenci kimliği veya kabul mektubu", es: "Carné de estudiante o carta de aceptación", pl: "Legitymacja studencka lub list akceptacyjny" },
  "guide.bank.faq1q": { en: "Which bank is best for students?", tr: "Öğrenciler için en iyi banka hangisi?", es: "¿Qué banco es mejor para estudiantes?", pl: "Który bank jest najlepszy dla studentów?" },
  "guide.bank.faq1a": { en: "PKO BP and Santander both offer free student accounts.", tr: "PKO BP ve Santander ikisi de ücretsiz öğrenci hesabı sunar.", es: "PKO BP y Santander ofrecen cuentas estudiantiles gratuitas.", pl: "PKO BP i Santander oferują bezpłatne konta studenckie." },
  "guide.bank.faq2q": { en: "Can I do it online?", tr: "Online yapabilir miyim?", es: "¿Puedo hacerlo online?", pl: "Czy mogę to zrobić online?" },
  "guide.bank.faq2a": { en: "Some banks offer online registration but usually require in-person verification.", tr: "Bazı bankalar online kayıt sunar ama genellikle yüz yüze doğrulama gerekir.", es: "Algunos bancos ofrecen registro online pero suelen requerir verificación presencial.", pl: "Niektóre banki oferują rejestrację online, ale zwykle wymagają weryfikacji osobistej." },
  "guide.bank.faq3q": { en: "How long does it take?", tr: "Ne kadar sürer?", es: "¿Cuánto tiempo tarda?", pl: "Ile to trwa?" },
  "guide.bank.faq3a": { en: "Account is usually active within 1-2 business days.", tr: "Hesap genellikle 1-2 iş günü içinde aktif olur.", es: "La cuenta suele activarse en 1-2 días hábiles.", pl: "Konto jest zwykle aktywne w ciągu 1-2 dni roboczych." },
  "guide.bank.link": { en: "PKO BP Student Account info", tr: "PKO BP Öğrenci Hesabı bilgi", es: "Info cuenta estudiante PKO BP", pl: "Info konto studenckie PKO BP" },

  // ── Guide: ZUS ──
  "guide.zus.title": { en: "ZUS Registration", tr: "ZUS Kaydı", es: "Registro ZUS", pl: "Rejestracja ZUS" },
  "guide.zus.time": { en: "~30 min", tr: "~30 dk", es: "~30 min", pl: "~30 min" },
  "guide.zus.intro": { en: "ZUS is the Polish Social Insurance Institution. Erasmus students need to register for health insurance coverage during their stay.", tr: "ZUS, Polonya Sosyal Sigorta Kurumu'dur. Erasmus öğrencilerinin kalış süreleri boyunca sağlık sigortası kapsamına kaydolmaları gerekir.", es: "ZUS es la Institución de Seguro Social Polaca. Los estudiantes Erasmus deben registrarse para la cobertura de salud durante su estancia.", pl: "ZUS to Zakład Ubezpieczeń Społecznych. Studenci Erasmusa muszą zarejestrować się w ubezpieczeniu zdrowotnym na czas pobytu." },
  "guide.zus.s1": { en: "Check if you need it", tr: "İhtiyacın var mı kontrol et", es: "Comprueba si lo necesitas", pl: "Sprawdź czy tego potrzebujesz" },
  "guide.zus.s1d": { en: "EU students with EHIC card may be exempt — check with the international office", tr: "EHIC kartı olan AB öğrencileri muaf olabilir — uluslararası ofisten kontrol et", es: "Estudiantes UE con tarjeta EHIC pueden estar exentos — consulta con la oficina internacional", pl: "Studenci UE z kartą EHIC mogą być zwolnieni — sprawdź w biurze międzynarodowym" },
  "guide.zus.s2": { en: "Get your PESEL first", tr: "Önce PESEL'ini al", es: "Obtén tu PESEL primero", pl: "Najpierw załatw PESEL" },
  "guide.zus.s2d": { en: "Required for ZUS registration", tr: "ZUS kaydı için gerekli", es: "Necesario para el registro ZUS", pl: "Wymagany do rejestracji ZUS" },
  "guide.zus.s3": { en: "Visit ZUS office or register online", tr: "ZUS ofisine git veya online kayıt ol", es: "Visita la oficina ZUS o regístrate online", pl: "Odwiedź oddział ZUS lub zarejestruj się online" },
  "guide.zus.s3d": { en: "ZUS Gdańsk: ul. Chmielna 27/33", tr: "ZUS Gdańsk: ul. Chmielna 27/33", es: "ZUS Gdańsk: ul. Chmielna 27/33", pl: "ZUS Gdańsk: ul. Chmielna 27/33" },
  "guide.zus.s4": { en: "Submit ZZA or ZUA form", tr: "ZZA veya ZUA formunu gönder", es: "Envía el formulario ZZA o ZUA", pl: "Złóż formularz ZZA lub ZUA" },
  "guide.zus.s4d": { en: "Ask at the office which form applies to you", tr: "Ofiste hangi formun sana uygun olduğunu sor", es: "Pregunta en la oficina qué formulario te corresponde", pl: "Zapytaj w urzędzie, który formularz Cię dotyczy" },
  "guide.zus.doc1": { en: "Passport", tr: "Pasaport", es: "Pasaporte", pl: "Paszport" },
  "guide.zus.doc2": { en: "PESEL number", tr: "PESEL numarası", es: "Número PESEL", pl: "Numer PESEL" },
  "guide.zus.doc3": { en: "University enrollment confirmation", tr: "Üniversite kayıt onayı", es: "Confirmación de matrícula universitaria", pl: "Potwierdzenie zapisu na uczelnię" },
  "guide.zus.faq1q": { en: "Do I need ZUS if I have EHIC?", tr: "EHIC varsa ZUS'a ihtiyacım var mı?", es: "¿Necesito ZUS si tengo EHIC?", pl: "Czy potrzebuję ZUS, jeśli mam EHIC?" },
  "guide.zus.faq1a": { en: "EHIC covers emergency care. ZUS provides broader coverage. Check with the international office.", tr: "EHIC acil bakımı kapsar. ZUS daha geniş kapsam sağlar. Uluslararası ofise danış.", es: "EHIC cubre emergencias. ZUS ofrece cobertura más amplia. Consulta con la oficina internacional.", pl: "EHIC pokrywa nagłe przypadki. ZUS zapewnia szersze ubezpieczenie. Sprawdź w biurze międzynarodowym." },
  "guide.zus.faq2q": { en: "Is it free?", tr: "Ücretsiz mi?", es: "¿Es gratis?", pl: "Czy jest bezpłatny?" },
  "guide.zus.faq2a": { en: "Students are usually exempt from contributions. Registration itself is free.", tr: "Öğrenciler genellikle katkı payından muaftır. Kayıt ücretsizdir.", es: "Los estudiantes suelen estar exentos de contribuciones. El registro es gratuito.", pl: "Studenci są zwykle zwolnieni ze składek. Rejestracja jest bezpłatna." },
  "guide.zus.link": { en: "ZUS official website", tr: "ZUS resmi web sitesi", es: "Sitio web oficial ZUS", pl: "Oficjalna strona ZUS" },

  // ── Guide: OLA ──
  "guide.ola.title": { en: "Online Learning Agreement (OLA)", tr: "Online Öğrenim Anlaşması (OLA)", es: "Acuerdo de Aprendizaje Online (OLA)", pl: "Online Learning Agreement (OLA)" },
  "guide.ola.time": { en: "~1 hour", tr: "~1 saat", es: "~1 hora", pl: "~1 godzina" },
  "guide.ola.intro": { en: "The Online Learning Agreement (OLA) is the official digital document that defines the courses you will study at PG as part of your Erasmus programme. It must be approved by both your home institution and PG before or shortly after arrival.", tr: "Online Öğrenim Anlaşması (OLA), Erasmus programınız kapsamında PG'de çalışacağınız dersleri tanımlayan resmi dijital belgedir. Varıştan önce veya kısa süre sonra hem ana kurumunuz hem de PG tarafından onaylanmalıdır.", es: "El Acuerdo de Aprendizaje Online (OLA) es el documento digital oficial que define los cursos que estudiarás en PG como parte de tu programa Erasmus. Debe ser aprobado por tu universidad de origen y PG antes o poco después de tu llegada.", pl: "Online Learning Agreement (OLA) to oficjalny dokument cyfrowy, który określa przedmioty, które będziesz studiować na PG w ramach programu Erasmus. Musi zostać zatwierdzony zarówno przez uczelnię macierzystą, jak i PG przed lub krótko po przyjeździe." },
  "guide.ola.s1": { en: "Log in to the OLA platform", tr: "OLA platformuna giriş yap", es: "Inicia sesión en la plataforma OLA", pl: "Zaloguj się na platformę OLA" },
  "guide.ola.s1d": { en: "Go to learning-agreement.eu and sign in with your home university credentials", tr: "learning-agreement.eu'ya git ve ana üniversite bilgilerinle giriş yap", es: "Ve a learning-agreement.eu e inicia sesión con tus credenciales universitarias", pl: "Wejdź na learning-agreement.eu i zaloguj się danymi z uczelni macierzystej" },
  "guide.ola.s2": { en: "Create a new Learning Agreement", tr: "Yeni Öğrenim Anlaşması oluştur", es: "Crea un nuevo Acuerdo de Aprendizaje", pl: "Utwórz nowy Learning Agreement" },
  "guide.ola.s2d": { en: "Select PG as the host institution and your home university as the sending institution", tr: "PG'yi ev sahibi kurum, ana üniversiteni gönderen kurum olarak seç", es: "Selecciona PG como institución de acogida y tu universidad como institución de envío", pl: "Wybierz PG jako uczelnię przyjmującą i swoją uczelnię jako wysyłającą" },
  "guide.ola.s3": { en: "Add your courses (Table A)", tr: "Derslerini ekle (Tablo A)", es: "Añade tus cursos (Tabla A)", pl: "Dodaj przedmioty (Tabela A)" },
  "guide.ola.s3d": { en: "List the courses you plan to take at PG with ECTS credits. Use the SIS course catalogue at pg.edu.pl", tr: "PG'de almayı planladığın dersleri AKTS kredileriyle listele. pg.edu.pl'deki SIS ders kataloğunu kullan", es: "Lista los cursos que planeas tomar en PG con créditos ECTS. Usa el catálogo SIS en pg.edu.pl", pl: "Wymień przedmioty, które planujesz realizować na PG z punktami ECTS. Skorzystaj z katalogu SIS na pg.edu.pl" },
  "guide.ola.s4": { en: "Add component at home (Table B)", tr: "Ana üniversitedeki karşılıkları ekle (Tablo B)", es: "Añade componente en casa (Tabla B)", pl: "Dodaj odpowiedniki w uczelni macierzystej (Tabela B)" },
  "guide.ola.s4d": { en: "Map PG courses to equivalent courses at your home university", tr: "PG derslerini ana üniversitendeki eşdeğer derslerle eşleştir", es: "Mapea los cursos de PG con los equivalentes de tu universidad", pl: "Przypisz przedmioty PG do odpowiedników na uczelni macierzystej" },
  "guide.ola.s5": { en: "Send for approval", tr: "Onaya gönder", es: "Envía para aprobación", pl: "Wyślij do zatwierdzenia" },
  "guide.ola.s5d": { en: "Submit to your home coordinator first, then it goes to PG's International Office", tr: "Önce ana koordinatörüne gönder, sonra PG Uluslararası Ofis'e gider", es: "Envía primero a tu coordinador y luego va a la Oficina Internacional de PG", pl: "Wyślij najpierw do koordynatora, potem trafi do Biura Międzynarodowego PG" },
  "guide.ola.s6": { en: "Wait for both signatures", tr: "İki imzayı bekle", es: "Espera ambas firmas", pl: "Czekaj na oba podpisy" },
  "guide.ola.s6d": { en: "The process typically takes 1-2 weeks. Check your email for status updates", tr: "Süreç genellikle 1-2 hafta sürer. Durum güncellemeleri için e-postanı kontrol et", es: "El proceso suele tardar 1-2 semanas. Revisa tu email para actualizaciones", pl: "Proces trwa zazwyczaj 1-2 tygodnie. Sprawdzaj email" },
  "guide.ola.s7": { en: "Download the signed copy", tr: "İmzalı kopyayı indir", es: "Descarga la copia firmada", pl: "Pobierz podpisaną kopię" },
  "guide.ola.s7d": { en: "Save a PDF copy once fully approved — you may need it for your grant documentation", tr: "Tamamen onaylandığında PDF kopyasını kaydet — burs belgelerine ihtiyacın olabilir", es: "Guarda una copia PDF una vez aprobado — la necesitarás para tu documentación de beca", pl: "Zapisz kopię PDF po zatwierdzeniu — może być potrzebna do dokumentacji stypendialnej" },
  "guide.ola.doc1": { en: "Erasmus grant letter / nomination confirmation", tr: "Erasmus burs mektubu / aday gösterme onayı", es: "Carta de beca Erasmus / confirmación de nominación", pl: "List stypendialny Erasmus / potwierdzenie nominacji" },
  "guide.ola.doc2": { en: "PG course catalogue (from SIS or pg.edu.pl)", tr: "PG ders kataloğu (SIS veya pg.edu.pl'den)", es: "Catálogo de cursos PG (de SIS o pg.edu.pl)", pl: "Katalog przedmiotów PG (z SIS lub pg.edu.pl)" },
  "guide.ola.doc3": { en: "Home university coordinator contact", tr: "Ana üniversite koordinatör iletişim bilgileri", es: "Contacto del coordinador de tu universidad", pl: "Kontakt do koordynatora uczelni macierzystej" },
  "guide.ola.doc4": { en: "Your student ID number at PG", tr: "PG'deki öğrenci numaranız", es: "Tu número de estudiante en PG", pl: "Twój numer studenta na PG" },
  "guide.ola.faq1q": { en: "What is the deadline for OLA?", tr: "OLA için son tarih ne?", es: "¿Cuál es la fecha límite del OLA?", pl: "Jaki jest termin OLA?" },
  "guide.ola.faq1a": { en: "Usually within the first 2-3 weeks of arrival. Check with your home coordinator — missing the deadline can affect your grant.", tr: "Genellikle varıştan sonraki ilk 2-3 hafta içinde. Ana koordinatörünle kontrol et — son tarihi kaçırmak bursunu etkileyebilir.", es: "Generalmente en las primeras 2-3 semanas. Consulta con tu coordinador — perder la fecha puede afectar tu beca.", pl: "Zwykle w ciągu pierwszych 2-3 tygodni po przyjeździe. Sprawdź z koordynatorem — przekroczenie terminu może wpłynąć na stypendium." },
  "guide.ola.faq2q": { en: "Can I change courses after submitting?", tr: "Gönderdikten sonra ders değiştirebilir miyim?", es: "¿Puedo cambiar cursos después de enviar?", pl: "Czy mogę zmienić przedmioty po złożeniu?" },
  "guide.ola.faq2a": { en: "Yes, you can submit a Changes to the Learning Agreement form. Try to finalise within the first 5 weeks.", tr: "Evet, Öğrenim Anlaşması Değişiklik formu gönderebilirsin. İlk 5 hafta içinde kesinleştirmeye çalış.", es: "Sí, puedes enviar un formulario de cambios. Intenta finalizar en las primeras 5 semanas.", pl: "Tak, możesz złożyć formularz zmian. Staraj się sfinalizować w ciągu pierwszych 5 tygodni." },
  "guide.ola.faq3q": { en: "Who is the PG coordinator?", tr: "PG koordinatörü kim?", es: "¿Quién es el coordinador de PG?", pl: "Kto jest koordynatorem PG?" },
  "guide.ola.faq3a": { en: "The International Students Office (Building A, room 14) handles OLA approvals at PG.", tr: "Uluslararası Öğrenci Ofisi (Bina A, oda 14) PG'deki OLA onaylarını yönetir.", es: "La Oficina Internacional (Edificio A, sala 14) gestiona las aprobaciones OLA en PG.", pl: "Biuro Międzynarodowe (Budynek A, pokój 14) obsługuje zatwierdzenia OLA na PG." },
  "guide.ola.faq4q": { en: "What if I can't find a course in OLA?", tr: "OLA'da bir ders bulamazsam ne yapmalıyım?", es: "¿Qué pasa si no encuentro un curso en OLA?", pl: "Co jeśli nie mogę znaleźć przedmiotu w OLA?" },
  "guide.ola.faq4a": { en: "Search by ECTS code or partial name. Contact the International Office if a course is missing from the system.", tr: "AKTS koduyla veya kısmi isimle ara. Sistemde ders yoksa Uluslararası Ofis'le iletişime geç.", es: "Busca por código ECTS o nombre parcial. Contacta con la Oficina Internacional si falta un curso.", pl: "Szukaj po kodzie ECTS lub części nazwy. Skontaktuj się z Biurem Międzynarodowym, jeśli przedmiot nie jest w systemie." },
  "guide.ola.faq5q": { en: "Does OLA replace the paper Learning Agreement?", tr: "OLA kağıt Öğrenim Anlaşması'nın yerini alır mı?", es: "¿OLA reemplaza el Acuerdo de Aprendizaje en papel?", pl: "Czy OLA zastępuje papierowy Learning Agreement?" },
  "guide.ola.faq5a": { en: "Yes — OLA is the digital replacement. Most universities now require OLA only, but verify with your home institution.", tr: "Evet — OLA dijital alternatiftir. Çoğu üniversite artık sadece OLA ister ama ana kurumunla doğrula.", es: "Sí — OLA es el reemplazo digital. La mayoría de universidades solo requieren OLA, pero verifica con tu universidad.", pl: "Tak — OLA to cyfrowy zamiennik. Większość uczelni wymaga teraz tylko OLA, ale zweryfikuj to z uczelnią macierzystą." },
  "guide.ola.link": { en: "Open OLA platform — learning-agreement.eu", tr: "OLA platformunu aç — learning-agreement.eu", es: "Abrir plataforma OLA — learning-agreement.eu", pl: "Otwórz platformę OLA — learning-agreement.eu" },

  // ── Guide: SIS ──
  "guide.sis.title": { en: "SIS Registration", tr: "SIS Kaydı", es: "Registro SIS", pl: "Rejestracja SIS" },
  "guide.sis.time": { en: "~1 hour", tr: "~1 saat", es: "~1 hora", pl: "~1 godzina" },
  "guide.sis.intro": { en: "SIS (Student Information System) is PG's platform for course selection, grades, and academic management.", tr: "SIS (Öğrenci Bilgi Sistemi) PG'nin ders seçimi, notlar ve akademik yönetim platformudur.", es: "SIS (Sistema de Información Estudiantil) es la plataforma de PG para selección de cursos, notas y gestión académica.", pl: "SIS (System Informacji Studenckiej) to platforma PG do wyboru przedmiotów, ocen i zarządzania akademickiego." },
  "guide.sis.s1": { en: "Activate your PG account", tr: "PG hesabını aktif et", es: "Activa tu cuenta PG", pl: "Aktywuj konto PG" },
  "guide.sis.s1d": { en: "Check your email for login credentials from PG", tr: "PG'den gelen giriş bilgileri için e-postanı kontrol et", es: "Revisa tu email para las credenciales de PG", pl: "Sprawdź email z danymi logowania z PG" },
  "guide.sis.s2": { en: "Log in to SIS", tr: "SIS'e giriş yap", es: "Inicia sesión en SIS", pl: "Zaloguj się do SIS" },
  "guide.sis.s2d": { en: "Visit: sis.pg.edu.pl", tr: "Ziyaret: sis.pg.edu.pl", es: "Visita: sis.pg.edu.pl", pl: "Odwiedź: sis.pg.edu.pl" },
  "guide.sis.s3": { en: "Select your courses", tr: "Derslerini seç", es: "Selecciona tus cursos", pl: "Wybierz przedmioty" },
  "guide.sis.s3d": { en: "Browse the catalogue and add courses to your schedule", tr: "Kataloğa göz at ve dersleri programına ekle", es: "Navega por el catálogo y añade cursos a tu horario", pl: "Przeglądaj katalog i dodaj przedmioty do planu" },
  "guide.sis.s4": { en: "Confirm your selection", tr: "Seçimini onayla", es: "Confirma tu selección", pl: "Potwierdź wybór" },
  "guide.sis.s4d": { en: "Submit before the registration deadline", tr: "Kayıt son tarihinden önce gönder", es: "Envía antes de la fecha límite de registro", pl: "Wyślij przed terminem rejestracji" },
  "guide.sis.doc1": { en: "PG student email", tr: "PG öğrenci e-postası", es: "Email de estudiante PG", pl: "E-mail studencki PG" },
  "guide.sis.doc2": { en: "Student ID number", tr: "Öğrenci numarası", es: "Número de estudiante", pl: "Numer studenta" },
  "guide.sis.faq1q": { en: "What is the registration deadline?", tr: "Kayıt son tarihi ne?", es: "¿Cuál es la fecha límite de registro?", pl: "Jaki jest termin rejestracji?" },
  "guide.sis.faq1a": { en: "Check with your faculty — usually within the first 2 weeks.", tr: "Fakültene danış — genellikle ilk 2 hafta içinde.", es: "Consulta con tu facultad — generalmente en las primeras 2 semanas.", pl: "Sprawdź na wydziale — zwykle w ciągu pierwszych 2 tygodni." },
  "guide.sis.faq2q": { en: "Can I change courses after registering?", tr: "Kayıt olduktan sonra ders değiştirebilir miyim?", es: "¿Puedo cambiar cursos después de registrarme?", pl: "Czy mogę zmienić przedmioty po rejestracji?" },
  "guide.sis.faq2a": { en: "Yes, during the add/drop period. Check SIS for dates.", tr: "Evet, ders ekleme/bırakma döneminde. Tarihler için SIS'i kontrol et.", es: "Sí, durante el período de agregar/eliminar. Revisa SIS para fechas.", pl: "Tak, w okresie dodawania/rezygnacji. Sprawdź daty w SIS." },
  "guide.sis.link": { en: "SIS login page", tr: "SIS giriş sayfası", es: "Página de inicio SIS", pl: "Strona logowania SIS" },

  // ── Guide: Student ID ──
  "guide.student-id.title": { en: "Student ID Card", tr: "Öğrenci Kimlik Kartı", es: "Carné de Estudiante", pl: "Legitymacja Studencka" },
  "guide.student-id.time": { en: "~20 min", tr: "~20 dk", es: "~20 min", pl: "~20 min" },
  "guide.student-id.intro": { en: "Your student ID card gives you access to university buildings, library, and student discounts.", tr: "Öğrenci kimlik kartınız üniversite binalarına, kütüphaneye erişim ve öğrenci indirimleri sağlar.", es: "Tu carné de estudiante te da acceso a edificios universitarios, biblioteca y descuentos estudiantiles.", pl: "Legitymacja studencka daje dostęp do budynków uczelni, biblioteki i zniżek studenckich." },
  "guide.student-id.s1": { en: "Complete SIS registration first", tr: "Önce SIS kaydını tamamla", es: "Completa primero el registro SIS", pl: "Najpierw zakończ rejestrację SIS" },
  "guide.student-id.s1d": { en: "ID is issued after you are fully enrolled", tr: "Kimlik tam kayıt olduktan sonra verilir", es: "El carné se emite después de la matrícula completa", pl: "Legitymacja wydawana jest po pełnym zapisie" },
  "guide.student-id.s2": { en: "Go to the dean's office", tr: "Dekanlık ofisine git", es: "Ve a la oficina del decano", pl: "Idź do dziekanatu" },
  "guide.student-id.s2d": { en: "Bring your passport and enrollment confirmation", tr: "Pasaportunu ve kayıt onayını getir", es: "Lleva tu pasaporte y confirmación de matrícula", pl: "Weź paszport i potwierdzenie zapisu" },
  "guide.student-id.s3": { en: "Collect your card", tr: "Kartını al", es: "Recoge tu tarjeta", pl: "Odbierz kartę" },
  "guide.student-id.s3d": { en: "Usually ready within a few days of enrollment", tr: "Genellikle kayıttan birkaç gün sonra hazır", es: "Generalmente lista en unos días tras la matrícula", pl: "Zwykle gotowa kilka dni po zapisie" },
  "guide.student-id.doc1": { en: "Passport", tr: "Pasaport", es: "Pasaporte", pl: "Paszport" },
  "guide.student-id.doc2": { en: "Enrollment confirmation from SIS", tr: "SIS'ten kayıt onayı", es: "Confirmación de matrícula de SIS", pl: "Potwierdzenie zapisu z SIS" },
  "guide.student-id.faq1q": { en: "What can I use it for?", tr: "Ne için kullanabilirim?", es: "¿Para qué puedo usarlo?", pl: "Do czego mogę go użyć?" },
  "guide.student-id.faq1a": { en: "Library access, building entry, student discounts on transport and culture.", tr: "Kütüphane erişimi, bina girişi, ulaşım ve kültür etkinliklerinde öğrenci indirimi.", es: "Acceso a biblioteca, entrada a edificios, descuentos en transporte y cultura.", pl: "Dostęp do biblioteki, wejście do budynków, zniżki studenckie na transport i kulturę." },
  "guide.student-id.faq2q": { en: "What if I lose it?", tr: "Kaybedersem ne olur?", es: "¿Qué pasa si lo pierdo?", pl: "Co jeśli zgubię?" },
  "guide.student-id.faq2a": { en: "Report to the dean's office. Replacement fee applies.", tr: "Dekanlık ofisine bildir. Yenileme ücreti uygulanır.", es: "Informa a la oficina del decano. Se aplica tarifa de reposición.", pl: "Zgłoś w dziekanacie. Obowiązuje opłata za duplikat." },

  // ── Guide: Offices ──
  "guide.offices.title": { en: "Key Offices & Buildings", tr: "Önemli Ofisler & Binalar", es: "Oficinas y Edificios Clave", pl: "Kluczowe Biura i Budynki" },
  "guide.offices.time": { en: "Reference", tr: "Referans", es: "Referencia", pl: "Informacja" },
  "guide.offices.intro": { en: "The most important offices and buildings you will need during your first weeks at PG.", tr: "PG'deki ilk haftalarınızda ihtiyaç duyacağınız en önemli ofisler ve binalar.", es: "Las oficinas y edificios más importantes que necesitarás durante tus primeras semanas en PG.", pl: "Najważniejsze biura i budynki, których będziesz potrzebować w pierwszych tygodniach na PG." },
  "guide.offices.s1": { en: "International Students Office", tr: "Uluslararası Öğrenci Ofisi", es: "Oficina de Estudiantes Internacionales", pl: "Biuro Studentów Międzynarodowych" },
  "guide.offices.s1d": { en: "Building A, room 14. Mon-Fri 9:00-15:00", tr: "Bina A, oda 14. Pzt-Cum 9:00-15:00", es: "Edificio A, sala 14. Lun-Vie 9:00-15:00", pl: "Budynek A, pokój 14. Pon-Pt 9:00-15:00" },
  "guide.offices.s2": { en: "Dean's Office", tr: "Dekanlık Ofisi", es: "Oficina del Decano", pl: "Dziekanat" },
  "guide.offices.s2d": { en: "Check your faculty building. Mon-Fri 9:00-14:00", tr: "Fakülte binanı kontrol et. Pzt-Cum 9:00-14:00", es: "Consulta tu edificio de facultad. Lun-Vie 9:00-14:00", pl: "Sprawdź budynek wydziału. Pon-Pt 9:00-14:00" },
  "guide.offices.s3": { en: "Library (PG Biblioteka)", tr: "Kütüphane (PG Biblioteka)", es: "Biblioteca (PG Biblioteka)", pl: "Biblioteka PG" },
  "guide.offices.s3d": { en: "Main Library building. Mon-Fri 8:00-20:00, Sat 9:00-15:00", tr: "Ana Kütüphane binası. Pzt-Cum 8:00-20:00, Cmt 9:00-15:00", es: "Edificio principal de la biblioteca. Lun-Vie 8:00-20:00, Sáb 9:00-15:00", pl: "Budynek Biblioteki Głównej. Pon-Pt 8:00-20:00, Sob 9:00-15:00" },
  "guide.offices.s4": { en: "Student Dormitories", tr: "Öğrenci Yurtları", es: "Residencias Estudiantiles", pl: "Akademiki" },
  "guide.offices.s4d": { en: "DS1-DS6 on campus. Contact: domy@pg.edu.pl", tr: "Kampüste DS1-DS6. İletişim: domy@pg.edu.pl", es: "DS1-DS6 en el campus. Contacto: domy@pg.edu.pl", pl: "DS1-DS6 na kampusie. Kontakt: domy@pg.edu.pl" },
  "guide.offices.faq1q": { en: "Where is the International Office?", tr: "Uluslararası Ofis nerede?", es: "¿Dónde está la Oficina Internacional?", pl: "Gdzie jest Biuro Międzynarodowe?" },
  "guide.offices.faq1a": { en: "Main building (Gmach Główny), Building A, room 14.", tr: "Ana bina (Gmach Główny), Bina A, oda 14.", es: "Edificio principal (Gmach Główny), Edificio A, sala 14.", pl: "Gmach Główny, Budynek A, pokój 14." },
  "guide.offices.faq2q": { en: "Can I get help in English?", tr: "İngilizce yardım alabilir miyim?", es: "¿Puedo obtener ayuda en inglés?", pl: "Czy mogę uzyskać pomoc po angielsku?" },
  "guide.offices.faq2a": { en: "Yes, the International Students Office staff speaks English.", tr: "Evet, Uluslararası Öğrenci Ofisi personeli İngilizce konuşur.", es: "Sí, el personal de la Oficina Internacional habla inglés.", pl: "Tak, pracownicy Biura Międzynarodowego mówią po angielsku." },
  "guide.offices.link": { en: "PG campus map", tr: "PG kampüs haritası", es: "Mapa del campus PG", pl: "Mapa kampusu PG" },

  // ── Places page UI ──
  "places.map": { en: "Map", tr: "Harita", es: "Mapa", pl: "Mapa" },
  "places.link": { en: "Link", tr: "Link", es: "Enlace", pl: "Link" },
  "places.startHere": { en: "Start here", tr: "Buradan başla", es: "Empieza aquí", pl: "Zacznij tutaj" },
  "places.closestToPG": { en: "Closest to PG", tr: "PG'ye en yakın", es: "Más cercano a PG", pl: "Najbliżej PG" },
  "places.mostUsed": { en: "Most used", tr: "En çok kullanılan", es: "Más utilizado", pl: "Najczęściej używany" },
  "places.trojmiasto": { en: "Trójmiasto", tr: "Trójmiasto", es: "Trójmiasto", pl: "Trójmiasto" },
  "places.save50": { en: "Save 50%", tr: "%50 indirim", es: "Ahorra 50%", pl: "Oszczędź 50%" },
  "places.mostCommon": { en: "Most common", tr: "En yaygın", es: "Más común", pl: "Najczęstszy" },
  "places.24_7": { en: "24/7", tr: "7/24", es: "24/7", pl: "24/7" },
  "places.mustSee": { en: "Must see", tr: "Mutlaka gör", es: "Imprescindible", pl: "Trzeba zobaczyć" },
  "places.closestMall": { en: "Closest mall", tr: "En yakın AVM", es: "Centro comercial más cercano", pl: "Najbliższe centrum" },
  "places.cheapest": { en: "Cheapest", tr: "En ucuz", es: "Más barato", pl: "Najtańszy" },
  "places.callAnytime": { en: "Call anytime", tr: "İstediğin zaman ara", es: "Llama cuando quieras", pl: "Dzwoń w każdej chwili" },

  // Places category titles
  "places.cat.campus": { en: "Campus Offices", tr: "Kampüs Ofisleri", es: "Oficinas del Campus", pl: "Biura na Kampusie" },
  "places.cat.groceries": { en: "Grocery Stores", tr: "Marketler", es: "Supermercados", pl: "Sklepy spożywcze" },
  "places.cat.transport": { en: "Public Transport", tr: "Toplu Taşıma", es: "Transporte Público", pl: "Transport Publiczny" },
  "places.cat.pharmacy": { en: "Pharmacy (Apteka)", tr: "Eczane (Apteka)", es: "Farmacia (Apteka)", pl: "Apteka" },
  "places.cat.city": { en: "City & Shopping", tr: "Şehir & Alışveriş", es: "Ciudad y Compras", pl: "Miasto i Zakupy" },
  "places.cat.food": { en: "Food & Cafés", tr: "Yemek & Kafeler", es: "Comida y Cafés", pl: "Jedzenie i Kawiarnie" },
  "places.cat.emergency": { en: "Emergency & Health", tr: "Acil & Sağlık", es: "Emergencia y Salud", pl: "Nagłe Przypadki i Zdrowie" },

  // Guide list entries for places page
  "guides.pesel.desc": { en: "Polish legal ID — required for bank, ZUS and most registrations", tr: "Polonya yasal kimliği — banka, ZUS ve çoğu kayıt için gerekli", es: "ID legal polaco — necesario para banco, ZUS y la mayoría de registros", pl: "Polski numer identyfikacyjny — wymagany do banku, ZUS i większości rejestracji" },
  "guides.pesel.when": { en: "Day 1–3", tr: "Gün 1–3", es: "Día 1–3", pl: "Dzień 1–3" },
  "guides.bank.desc": { en: "PKO BP or Santander — needed to receive your Erasmus grant", tr: "PKO BP veya Santander — Erasmus bursunu almak için gerekli", es: "PKO BP o Santander — necesario para recibir tu beca Erasmus", pl: "PKO BP lub Santander — potrzebny do otrzymania stypendium Erasmus" },
  "guides.bank.when": { en: "Day 3–7", tr: "Gün 3–7", es: "Día 3–7", pl: "Dzień 3–7" },
  "guides.zus.desc": { en: "Health insurance registration — required for GP access", tr: "Sağlık sigortası kaydı — doktor erişimi için gerekli", es: "Registro de seguro de salud — necesario para acceso al médico", pl: "Rejestracja ubezpieczenia zdrowotnego — wymagana do lekarza" },
  "guides.zus.when": { en: "Day 1–7", tr: "Gün 1–7", es: "Día 1–7", pl: "Dzień 1–7" },
  "guides.ola.desc": { en: "Digital OLA — must be submitted and approved before the deadline", tr: "Dijital OLA — son tarihten önce gönderilmeli ve onaylanmalı", es: "OLA digital — debe enviarse y aprobarse antes de la fecha límite", pl: "Cyfrowy OLA — musi zostać złożony i zatwierdzony przed terminem" },
  "guides.ola.when": { en: "Week 1", tr: "Hafta 1", es: "Semana 1", pl: "Tydzień 1" },
  "guides.sis.desc": { en: "Choose and confirm your courses on the PG student portal", tr: "PG öğrenci portalında derslerini seç ve onayla", es: "Elige y confirma tus cursos en el portal de estudiantes PG", pl: "Wybierz i potwierdź przedmioty na portalu studenckim PG" },
  "guides.sis.when": { en: "Week 1–2", tr: "Hafta 1–2", es: "Semana 1–2", pl: "Tydzień 1–2" },
  "guides.student-id.desc": { en: "Collect from the dean's office — needed for library & discounts", tr: "Dekanlıktan al — kütüphane ve indirimler için gerekli", es: "Recoge en la oficina del decano — necesario para biblioteca y descuentos", pl: "Odbierz w dziekanacie — potrzebna do biblioteki i zniżek" },
  "guides.student-id.when": { en: "Week 2", tr: "Hafta 2", es: "Semana 2", pl: "Tydzień 2" },
  "guides.offices.desc": { en: "International Office, library, dorms — locations & hours", tr: "Uluslararası Ofis, kütüphane, yurtlar — konumlar ve saatler", es: "Oficina Internacional, biblioteca, residencias — ubicaciones y horarios", pl: "Biuro Międzynarodowe, biblioteka, akademiki — lokalizacje i godziny" },
  "guides.offices.when": { en: "Anytime", tr: "Her zaman", es: "En cualquier momento", pl: "W każdej chwili" },

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
