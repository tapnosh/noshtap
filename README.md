# Dokumentacja Deweloperska Backendu Projektu "Tapnosh"

Niniejszy dokument zawiera kluczowe informacje dotyczące uruchomienia, architektury oraz procesów deweloperskich backendu projektu inżynierskiego.

## 1. Przegląd Technologiczny (Tech Stack)

Projekt oparty jest na nowoczesnym stacku Node.js z naciskiem na typowanie, modularność i skalowalność.

### Główne technologie:

- **NestJS 10**: Framework do tworzenia skalowalnych aplikacji Node.js po stronie serwera
- **TypeScript**: Statyczne typowanie i nowoczesne funkcje języka
- **PostgreSQL 16**: Relacyjna baza danych z obsługą JSONB
- **Prisma ORM 6**: Nowoczesne narzędzie do zarządzania bazą danych
- **Bun/npm**: Menedżer pakietów (zgodny z frontendem)

### Kluczowe biblioteki i narzędzia:

**Backend Framework:**
- `@nestjs/core`, `@nestjs/common`: Fundament frameworka
- `@nestjs/platform-express`: Platforma HTTP (Express)
- `@nestjs/swagger`: Automatyczna dokumentacja API

**Baza Danych:**
- `@prisma/client`: Klient Prisma do dostępu do bazy
- `prisma`: CLI i narzędzia deweloperskie

**Autoryzacja:**
- `@clerk/backend`: Integracja z systemem autoryzacji Clerk
- `@clerk/express`: Middleware Express dla Clerk

**Zarządzanie Efektami:**
- `effect`: Biblioteka Effect-TS do typowanego zarządzania operacjami asynchronicznymi
- `@effect/schema`: Walidacja i serializacja danych

**Narzędzia Deweloperskie:**
- `tsx`: Uruchamianie TypeScript bezpośrednio
- `eslint`, `prettier`: Linting i formatowanie
- `docker`, `docker-compose`: Konteneryzacja środowiska

---

## 2. Setup (Konfiguracja Środowiska)

### Wymagania wstępne

- **Node.js v18+** (zalecane v20+)
- **npm** 
- **Docker** i **Docker Compose** (dla lokalnej bazy danych)
- **PostgreSQL 16** (jeśli bez Dockera)

### Instrukcja uruchomienia

#### 1. Klonowanie repozytorium:

```bash
git clone https://github.com/tapnosh/noshtap
cd noshtap
```

#### 2. Instalacja zależności:

Zaleca się używanie **npm**:

```bash
npm install
```

#### 3. Konfiguracja zmiennych środowiskowych:

Wypełnij wymagane zmienne w `.env.dev`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tapnosh?schema=public"

# Clerk Authentication
CLERK_SECRET_KEY="sk_test_..." # Z dashboard Clerk
CLERK_PUBLISHABLE_KEY="pk_test_..." # Musi być zgodny z frontendem

# Application
NODE_ENV="development"
PORT=3333
FRONTEND_URL="http://localhost:3000"

# Google Places
GOOGLE_PLACES_API_KEY="..."

# Image Upload (Vercel Blob)
CLERK_JWT_KEY="-----BEGIN PUBLIC KEY-----"


#### 4. Uruchomienie bazy danych (Docker):

```bash
docker-compose up -d
```

Sprawdź czy działa:

```bash
docker-compose ps
# postgres powinien być "Up"
```

#### 5. Migracje i seed bazy danych:

```bash
# Uruchom migracje
npm run prisma:migrate

# Opcjonalnie: Seed (kategorie, przykładowe dane)
npm run prisma:seed
```

#### 6. Start serwera deweloperskiego:

```bash
npm run start:dev
```

#### 7. Weryfikacja:

- **API**: http://localhost:3333/api

✅ Backend działa!

---

### Dostępne skrypty

Można je uruchamiać za pomocą `npm run <komenda>` lub `bun run <komenda>`.

| Komenda | Opis |
|---------|------|
| `start:dev` | Serwer deweloperski z hot-reload (watch mode) |
| `start` | Uruchomienie produkcyjnej wersji (wymaga `build`) |
| `start:debug` | Serwer z debuggerem |
| `build` | Budowanie wersji produkcyjnej |
| `format` | Formatowanie kodu (Prettier) |
| `lint` | Sprawdzanie błędów ESLint |
| `lint:fix` | Automatyczna naprawa błędów ESLint |
| `test` | Uruchomienie testów jednostkowych |
| `test:e2e` | Uruchomienie testów end-to-end |
| `test:cov` | Testy z pokryciem (coverage) |
| `prisma:generate` | Generowanie klienta Prisma |
| `prisma:migrate` | Uruchomienie migracji bazy danych |
| `prisma:seed` | Wypełnienie bazy przykładowymi danymi |
| `prisma:studio` | UI do przeglądania bazy danych |

