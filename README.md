# SELFIE

A webapp to help students with their studies and private life.

## Authors

- Samuele Musiani, samuele.musiani@studio.unibo.it, 1069143
  - Notes, Chat, Projects
- Lorenzo Peronese, lorenzo.peronese@studio.unibo.it, 1081726
  - Calendar, Pomodoro

## Project Structure

The project follows the standard [Nuxt.js](https://nuxt.com/) directory structure:

### Root Directory

- `app.config.ts` - Application configuration
- `app.vue` - Root Vue component
- `nuxt.config.ts` - Nuxt configuration file
- `tailwind.config.js` - Tailwind CSS configuration

### Core Directories

- `/components` - Reusable Vue components

  - `/calendar` - Calendar-related components (events, tasks, views)
  - `/chat` - Chat functionality components
  - `/notes` - Note-taking components
  - `/pomodoro` - Pomodoro timer components
  - `/projects` - Project management components
  - `/notifications` - Notification system components
  - `/tm` - Time machine components

- `/pages` - Application routes and pages

  - `/calendar` - Calendar views and event management
  - `/chat` - Chat interface
  - `/notes` - Note management interface
  - `/pomodoro` - Pomodoro timer
  - `/projects` - Project management pages
  - `/resources` - Resource management
  - `/login` and `/register` - User authentication

- `/server` - Backend implementation
  - `/api` - REST API endpoints
  - `/db` - Database models
  - `/middleware` - Server middleware (authentication, logging)
  - `/plugins` - Server-side plugins (db, websockets, background jobs, push notifications)
  - `/utils` - Utility functions

### Supporting Directories

- `/assets` - Static assets like CSS files
- `/layouts` - Page layouts (navbar)
- `/plugins` - Client-side plugins (toast, push notifications)
- `/public` - Public static files
  - `/music` - Audio files for notifications and pomodoro timer
  - `/worker.js` - Service worker implementation

### Type Definitions and Utilities

- `/types` - TypeScript type definitions
- `/utils` - Client-side utility functions (Date handling, Calendar operations, Local storage management, WebSocket communication, Worker thread utilities)

The project maintains a clear separation between client and server code, following
Nuxt.js conventions for full-stack development.

## Choice of Technology

The application leverages Nuxt.js as a full-stack powerful Vue.js framework with
built-in features like file-based routing, auto-imports and module system. MongoDB serves
as the database, chosen for its flexible document model that aligns well with
the application's data structure. This stack enables efficient development and
seamless full-stack JavaScript integration. The application is a PWA, providing
full functioning push notifications for both Apple and other devices.

## Use of AI

During development, GitHub Copilot was used to assist with boilerplate code generation,
though complex logic and core functionalities were manually implemented. Claude
provided support for debugging specific issues, while ChatGPT assisted in documentation
tasks. While these tools helped streamline certain aspects of development, the
majority of the project was developed through direct programming.

## Build

### MongoDB

Run the mongodb server:

```bash
docker run -p 27017:27017 \
    -e MONGODB_USERNAME="user" \
    -e MONGODB_PASSWORD="password" \
    -e ALLOW_EMPTY_PASSWORD=yes \
    -e MONGODB_DATABASE=tecweb \
        bitnami/mongodb:latest
```

Copy the `.env.example` into `.env` and `.env.local`. The user and the
password on the previous command have to match with the ones on the
`.env.local` file. `.env` is used for building.

### Building

We used the `just` CLI to manage the build process. To build the project, run:

```bash
just build
```
