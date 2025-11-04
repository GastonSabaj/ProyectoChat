# 💬 Aplicación de Chat en Tiempo Real

Una aplicación de chat moderna construida con Node.js, Express, Socket.IO y SQLite que permite comunicarse en tiempo real entre múltiples usuarios en diferentes computadoras.

## 🚀 Características

- ✅ Chat en tiempo real usando WebSockets (Socket.IO)
- ✅ Múltiples salas de chat
- ✅ Persistencia de mensajes (SQLite)
- ✅ Indicador de usuarios escribiendo
- ✅ Lista de usuarios conectados
- ✅ Interfaz moderna y responsive
- ✅ Fácil de desplegar en servidores

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (viene incluido con Node.js)

## 🛠️ Instalación y Configuración Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar el servidor

```bash
npm start
```

O para desarrollo con recarga automática:

```bash
npm run dev
```

### 3. Acceder a la aplicación

Abre tu navegador y ve a: `http://localhost:3000`

## 📱 Cómo Usar

1. **Ingresa tu nombre**: Escribe un nombre de usuario cuando entres a la aplicación
2. **Selecciona una sala**: Elige la sala de chat (por defecto "Sala General")
3. **Envía mensajes**: Escribe y presiona Enter para enviar mensajes
4. **Cambia de sala**: Usa el selector en la parte superior para cambiar de sala
5. **Salir**: Haz clic en el botón "Salir" para desconectarte

## 🌐 Despliegue en Servidor

Puedes desplegar esta aplicación en varios servicios. Aquí te muestro las opciones más populares:

### Opción 1: Railway (Recomendado - Gratis)

1. **Crea una cuenta** en [Railway.app](https://railway.app)
2. **Conecta tu repositorio** de GitHub
3. **Crea un nuevo proyecto** desde tu repositorio
4. **Configura el servicio**:
   - Railway detectará automáticamente que es un proyecto Node.js
   - El puerto se configurará automáticamente desde la variable `PORT`
5. **Despliega**: Railway desplegará automáticamente tu aplicación

**Nota**: Railway te dará una URL pública (ej: `tu-app.railway.app`) que puedes compartir.

### Opción 2: Render (Gratis)

1. **Crea una cuenta** en [Render.com](https://render.com)
2. **Nuevo Web Service** → Conecta tu repositorio
3. **Configuración**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. **Despliega**: Render creará una URL pública para tu aplicación

### Opción 3: Heroku

1. **Instala Heroku CLI** desde [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)
2. **Crea una cuenta** en Heroku
3. **Login**:
   ```bash
   heroku login
   ```
4. **Crea la aplicación**:
   ```bash
   heroku create tu-app-chat
   ```
5. **Despliega**:
   ```bash
   git push heroku main
   ```

### Opción 4: Vercel (Requiere ajustes)

Vercel requiere una configuración especial para WebSockets. Puedes usar el plan Pro o considerar otras opciones.

### Opción 5: DigitalOcean / AWS / Google Cloud

Para servidores VPS, puedes usar PM2 para mantener el proceso corriendo:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación con PM2
pm2 start server.js --name chat-app

# Guardar configuración
pm2 save

# Configurar PM2 para iniciar al arrancar el servidor
pm2 startup
```

## 🔧 Configuración de Variables de Entorno

Puedes crear un archivo `.env` para configurar el puerto:

```env
PORT=3000
```

El servidor usará el puerto especificado en la variable de entorno `PORT`, o 3000 por defecto.

## 📁 Estructura del Proyecto

```
chat-app/
├── public/
│   ├── index.html      # Interfaz principal
│   ├── styles.css      # Estilos CSS
│   └── app.js          # Lógica del cliente
├── server.js           # Servidor Node.js con Socket.IO
├── package.json        # Dependencias del proyecto
├── database.db         # Base de datos SQLite (se crea automáticamente)
└── README.md          # Este archivo
```

## 🗄️ Base de Datos

La aplicación usa SQLite para almacenar mensajes. La base de datos se crea automáticamente al iniciar el servidor.

**Tablas**:
- `messages`: Almacena todos los mensajes enviados
- `rooms`: Almacena las salas disponibles

## 🔌 API Endpoints

- `GET /` - Página principal
- `GET /api/messages/:room` - Obtener mensajes de una sala
- `GET /api/rooms` - Obtener todas las salas disponibles

## 🎯 Eventos Socket.IO

### Cliente → Servidor:
- `join-room`: Unirse a una sala
- `send-message`: Enviar un mensaje
- `typing`: Indicar que el usuario está escribiendo

### Servidor → Cliente:
- `receive-message`: Recibir un nuevo mensaje
- `previous-messages`: Recibir mensajes anteriores
- `user-joined`: Usuario se unió a la sala
- `user-left`: Usuario salió de la sala
- `user-typing`: Usuario está escribiendo
- `users-in-room`: Lista de usuarios en la sala

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Verifica que las dependencias estén instaladas: `npm install`

### No se conectan los mensajes en tiempo real
- Verifica que el puerto no esté bloqueado por un firewall
- En producción, asegúrate de que WebSockets estén habilitados

### La base de datos no se crea
- Verifica que la carpeta tenga permisos de escritura
- En producción, algunas plataformas requieren configuración adicional para SQLite

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de hacer un fork y crear un pull request.

---

**¡Disfruta chateando! 💬**
