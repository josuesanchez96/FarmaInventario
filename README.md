# Sistema de Inventario de Medicamentos (Full-Stack)

Un sistema web completo y moderno para la gestión e inventario de medicamentos en farmacias o centros de salud. Diseñado con arquitectura limpia (Clean Architecture, SOLID) y una experiencia de usuario (UX/UI) moderna con soporte para **Modo Oscuro persistente**, autenticación segura **JWT**, manejo explícito de **4 estados UX** (Loading, Empty, Error, Success), y consumo de una API REST propia desarrollada en Node.js/Express.

---

## 🚀 Tecnologías Utilizadas

### Backend (API REST)
- **Node.js** & **Express.js** (Arquitectura por Capas: Controladores, Servicios, Modelos, Middlewares y Rutas).
- **JSON Web Tokens (JWT)** para autenticación de usuarios y protección de endpoints.
- **Bcrypt.js** para el hashing de contraseñas de seguridad.
- **CORS** & **Dotenv** para configuración de entorno y origen cruzado.
- **In-Memory Repository** pre-cargado con datos iniciales (seed data) listos para usar inmediatamente.

### Frontend (SPA)
- **React 18** con **Vite** (Compilación ultrarrápida).
- **Tailwind CSS v3** con tema médico personalizado en paleta HSL Emerald/Teal y tarjetas Glassmorphic.
- **React Router v6** con Guardias de Rutas Protegidas (`ProtectedRoute`).
- **Lucide React** para iconografía moderna.
- **Context API**: `AuthContext`, `ThemeContext` (Persistencia de Dark Mode en `localStorage`), y `ToastContext` (Notificaciones emergentes).

---

## 📂 Estructura del Proyecto

```text
gestion_inventario/
├── backend/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   └── src/
│       ├── config/
│       │   └── jwt.js
│       ├── controllers/
│       │   ├── authController.js
│       │   └── medicamentoController.js
│       ├── middlewares/
│       │   ├── authMiddleware.js
│       │   └── validationMiddleware.js
│       ├── models/
│       │   ├── User.js
│       │   └── Medicamento.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── medicamentoRoutes.js
│       └── services/
│           ├── authService.js
│           └── medicamentoService.js
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── api.js                   # Cliente HTTP con Interceptor JWT
        ├── components/
        │   ├── common/
        │   │   ├── Button.jsx           # Botón reutilizable con Spinner
        │   │   ├── Input.jsx            # Input reutilizable con mensajes de error
        │   │   ├── Card.jsx             # Tarjeta Glassmorphic
        │   │   ├── Modal.jsx            # Modal accesible
        │   │   ├── Badge.jsx            # Insignia de estado de lote
        │   │   ├── Toast.jsx            # Toast emergente
        │   │   └── States.jsx           # Componentes UX (Loading, Empty, Error)
        │   └── layout/
        │       ├── Navbar.jsx           # Barra superior con selector de tema
        │       ├── Sidebar.jsx          # Menú lateral navegable
        │       ├── ProtectedRoute.jsx   # Guardia de sesión JWT
        │       └── MainLayout.jsx
        ├── context/
        │   ├── AuthContext.jsx          # Contexto de autenticación
        │   ├── ThemeContext.jsx         # Contexto de Dark Mode en localStorage
        │   └── ToastContext.jsx         # Contexto global de notificaciones
        ├── pages/
        │   ├── LoginPage.jsx            # Pantalla 1: Autenticación JWT
        │   ├── DashboardPage.jsx        # Pantalla 2: Métricas e indicadores KPI
        │   ├── MedicamentosListPage.jsx # Pantalla 3: Lista paginada y búsqueda
        │   ├── MedicamentoFormPage.jsx  # Pantalla 4: Formulario Crear/Editar
        │   └── SettingsPage.jsx         # Pantalla 5: Perfil y configuración de tema
        └── routes/
            └── AppRouter.jsx            # Router con rutas protegidas
```

---

## 🔑 Credenciales de Acceso por Defecto

