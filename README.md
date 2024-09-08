# crm-bridge

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

config
```
[
  {
    "name": "PB-DEV",
    "auth_url": "http://localhost:8090/login.html",
    "search_url": "http://localhost:8090/search_email?q=",
    "create_url": "http://localhost:8090/api/collections/contacts/records",
    "disabled": false
  },
  {
    "name": "PB",
    "auth_url": "https://crm.bf0.ch/login.html",
    "search_url": "https://crm.bf0.ch/search_email?q=",
    "create_url": "https://crm.bf0.ch/api/collections/contacts/records",
    "disabled": true
  },
  {
    "name": "EMBA",
    "search_url": "http://localhost:8000/api/search_email?q=",
    "create_url": [
      {
        "label": "EMBA Contact",
        "url": "",
        "mapping": {
          "firstname": "prenom",
          "lastname": "nom"
        }
      },
      {
        "label": "EMBA Participants",
        "url": ""
      },
      {
        "label": "EMBA Intervenant",
        "url": ""
      }
    ],
    "disabled": false
  }
]
```

contact
```
{
    _meta: {
        external_url: "",
        resource_url: "",
        fields: [],
        textarea: []
    },
    email,
    firstname,
    lastname,
    title,
    info
}
```