---

### Docker Compose

Plik `docker-compose.yaml` uruchamia lokalną instancję PostgreSQL:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    container_name: tapnosh-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: tapnosh
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Podstawowe komendy Docker:**
```bash
docker-compose up -d      # Start w tle
docker-compose down       # Stop i usunięcie kontenerów
docker-compose logs       # Wyświetl logi
docker-compose ps         # Status kontenerów
```

---

## 3. Architektura

Projekt wykorzystuje **architekturę modularną NestJS** opartą na **Domain-Driven Design (DDD)** oraz wzorcu **warstwowego (Layered Architecture)**.

### Struktura plików

```
/
├─ src/
│  ├─ modules/                    # MODUŁY DOMENOWE
│  │  ├─ auth/                    # Autoryzacja (Clerk)
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ clerk.strategy.ts
│  │  │  └─ clerk-auth.guard.ts
│  │  │
│  │  ├─ places/                  # Integracja Google Places API
│  │  │  ├─ places.controller.ts
│  │  │  ├─ places.service.ts
│  │  │  └─ places.module.ts
│  │  │
│  │  ├─ restaurants/             # Główna domena aplikacji
│  │  │  ├─ controllers/
│  │  │  │  ├─ restaurants.controller.ts
│  │  │  │  ├─ categories.controller.ts
│  │  │  │  ├─ menus.controller.ts
│  │  │  │  ├─ themes.controller.ts
│  │  │  │  ├─ public-restaurants.controller.ts
│  │  │  │  ├─ public-categories.controller.ts
│  │  │  │  ├─ public-menus.controller.ts
│  │  │  │  └─ public-qr.controller.ts
│  │  │  │
│  │  │  ├─ services/             # Logika biznesowa
│  │  │  │  ├─ restaurants.service.ts
│  │  │  │  ├─ categories.service.ts
│  │  │  │  ├─ menus.service.ts
│  │  │  │  ├─ themes.service.ts
│  │  │  │  └─ qr.service.ts
│  │  │  │
│  │  │  ├─ dto/                   # Data Transfer Objects
│  │  │  │  ├─ requests/
│  │  │  │  └─ responses/
│  │  │  │
│  │  │  ├─ types/
│  │  │  │  └─ restaurant_with_relations.ts
│  │  │  │
│  │  │  └─ restaurants.module.ts
│  │  │
│  │  └─ users/                   # Zarządzanie użytkownikami
│  │     ├─ users.service.ts
│  │     ├─ users.module.ts
│  │     └─ users.type.ts
│  │
│  ├─ decorators/                 
│  │  ├─ current-user.decorator.ts
│  │  └─ public.decorator.ts
│  │
│  ├─ prisma/                     # Konfiguracja ORM i bazy danych
│  │  ├─ schema.prisma
│  │  ├─ migrations/
│  │  └─ seed.ts
│  │
│  ├─ prisma.service.ts
│  ├─ prisma.module.ts
│  ├─ app.module.ts
│  └─ main.ts
│
├─ .env.dev
├─ docker-compose.yml
└─ package.json
```

### Kluczowe moduły domenowe

#### RestaurantsModule
- **Odpowiedzialność**: CRUD restauracji, powiązanie restauracji z właścicielem (`userId`), obsługa danych prezentowanych klientom.
- **Endpointy (panel restauratora)**:
  - `POST /restaurants` – tworzenie restauracji
  - `GET /restaurants` – lista restauracji użytkownika
  - `GET /restaurants/{id}` – szczegóły restauracji
  - `PUT /restaurants/{id}` – aktualizacja danych
  - `DELETE /restaurants/{id}` – soft delete
  - `GET /restaurants/slug/{slug}` – pobranie po `slug`
  - `GET /restaurants/{id}/generate_qr` – generowanie kodu QR dla restauracji

- **Endpointy publiczne (dla klientów)**:
  - `GET /public_api/restaurants` – lista restauracji
  - `GET /public_api/restaurants/{slug}` – publiczny widok restauracji

