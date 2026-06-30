# App Búsqueda de Empleos

App de búsqueda de empleos remotos. Consume la API pública de [Remotive](https://remotive.com/api) y permite buscar, filtrar, guardar favoritos y aplicar a ofertas de trabajo.

<p align="center">
  <img src="./src/assets/images/icon.png" width="120" />
</p>

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

### 4. Compilar para producción

```bash
# APK de Android
npx eas build -p android --profile preview

# IPA de iOS (requiere Apple Developer Program)
npx eas build -p ios
```

---

## Scripts disponibles

```bash
npm start          # Inicia Metro
npm run android    # Abre en Android Emulator
npm run ios        # Abre en iOS Simulator
npm run web        # Abre en navegador
npm test           # Ejecuta tests
```

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
│   │   └── favoritesScreen.tsx # Favoritos guardados
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
    │   ├── CustomTabBar.tsx     # Tab bar flotante con indicador animado
    │   └── FilterDropdown.tsx  # Dropdown animado para filtros
    ├── hooks/
    │   └── useHeartAnimation.ts # Hook de animación del botón de favorito
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

## Funcionalidades

### Listado de empleos
- Búsqueda por texto (título o empresa)
- Filtro por categoría y tipo de trabajo con dropdowns animados
- Pull-to-refresh para recargar
- Botón de favorito con animación de escala

### Detalle de empleo
- Logo, título y empresa
- Tarjeta de info con ubicación, tipo, categoría, fecha y salario
- Descripción HTML completa con soporte para modo oscuro
  - Tablas de MS Office con scroll horizontal individual
  - Imágenes con fondo blanco para visibilidad en modo oscuro
  - Colores de texto forzados para legibilidad
- Botón **Aplicar ahora** fijo en la parte inferior (abre navegador externo)
- Botón de **Favorito** fijo con animación de corazón
- Botón de **Compartir** en la barra superior (share sheet nativo)

### Favoritos
- Persistencia local con AsyncStorage
- Vista dedicada con lista de empleos guardados
- Se puede agregar o quitar desde cualquier pantalla

### UX/UI
- Modo oscuro automático (respeta la configuración del sistema)
- Tab bar flotante con indicador animado (spring physics)
- Transiciones nativas entre pantallas
- Safe areas en iPhone con notch y Android con navigation bar
- Estados de carga, error y vacío en todas las pantallas

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
- El HTML viene de MS Office/Word en muchas ofertas. La app lo sanitiza con CSS forzado para que sea legible en ambos modos

### Error de dependencias
```bash
npx expo install --fix
```
Esto reinstala todas las dependencias con las versiones compatibles con Expo SDK 52.
