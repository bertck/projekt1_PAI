# projekt1_PAI
Projekt studencki zrealizowany w ramach przedmiotu Projektowanie Aplikacji Internetowych.

## Scenariusz biznesowy
Spółdzielnia rolnicza udostępnia swoim członkom nowoczesne maszyny rolnicze. Aby usprawnić proces wypożyczania, powstała aplikacja internetowa umożliwiająca przeglądanie dostępnych maszyn, rezerwowanie ich na wybrane dni oraz zarządzanie użytkownikami i sprzętem przez administratorów.

## Wymagania technologiczne i funkcjonalne
### Technologiczne
- Node.js wraz z menedżerem pakietów npm
- Express 5 jako główny framework serwerowy
- SQLite obsługiwane przez ORM Sequelize
- Pug do generowania widoków po stronie serwera

### Funkcjonalne
- Rejestracja i logowanie użytkowników
- Przegląd katalogu maszyn rolniczych i ich dostępności
- Składanie oraz anulowanie rezerwacji całodniowych
- Panel administracyjny do zarządzania maszynami i użytkownikami

## Uruchomienie projektu
1. Zainstaluj wymagane pakiety:
   ```bash
   npm install
   ```
2. Utwórz plik `.env` w katalogu głównym, np.:
   ```env
   SERVER_PORT=3000
   SESSION_SECRET=silny_losowy_klucz
   DB_FILE_PATH=src/db/data/database.sqlite
   ADMIN_EMAIL=admin@email.com
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin
   ADMIN_ROLE=admin
   ```
3. Uruchom serwer:
   ```bash
   npm start
   ```
4. Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

## Przykładowe komendy i zrzuty ekranów
- Start serwera: `npm start`

## Licencja
Projekt udostępniany na licencji ISC.

## Autor
- Bartłomiej Liber