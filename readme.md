# 🧠 ghcli – GitHub CLI potenciado con IA

`ghcli` es una herramienta de línea de comandos diseñada para facilitar el trabajo con Git y GitHub, incluyendo generación automática de mensajes de *commit* usando OpenAI, clonación de repositorios, visualización del estado del repositorio y más.

> 🚀 Pensado para desarrolladores que quieren automatizar tareas comunes con un toque de inteligencia.

---

## 📦 Instalación

```bash
npm install -g @xhris-carrasc/ghcli@beta
````

> Asegúrate de tener [Node.js](https://nodejs.org/) instalado.

---

## 🧰 Comandos disponibles

Puedes ver todos los comandos disponibles con:

```bash
gh help
```

### 📘 Lista de comandos

| Comando             | Descripción                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `gh cl <url>`    | Lista tus repos de GitHub y permite clonar los que quieras.              |
| `gh config get-key` | Muestra la clave de OpenAI actual (enmascarada).                         |
| `gh config set-key` | Guarda tu clave de OpenAI para generación de commits.                    |
| `gh dir`            | Lista el contenido del directorio actual.                                |
| `gh help`           | Muestra todos los comandos disponibles.                                  |
| `gh oco`            | Genera y pushea un commit inteligente usando la API de OpenAI.           |
| `gh stash`          | Permite aplicar `git stash` a archivos seleccionados antes de un commit. |
| `gh status`         | Muestra el estado del repositorio Git actual.                            |

---

## 🤖 Commit inteligente con IA

Una de las funciones más potentes es la generación de mensajes de commit basados en los archivos modificados.

### 💡 Ejemplo:

```bash
gh oco
```

Este comando:

* Analiza los archivos en *staging* (`git add ...`)
* Usa OpenAI para generar un mensaje claro y conciso por cada archivo
* Genera un commit con todos los cambios, en un único commit con mensajes multilínea como este:

```
(AgNewsletterSection.vue): apply uppercase class to subtitle
(contacto.json): update email addresses
(libro/[...slug].vue): adjust text size for responsiveness
```

> Nota: Debes configurar tu clave de OpenAI antes de usarlo.

---

## 🔐 Configurar clave de OpenAI

```bash
gh config set-key <tu-api-key>
```

Puedes verificar si está configurada con:

```bash
gh config get-key
```

## 🧪 Versión beta

Esta herramienta está en desarrollo activo. Si quieres contribuir o reportar errores:

* [Repositorio GitHub](https://github.com/xhris-carrasc/ghcli) *(puedes ajustarlo si es privado o local)*
* `npm info @xhris-carrasc/ghcli`

---

## 🧪 Desarrollo local

Si estás desarrollando y quieres probar localmente:

```bash
npm link
gh help
```

Para deshacer el enlace:

```bash
npm unlink -g
```

---

## ⚖️ Licencia

MIT © [@xhris-carrasc](https://github.com/xhris-carrasc)

```