#### Menu (Restaurant Menus)
Menu w Tapnosh jest przechowywane jako osobna encja `RestaurantMenu` i może być wersjonowane (np. poprzez soft delete).

- Restauracja może posiadać wiele wersji menu
- Publicznie udostępniane jest zawsze **najnowsze aktywne menu** (np. sortowanie po `createdAt` malejąco i filtr `is_deleted = false`)
- Struktura menu przechowywana jest w polu `schema` (JSON/JSONB)

**Endpointy:**
- `POST /restaurants/{restaurantId}/menu`
- `PUT /restaurants/{restaurantId}/menu/{id}`
- `DELETE /restaurants/{restaurantId}/menu/{id}`
- `GET /public_api/restaurants/{restaurantId}/menu`

#### QR
- **Odpowiedzialność**: generowanie i obsługa kodów QR prowadzących do publicznego widoku restauracji.
- **Endpointy**:
  - `GET /restaurants/{id}/generate_qr`
  - `GET /public_api/codes/{code}` – przekierowanie (302)

#### Categories / Themes
- **Categories**: zarządzanie tagami/kategoriami przypisywanymi do restauracji.
  - `POST /categories`, `GET /categories`, `PUT/POST /categories/{id}`, `DELETE /categories/{id}`
  - publicznie: `GET /public_api/categories`
- **Themes**: konfiguracja motywu restauracji
  - `GET /restaurant-theme`, `POST /restaurant-theme`

#### Places
- **Odpowiedzialność**: podpowiedzi i detale adresu (integracja z zewnętrznym API).
- **Endpointy**:
  - `GET /places/autocomplete`
  - `GET /places/details`

#### Users
- **Odpowiedzialność**: logika użytkownika po stronie backendu (np. powiązania danych domenowych z `userId` z Clerk, webhooki/synchronizacja),
  bez klasycznego CRUD profilu użytkownika w API.

### Zarządzanie zdjęciami (Vercel Blob)

Backend aplikacji Tapnosh **nie obsługuje bezpośredniego uploadu plików binarnych**.  
Proces przesyłania zdjęć realizowany jest po stronie frontendowej z wykorzystaniem zewnętrznego storage’u **Vercel Blob**.

### Wzorce architektoniczne

#### **1. Layered Architecture (Architektura warstwowa)**

```
HTTP Request
    ↓
[Controller] ← HTTP, routing, validacja
    ↓
[Service] ← Logika biznesowa
    ↓
[Prisma ORM] ← Dostęp do danych
    ↓
[PostgreSQL]
```

#### **2. Dependency Injection**

NestJS używa kontenera IoC (Inversion of Control):

```typescript
@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService,  // Wstrzykiwane
    private readonly qrService: QRService,   // Wstrzykiwane
  ) {}
}
```

#### **3. Guards dla autoryzacji**

```typescript
@Controller('restaurants')
@UseGuards(ClerkAuthGuard)  // Ochrona całego kontrolera
export class RestaurantsController {
  
  @Get()
  findAll(@CurrentUser() user: User) {
    // Tylko zalogowani użytkownicy
  }
  
  @Get('public/:slug')
  @Public()  // Publiczny dostęp
  findPublic(@Param('slug') slug: string) {
    // Bez autoryzacji
  }
}
```

#### **4. DTO (Data Transfer Objects)**

Walidacja i transformacja danych:

```typescript
export class CreateRestaurantDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

---

## 4. Obsługa operacji asynchronicznych i błędów

Backend Tapnosh wykorzystuje standardowy model asynchroniczny oparty o
`async/await` oraz mechanizmy wbudowane w NestJS.

### Obsługa błędów

- Walidacja danych: `class-validator`
- Błędy domenowe: `NotFoundException`, `ForbiddenException`, `BadRequestException`
- Centralna obsługa wyjątków przez mechanizm NestJS

Przykład:

```ts
if (!restaurant) {
  throw new NotFoundException('Restaurant not found');
}
```

---

## 5. Baza Danych i Prisma ORM

### Model danych (kluczowe tabele)

```
User                          Restaurant                    RestaurantMenu
├── id                        ├── id                        ├── id
├── clerk_id (unique)         ├── name                      ├── restaurant_id (FK, unique)
├── email                     ├── slug (unique)             └── schema (JSONB) ← Struktura menu!
└── restaurants[]             ├── description
                              ├── phone                     RestaurantCategory
