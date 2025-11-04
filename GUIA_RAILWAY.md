# 🚂 Guía para Desplegar en Railway

## Paso 1: Preparar Git (si aún no lo has hecho)

### 1.1 Inicializar Git
```bash
git init
```

### 1.2 Agregar todos los archivos
```bash
git add .
```

### 1.3 Hacer el primer commit
```bash
git commit -m "Primera versión del chat app"
```

## Paso 2: Crear repositorio en GitHub

### 2.1 Crear un nuevo repositorio en GitHub
1. Ve a [github.com](https://github.com) y crea una cuenta (o inicia sesión)
2. Haz clic en el botón **"New"** (o el botón "+" en la esquina superior derecha)
3. Dale un nombre a tu repositorio (ej: `chat-app`)
4. **NO** inicialices con README, .gitignore o licencia (ya los tienes)
5. Haz clic en **"Create repository"**

### 2.2 Conectar tu proyecto local con GitHub
GitHub te dará comandos similares a estos (reemplaza `TU_USUARIO` y `TU_REPOSITORIO`):

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

## Paso 3: Desplegar en Railway

### 3.1 Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Login"** o **"Start a New Project"**
3. Inicia sesión con GitHub (recomendado para facilitar el proceso)

### 3.2 Crear nuevo proyecto
1. Una vez dentro de Railway, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Autoriza Railway a acceder a tus repositorios de GitHub si te lo pide
4. Selecciona tu repositorio `chat-app` (o el nombre que le hayas puesto)

### 3.3 Configurar el servicio
Railway detectará automáticamente que es un proyecto Node.js y:
- ✅ Instalará las dependencias con `npm install`
- ✅ Ejecutará `npm start` automáticamente
- ✅ Usará el puerto de la variable `PORT` (Railway lo configura automáticamente)

**¡No necesitas configurar nada más!** Railway es muy inteligente.

### 3.4 Obtener tu URL pública
1. Una vez desplegado, Railway te dará una URL pública
2. Haz clic en el servicio → **"Settings"** → **"Generate Domain"**
3. O usa el dominio que Railway asigna automáticamente (ej: `tu-proyecto.up.railway.app`)

## Paso 4: Probar tu aplicación

1. Abre la URL que Railway te dio en tu navegador
2. Abre la misma URL en otra pestaña o dispositivo
3. Ingresa nombres diferentes en cada pestaña
4. ¡Chatea contigo mismo para probar que funciona! 💬

## 🔧 Configuración Opcional

### Variables de Entorno
Si necesitas configurar algo más adelante:
1. Ve a tu proyecto en Railway
2. **Settings** → **Variables**
3. Agrega variables de entorno si las necesitas

### Base de Datos Persistente
Railway reinicia los servicios periódicamente. Si quieres que la base de datos persista:
1. Railway tiene un servicio de **PostgreSQL** gratuito
2. O puedes usar un volumen persistente para SQLite
3. Por ahora, SQLite funciona bien para desarrollo

## 📝 Actualizar tu Aplicación

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Railway detectará automáticamente los cambios y redesplegará tu aplicación.

## ❓ Problemas Comunes

### El servicio no inicia
- Verifica que `package.json` tenga el script `"start": "node server.js"`
- Revisa los logs en Railway (haz clic en **"View Logs"**)

### No se conectan los mensajes
- Verifica que el puerto use `process.env.PORT` (ya lo tienes configurado ✅)
- Asegúrate de que Railway esté usando HTTPS (lo hace automáticamente)

### La base de datos se pierde
- Railway reinicia los servicios, así que SQLite se reinicia
- Para producción, considera usar PostgreSQL (Railway lo ofrece gratis)

---

**¡Listo! Tu chat estará disponible públicamente en Railway** 🎉

