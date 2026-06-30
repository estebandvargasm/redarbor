# Prueba Técnica — Senior UI Developer @ Redarbor

App de búsqueda de empleos remotos. Construida como parte del proceso de selección para el cargo de **Senior UI Developer** en **Redarbor**. Consume la API pública de [Remotive](https://remotive.com/api).

---

## El reto

Construir una app en **3-5 días** que permita buscar empleos remotos, ver su detalle, guardar favoritos con persistencia local y aplicar a las ofertas. El stack requerido es **Expo SDK 52, React Native, TypeScript y Zustand**. La app debe correr en ambas plataformas con `npx expo start`.

---

## Requisitos vs Implementación

### Pantalla: Listado de Empleos

| Requisito | Implementación |
|-----------|---------------|
| Lista con logo, título, empresa, ubicación y fecha | `JobListItem.tsx` — tarjeta con imagen/placeholder, textos y corazón de favorito |
| Búsqueda por texto (título + empresa) | `TextInput` con filtro en `useMemo` que aplica `toLowerCase().includes()` sobre ambos campos |
| Filtro por categoría (`/categories`) | `FilterDropdown.tsx` alimentado por `fetchCategories()` desde el store |
| Filtro por tipo de empleo | Segundo `FilterDropdown` con valores únicos extraídos de `jobs.map(j => j.jobType)` |
| Indicador visual de favoritos | Ícono de corazón relleno (`heart`) vs contorno (`heart-outline`) con color `danger` |
| Pull-to-refresh | `FlatList` con `refreshing={status === 'loading'}` y `onRefresh={loadJobs}` |
| Estados: cargando | `ActivityIndicator` centrado con texto "Cargando empleos..." |
| Estados: error | Ícono `cloud-offline-outline` + mensaje del error |
| Estados: sin resultados | Ícono `briefcase-outline` + texto contextual (con/sin filtros activos) |

### Pantalla: Detalle de Empleo

| Requisito | Implementación |
|-----------|---------------|
| Logo de empresa | `Image` con `companyLogoUrl`, fallback a placeholder con ícono `business-outline` |
| Título, empresa, ubicación | Header con `jobTitle` y `companyName`, tarjeta de info con íconos |
| Categoría y tipo de empleo | Filas dentro de la tarjeta de info con íconos `pricetag-outline` y `briefcase-outline` |
| Salario (si disponible) | Fila condicional con ícono `cash-outline`, solo si `job.salary` existe |
| Fecha de publicación | Fila con `new Date(job.publicationDate).toLocaleDateString()` |
| Descripción HTML | `WebView` con `wrapHtml()` que inyecta CSS para dark mode, scroll de tablas e imágenes |
| Guardar/quitar favoritos | Botón fijo en bottom bar con animación de corazón (`AnimatedHeart`) |
| Aplicar al empleo | Botón "Aplicar ahora" que abre `job.applyUrl` con `expo-web-browser` |
| Compartir empleo | Header manual (`headerShown: false`) con botón de compartir que dispara `Share.share()` nativo |

### Pantalla: Favoritos

| Requisito | Implementación |
|-----------|---------------|
| Lista de favoritos guardados | `FlatList` con `JobListItem` reutilizado, datos de `useJobsStore().favorites` |
| Persistencia al cerrar la app | Zustand `persist` middleware con `AsyncStorage` como storage |
| Eliminar de favoritos | Mismo `toggleFavorite()` del store, togglea desde el corazón en la tarjeta |
| Navegar al detalle | `router.push(/job/[id])` al tocar la tarjeta, igual que en el listado |
| Estado vacío | Ícono `heart-outline` grande + "Sin favoritos aún" + instrucciones |

### Generales

| Requisito | Implementación |
|-----------|---------------|
| Expo SDK 52 | `expo ~52.0.49`, `expo-router ~4.0.22` |
| React Native + TypeScript | `react-native 0.76.9`, `typescript ~5.3.3`, strict mode |
| Zustand | Store único en `jobsStore.ts` con `create` + `persist` middleware |
| Corre en ambas plataformas | Compatible iOS y Android, safe areas con `react-native-safe-area-context` |
| Arquitectura reutilizable | `features/jobs/` domain-driven, `shared/` para componentes compartidos y tema |
| README con instrucciones | Este documento |

---

## Requisitos

| Qué | Versión | Para qué |
|-----|---------|----------|
| [Node.js](https://nodejs.org) | ≥ 18 | Runtime de JS |
| npm | ≥ 9 | Instalar dependencias |
| [Expo Go](https://expo.dev/go) _(opcional)_ | Última | Probar en celular sin compilar |
| Android Studio _(opcional)_ | Última | Emulador Android |
| Xcode _(opcional, solo macOS)_ | ≥ 15 | Simulador iOS |

---

## Instalación y ejecución

### 1. Clonar e instalar

```bash
git clone <url-del-repo>
cd app-busqueda-empleos
npm install
```

### 2. Arrancar el servidor de desarrollo

```bash
npx expo start
```

Esto abre el servidor Metro. Una vez corriendo, tienes estas opciones:

| Tecla | Qué hace |
|-------|----------|
| `a` | Abrir en Android Emulator |
| `i` | Abrir en iOS Simulator (solo macOS) |
| `w` | Abrir en navegador web |
| `r` | Recargar la app |
| `m` | Abrir menú de desarrollo |
| Escanear QR | Abrir en Expo Go (celular) |

### 3. Probar en tu celular (sin emulador)

1. Instala **Expo Go** desde la Play Store o App Store
2. Abre la app de cámara y escanea el código QR que sale en la terminal
3. La app se carga al instante

> Si Expo Go no puede conectarse, asegúrate de que el celular y la computadora estén en la misma red WiFi.

---

## Scripts disponibles

```bash
npm start              # Inicia Metro
npm run android        # Abre en Android Emulator
npm run ios            # Abre en iOS Simulator
npm run web            # Abre en navegador
npm test               # Ejecuta tests en modo watch
npx jest --no-watchAll # Una sola ejecución (CI)
npx tsc --noEmit       # Verifica tipos sin emitir JS
```

---

## Arquitectura

El proyecto combina dos patrones según el tipo de código:

### Arquitectura por features (`features/`)

Cada dominio de negocio se encapsula en su propio directorio con todo lo que necesita:

```
features/jobs/
├── components/    # UI específica del dominio (JobListItem)
├── services/      # Comunicación con APIs externas (remotiveApi)
├── state/         # Lógica de estado (Zustand store)
└── types/         # Tipos de datos del dominio (JobItem)
```

**Beneficios:** cohesión alta, acoplamiento bajo. Si mañana se agrega una feature de "notificaciones", va en `features/notifications/` sin tocar nada de `jobs/`. Cada feature es autónoma: el store exporta el hook, las pantallas lo consumen, los servicios son invisibles para la UI.

### Arquitectura por componentes compartidos (`shared/`)

Todo lo que usan múltiples features o que no pertenece a un dominio específico:

```
shared/
├── components/    # CustomTabBar, FilterDropdown, AnimatedHeart (agnósticos al dominio)
└── theme/         # Colors (tokens de diseño light/dark)
```

**Beneficios:** DRY sin sobre-ingeniería. Los componentes compartidos reciben props genéricas (`options`, `onSelect`) y no saben nada del dominio de empleos. `AnimatedHeart` encapsula la animación de favorito — se usa como `<AnimatedHeart onPress={...}><Icono/></AnimatedHeart>` sin exponer Reanimated al consumidor.

### Capa de rutas (`app/`)

Expo Router mapea el sistema de archivos a rutas automáticamente. Cada pantalla es un componente de React que consume los stores de Zustand directamente. No hay capa de "servicios de UI" ni ViewModels intermedios: las pantallas leen del store, renderizan y despachan acciones.

```
Pantalla → useJobsStore() → render
              ↕
         jobsStore (Zustand + AsyncStorage)
              ↕
         remotiveApi (Axios → Remotive API)
```

### Flujo de datos

```
API de Remotive
    ↓ axios.get
remotiveApi.ts (mapeo a JobItem[])
    ↓ fetchJobs()
jobsStore.ts (Zustand)
    ↓ useJobsStore()
Pantallas (index.tsx, favorites.tsx, [id].tsx)
    ↓ props
JobListItem, FilterDropdown, etc.
```

El store es la única fuente de verdad. Las pantallas no se pasan datos entre sí: cada una lee del store y navega por `id`. La persistencia de favoritos es transparente gracias al middleware `persist` de Zustand.

---

## Estructura del proyecto

```
src/
├── app/                        # Rutas (Expo Router — file-based)
│   ├── _layout.tsx             # Layout raíz (tema, status bar, UI del sistema)
│   ├── +not-found.tsx          # Pantalla 404
│   ├── (tabs)/                 # Tab navigator
│   │   ├── _layout.tsx         # Configuración de tabs + CustomTabBar
│   │   ├── index.tsx           # Listado de empleos con búsqueda y filtros
│   │   └── favorites.tsx           # Favoritos guardados
│   └── job/
│       └── [id].tsx            # Detalle de empleo (HTML + botones)
│
├── features/jobs/              # Feature de empleos (domain-driven)
│   ├── components/
│   │   └── JobListItem.tsx     # Tarjeta de empleo en la lista
│   ├── services/
│   │   └── remotiveApi.ts      # Cliente HTTP para la API de Remotive
│   ├── state/
│   │   └── jobsStore.ts        # Store global de Zustand con persistencia
│   └── types/
│       └── job.ts              # Tipado de JobItem
│
└── shared/                     # Código compartido
    ├── components/
    │   ├── AnimatedHeart.tsx    # Botón de favorito animado (spring)
    │   ├── CustomTabBar.tsx     # Tab bar flotante con indicador animado
    │   └── FilterDropdown.tsx  # Dropdown animado para filtros
    └── theme/
        └── Colors.ts           # Paleta de colores (light/dark)
```

---

## Stack técnico

| Dependencia | Rol |
|-------------|-----|
| **Expo SDK 52** | Plataforma, build, módulos nativos |
| **Expo Router v4** | Navegación basada en archivos (`app/` → rutas) |
| **React Native 0.76** | UI nativa |
| **TypeScript** | Tipado estático |
| **Zustand 5** | Estado global (empleos, favoritos, filtros) |
| **AsyncStorage** | Persistencia local de favoritos |
| **Axios** | Cliente HTTP para la API |
| **React Native Reanimated 3** | Animaciones (tab indicator, heart bounce, slide del dropdown) |
| **React Native WebView** | Renderizado de descripciones HTML |
| **React Native Safe Area Context** | Márgenes seguros para notch y home indicator |
| **Expo Web Browser** | Abrir URL de aplicación en navegador externo |
| **Expo System UI** | Color de fondo de la ventana nativa (evita flash blanco en modo oscuro) |
| **Ionicons** | Iconografía |

---

---

## Tests

El proyecto incluye **30 tests** en 4 suites, enfocados en la capa de lógica de negocio y componentes con estado o interacción:

Los tests priorizan la lógica de negocio (store y servicios) y los componentes interactivos clave, que son las áreas más propensas a errores y regresiones.

| Suite | Archivo | Tests | Qué cubre |
|---|---|---|---|
| `jobsStore` | `state/__tests__/jobsStore.test.ts` | 10 | toggle/add/remove favorites, carga con éxito/error, persistencia parcial |
| `remotiveApi` | `services/__tests__/remotiveApi.test.ts` | 6 | mapeo snake_case→camelCase, null→undefined, URLs, propagación de errores |
| `JobListItem` | `components/__tests__/JobListItem.test.tsx` | 7 | renderizado, logo/placeholder, corazón filled/outline, toggle fav, navegación |
| `FilterDropdown` | `shared/components/__tests__/FilterDropdown.test.tsx` | 7 | label/selected, apertura del sheet, opciones + "All", selección, checkmark |

### Ejecutar

```bash
npm test                 # Modo watch (interactivo)
npx jest --no-watchAll   # Una sola ejecución (CI)
npx tsc --noEmit         # Verifica tipos sin emitir JS
```

### Setup

| Herramienta | Rol |
|---|---|
| **Jest 29** | Test runner |
| **jest-expo** | Preset con mocks de React Native, Metro, fuentes |
| **@testing-library/react-native v12** | Renderizado de componentes, queries semánticos, fireEvent |
| **@types/jest** | Tipos globales (`jest.fn()`, `describe`, `expect`) |

Los tipos de Jest se cargan globalmente desde `jest.d.ts` en la raíz del proyecto, incluido en el `tsconfig`. Cada suite mockea sus dependencias externas en el propio archivo (Axios, AsyncStorage, Animated, expo-router).

### Estructura

```
src/
├── features/jobs/
│   ├── components/__tests__/JobListItem.test.tsx
│   ├── services/__tests__/remotiveApi.test.ts
│   └── state/__tests__/jobsStore.test.ts
└── shared/
    └── components/__tests__/FilterDropdown.test.tsx
```

---

## API

La app consume la API pública de [Remotive](https://remotive.com/api):

| Endpoint | Uso |
|----------|-----|
| `GET /remote-jobs` | Lista de empleos remotos |
| `GET /remote-jobs/categories` | Lista de categorías |

No requiere API key. El cliente HTTP está en `src/features/jobs/services/remotiveApi.ts`.

---

## Solución de problemas

### La app no carga en Expo Go
- Asegúrate de que el celular y la computadora estén en la misma red WiFi
- Prueba con `npx expo start --tunnel` si estás detrás de un firewall

### El modo oscuro no se aplica
- Revisa que el sistema operativo del celular esté en modo oscuro
- La app sigue la preferencia del sistema (`userInterfaceStyle: "automatic"`)

### La descripción HTML se ve mal
- Las ofertas de Remotive contienen HTML crudo con inline styles (a veces desde MS Word). La app lo envuelve con CSS propio para forzar legibilidad en ambos modos, scroll de tablas e imágenes responsivas.

### Error de dependencias
```bash
npx expo install --fix
```
Esto reinstala todas las dependencias con las versiones compatibles con Expo SDK 52.