RestaurantTheme               ├── price_range (enum)        ├── id
├── id                        ├── address                   ├── name
├── primary_color             ├── owner_id (FK → User)      ├── description
├── secondary_color           ├── theme_id (FK)             └── type (allergens/cuisine/food_type)
└── ...                       ├── is_deleted
                              ├── menu (1:1)                QRCode
Image                         ├── qr_code (1:1)             ├── id
├── id                        ├── categories[] (N:M)        ├── restaurant_id (FK, unique)
├── restaurant_id (FK)        └── images[]                  ├── code (unique)
├── url                                                     └── redirect_url
└── order
```

**Kluczowe relacje:**
- **1:1**: Restaurant → RestaurantMenu, Restaurant → QRCode
- **1:N**: User → Restaurant[], Restaurant → Image[]
- **N:M**: Restaurant ↔ RestaurantCategory[] (alergeny, kuchnie, typy)

---

### JSONB dla elastycznego menu

#### Przykład struktury:

```json
{
  "sections": [
    {
      "id": "section-1",
      "title": "Śniadania",
      "items": [
        {
          "id": "item-1",
          "name": "Jajecznica z boczkiem",
          "price": 25.00,
          "currency": "PLN",
          "allergens": ["allergen.eggs", "allergen.gluten"],
          "categories": ["food_type.high_protein"],
          "image": "https://utfs.io/f/...",
          "available": true
        }
      ]
    }
  ]
}
```

---

### Prisma ORM

#### Schema.prisma (fragment):

```prisma
model Restaurant {
  id           String              @id @default(uuid())
  name         String
  slug         String              @unique
  owner_id     String              @map("owner_id")
  is_deleted   Boolean             @default(false) @map("is_deleted")
  created_at   DateTime            @default(now()) @map("created_at")
  updated_at   DateTime            @updatedAt @map("updated_at")
  
  owner        User                @relation(fields: [owner_id], references: [id])
  menu         RestaurantMenu?
  qr_code      QRCode?
  categories   RestaurantCategory[]
  images       Image[]

  @@index([slug])
  @@map("Restaurant")
}

model RestaurantMenu {
  id            String     @id @default(uuid())
  restaurant_id String     @unique @map("restaurant_id")
  schema        Json       @db.JsonB  ← JSONB!
  
  restaurant    Restaurant @relation(fields: [restaurant_id], references: [id], onDelete: Cascade)

  @@map("RestaurantMenu")
}

model RestaurantCategory {
  id          String       @id @default(uuid())
  name        String       @unique
  description String
  type        CategoryType  // allergens | cuisine | food_type
  
  restaurants Restaurant[]

  @@map("RestaurantCategory")
}
```

---

### Migracje

```bash
# Tworzenie nowej migracji (development)
npx prisma migrate dev --name add_price_range

# Zastosowanie na produkcji
npx prisma migrate deploy

# Reset bazy (⚠️ DEV ONLY - usuwa dane)
npx prisma migrate reset

# Generowanie Prisma Client
npx prisma generate
```

**Uwaga:** Prisma nie ma automatycznego rollback - trzeba stworzyć odwrotną migrację ręcznie.

---

### Seed - Kategorie

Baza jest wypełniana początkowymi kategoriami przez `prisma/seed.ts`:

```typescript
const categories = [
  // 17 alergenów
  { name: 'allergen.gluten', description: 'Gluten', type: 'allergens' },
  { name: 'allergen.eggs', description: 'Eggs', type: 'allergens' },
  // ...
  
  // 50+ kuchni
  { name: 'cuisine.italian', description: 'Italian', type: 'cuisine' },
  { name: 'cuisine.polish', description: 'Polish', type: 'cuisine' },
  { name: 'cuisine.japanese', description: 'Japanese', type: 'cuisine' },
  // ...
  
  // 17 typów jedzenia
  { name: 'food_type.vegan', description: 'Vegan', type: 'food_type' },
  { name: 'food_type.halal', description: 'Halal', type: 'food_type' },
  // ...
];