El backend viene pre-configurado con 2 usuarios para pruebas inmediatas:

| Rol | Usuario | Contraseña |
|---|---|---|
| **Administrador** | `admin` | `admin123` |
| **Farmacéutico** | `farmaceutico` | `farmacia2026` |

---

## 🛠️ Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js** (Versión v18 o superior recomendada).
- **npm** (Incluido con Node.js).

---

### Paso 1: Configurar y Ejecutar el Backend

1. Abre una terminal y navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias del servidor:
   ```bash
   npm install
   ```

3. El archivo de variables de entorno `.env` ya viene creado. Si deseas verificarlo, su contenido es:
   ```env
   PORT=5050
   JWT_SECRET=super_secret_key_inventario_medicamentos_2026_jwt_token_auth
   NODE_ENV=development
   ```

4. Inicia el servidor backend en modo desarrollo:
   ```bash
   npm run dev
   ```
   *El backend estará corriendo en: `http://localhost:5050`*

---

### Paso 2: Configurar y Ejecutar el Frontend

1. Abre una **segunda ventana de terminal** y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias del frontend:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en: `http://localhost:3000` (el cual redirige automáticamente las peticiones `/api` hacia el backend en el puerto 5000).*

---

## 💻 Funcionalidades Principales y Pantallas

1. **Login (`/login`)**:
   - Autenticación con generación de token JWT (expira en 24h).
   - Botones de autorrelleno rápido con credenciales de prueba.
   - Validación de campos requeridos y mensaje de error en credenciales incorrectas.

2. **Dashboard (`/dashboard`)**:
   - Tarjetas KPI en tiempo real: Total de Medicamentos, Alertas de Stock Bajo (≤10 unidades), Próximos a Vencer (dentro de 60 días) y Vencidos.
   - Tabla con los 5 últimos medicamentos registrados/actualizados.
   - Acciones rápidas para filtrado directo.

3. **Listado de Medicamentos (`/medicamentos`)**:
   - Buscador dinámico por código, descripción o número de lote.
   - Filtros de estado (`Todos`, `Stock Bajo`, `Próximos a Vencer`, `Vencidos`).
   - Paginación dinámica (página actual / total páginas).
   - Modal de Vista Rápida de detalles del producto.
   - Modal de Confirmación de eliminación.
   - Manejo explícito de estados UX:
     - **Loading**: Skeletons animados durante la carga.
     - **Empty**: Ilustración vacía cuando no existen registros matching.
     - **Error**: Banner con botón *Reintentar*.
     - **Success**: Toasts informativos tras cada acción.

4. **Formulario Crear / Editar Medicamento (`/medicamentos/nuevo`, `/medicamentos/editar/:id`)**:
   - Validaciones estrictas:
     - Código único e irrepetible.
     - Cantidad entera no negativa (`≥ 0`).
     - Fecha de vencimiento válida.
     - Lote y Descripción obligatorios.
   - Notificación emergente toast al completar el registro o edición.

5. **Configuración / Perfil (`/configuracion`)**:
   - Datos del usuario logueado con avatar y rol.
   - Selector interactivo de **Modo Claro / Modo Oscuro** guardado en `localStorage`.
   - Diagnóstico en tiempo real de la conexión con la API REST Backend.

---

## 🔒 Seguridad y Buenas Prácticas

- **Middleware `authenticateToken`**: Protege los endpoints privados validando la firma del token JWT en el encabezado `Authorization: Bearer <token>`.
- **Axios / Fetch Interceptor (`api.js`)**: Inyecta automáticamente el token JWT en cada solicitud saliente desde el frontend y detecta respuestas `401/403` para forzar un logout limpio si la sesión expira.
- **Clean Architecture & SOLID**: Separación clara de responsabilidades entre Rutas, Controladores (Manejo HTTP), Servicios (Lógica de Negocio) y Modelos (Acceso a Datos).

---

## 📄 Licencia

Este proyecto fue desarrollado bajo la licencia **MIT** como un sistema demostrativo de nivel empresarial para evaluación Full-Stack.