await prisma.restaurantCategory.createMany({
  data: categories,
  skipDuplicates: true,
});
```

**Uruchomienie:**
```bash
npx prisma db seed
```

**Co zawiera:**
- ✅ 17 alergenów (gluten, dairy, nuts, eggs, fish...)
- ✅ 50+ kuchni (Italian, Polish, Japanese, Mexican, Thai...)
- ✅ 17 typów (vegan, vegetarian, halal, kosher, organic...)

---

### Prisma Studio

GUI do przeglądania bazy danych:

```bash
npx prisma studio
```

Otwiera: **http://localhost:5555**

Przydatne do:
- Podglądu danych w tabelach
- Ręcznej edycji rekordów
- Debugowania relacji
- Sprawdzenia czy seed zadziałał

---

### Przydatne komendy

| Komenda | Opis |
|---------|------|
| `npx prisma generate` | Generuje Prisma Client (po zmianie schema) |
| `npx prisma migrate dev` | Tworzy i stosuje migrację (+ seed) |
| `npx prisma migrate deploy` | Stosuje migracje na produkcji |
| `npx prisma db seed` | Wypełnia bazę początkowymi danymi |
| `npx prisma studio` | Otwiera GUI do bazy (localhost:5555) |
| `npx prisma migrate status` | Status migracji |
| `npx prisma format` | Formatuje schema.prisma |

---

### Podsumowanie

| Aspekt | Technologia | Kluczowa cecha |
|--------|-------------|----------------|
| **Baza danych** | PostgreSQL 16 | JSONB, ACID, relacje |
| **ORM** | Prisma 6 | Typowany, migracje |
| **Menu storage** | JSONB | Elastyczność bez migracji |
| **Seed** | 84+ kategorie | Alergeny, kuchnie, typy |
| **Soft delete** | `is_deleted` | Dane nie są usuwane |

**Model zapewnia:**
- Integralność referencyjną (FK, Cascade)
- Elastyczność struktury menu (JSONB)
- Gotowe kategorie po seedzie


## 6. Autoryzacja i Bezpieczeństwo

### Clerk – system zarządzania tożsamością

Projekt wykorzystuje **Clerk** jako zewnętrznego dostawcę uwierzytelniania użytkowników (ACaaS – Access Control as a Service).  
Proces logowania realizowany jest po stronie frontendowej, natomiast backend odpowiada za weryfikację sesji użytkownika.

---

### Przepływ uwierzytelniania (Clerk)


```
1. User loguje się (frontend)
   ↓
2. Clerk generuje JWT token
   ↓
3. Frontend wysyła request z:
   Authorization: Bearer <JWT>
   ↓
4. Backend (ClerkAuthGuard):
   - Weryfikuje token
   - Dekoduje clerkId
   - Pobiera User z DB
   ↓
5. Request trafia do kontrolera
   z @CurrentUser() user: User
```


---

### Ochrona endpointów

Endpointy backendu zostały podzielone na:
- **prywatne** – dostępne wyłącznie dla uwierzytelnionych użytkowników,
- **publiczne** – dostępne bez logowania (np. przeglądanie restauracji, menu, obsługa kodów QR).

Rozdzielenie to zwiększa bezpieczeństwo aplikacji oraz czytelność interfejsu API.

---

### Dekorator `@Public`

**Plik**: `src/decorators/public.decorator.ts`

```ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

```
Dekorator ```@Public()``` umożliwia oznaczenie endpointu jako publicznego, co powoduje pominięcie mechanizmu autoryzacji dla danego żądania.

### Dekorator `@CurrentUser`
**Plik**: `src/decorators/current-user.decorator.ts`

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```
Dekorator ```@CurrentUser()``` umożliwia dostęp do informacji o aktualnie uwierzytelnionym użytkowniku w metodach kontrolerów.

### Przykład użycia w kontrolerze

```ts
import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Public } from '@/decorators/public.decorator';

@Controller('restaurants')
export class RestaurantsController {

  @Get()
  async findAll(@CurrentUser() user: any) {
    // Endpoint prywatny – wymaga uwierzytelnienia
    return this.service.findByOwner(user.id);
  }

  @Get('public/:slug')
  @Public()
  async findPublic(@Param('slug') slug: string) {
    // Endpoint publiczny – bez logowania
    return this.service.findBySlug(slug);
  }
}
```

---

## 7. Deployment i CI/CD

### Hosting: Render 

Backend jest hostowany na platformie **Render** z automatycznym deploymentem po pushu do gałęzi main.

#### Dlaczego Render?

- ✅ Automatyczny deployment z GitHub
- ✅ Darmowy plan dla PostgreSQL
- ✅ Environment variables management
- ✅ Zero-downtime deployments

### Continuous Deployment (CD)

**Automatyczny deployment:**

1. Push do `main` → Deploy na **production**
2. Push do `develop` → Deploy na **staging**
3. Pull Request → Preview deployment

### GitHub Actions (CI)

**Polityka merge:**
- ❌ Merge zablokowany jeśli CI sfailuje
- ✅ Wszystkie testy muszą przejść
- ✅ Linting i formatowanie musi być prawidłówe

---

## 8. Development (Rozwój)

### Jak dodać nowy moduł?

#### 1. Generowanie boilerplate:

```bash
nest g module nazwa
nest g controller nazwa
nest g service nazwa
```

#### 2. Dodanie do app.module.ts:

```typescript
import { NazwaModule } from './modules/nazwa/nazwa.module';

@Module({
  imports: [
    // ...
    NazwaModule,
  ],
})
export class AppModule {}
```

### Jak dodać nowy endpoint?

#### Przykład krok po kroku:

**1. DTO (Validation):**

```typescript
// src/modules/restaurants/dto/create-restaurant.dto.ts
export class CreateRestaurantDto {
  @IsString()
  @MinLength(3)
  name: string;
  
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug: string;
}
```

**2. Service (Business Logic):**

```typescript
// src/modules/restaurants/services/restaurants.service.ts
@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}
  
  async create(dto: CreateRestaurantDto, ownerId: string) {
    return this.prisma.restaurant.create({
      data: {
        ...dto,
        ownerId,
      },
    });
  }
}
```

**3. Controller (HTTP):**

```typescript
// src/modules/restaurants/controllers/restaurants.controller.ts
@Controller('restaurants')
@UseGuards(ClerkAuthGuard)
export class RestaurantsController {
  constructor(private service: RestaurantsService) {}
  
  @Post()
  @ApiOperation({ summary: 'Create restaurant' })
  @ApiResponse({ status: 201, type: Restaurant })
  async create(
    @Body() dto: CreateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.service.create(dto, user.id);
  }
}
```

### Debugging

#### VS Code launch.json:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

#### Prisma Studio (GUI dla bazy):

```bash
npx prisma studio
```

Otwiera: http://localhost:5555

---

## 10. Troubleshooting (Częste Problemy)

### Problem: "Cannot connect to database"

```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Rozwiązanie:**

1. Sprawdź czy PostgreSQL działa:
   ```bash
   docker-compose ps
   # postgres powinien być "Up"
   ```

2. Sprawdź DATABASE_URL w `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tapnosh"
   ```

3. Restart Dockera:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

---

### Problem: "Prisma Client not generated"

```
Error: @prisma/client did not initialize yet
```

**Rozwiązanie:**

```bash
npm run prisma:generate
```

**Kiedy się to dzieje?**
- Po sklonowaniu repo
- Po zmianie `schema.prisma`
- Po `npm install` (czasem)

---

### Problem: "Migration failed"

```
Error: Migration failed to apply cleanly
```

**Rozwiązanie:**

1. **Development** (bezpieczne):
   ```bash
   npx prisma migrate reset  # Usuwa DB i stosuje wszystkie migracje
   npm run prisma:seed       # Przywraca dane początkowe
   ```

2. **Production** (ostrożnie!):
   - Ręcznie napraw konflikt w migracji
   - Lub stwórz nową migrację naprawiającą problem

---

### Problem: "Port 5432 already in use"

```
Error: bind: address already in use
```

**Rozwiązanie:**

1. Sprawdź co używa portu:
   ```bash
   lsof -i :5432
   ```

2. Zatrzymaj konfliktujący proces:
   ```bash
   # Jeśli to Docker
   docker-compose down
   
   # Jeśli to lokalny PostgreSQL
   sudo systemctl stop postgresql
   ```

3. Zmień port w docker-compose.yaml:
   ```yaml
   ports:
     - "5433:5432"  # Użyj 5433 lokalnie
   ```

---

## 9. Kontakt i Zasoby

### Repozytoria

- **Backend**: https://github.com/tapnosh/noshtap
- **Frontend**: https://github.com/tapnosh/tapnosh

### Dokumentacja zewnętrzna

- **NestJS**: https://docs.nestjs.com
- **Prisma**: https://www.prisma.io/docs
- **Clerk**: https://clerk.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs

### Swagger API

- **Local**: http://localhost:3333/

### Monitoring i Logi

- **Render Dashboard**: https://dashboard.render.com

### Kontakt do zespołu

- **Email**: tapnosh@gmail.com

---

**Data aktualizacji**: 14 stycznia 2025  
**Wersja dokumentacji**: 1.0