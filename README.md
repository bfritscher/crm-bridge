# crm-bridge

This template should help get you started developing with Vue 3 in Vite.

https://aka.ms/olksideload

https://crm-bridge.bf0.ch/manifest.xml

 npx @microsoft/teamsapp-cli install --xml-path .\dist\manifest.xml

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
        "create_url": [
            {
                "url": "http://localhost:8090/api/collections/contacts/records"
            }
        ],
        "enabled": false
    },
    {
        "name": "PB",
        "auth_url": "https://crm.bf0.ch/login.html",
        "search_url": "https://crm.bf0.ch/search_email?q=",
        "create_url": [
            {
                "url": "https://crm.bf0.ch/api/collections/contacts/records"
            }
        ],
        "enabled": true
    },
    {
        "name": "EMBA-DEV",
        "auth_url": "http://localhost:8000/api/auth/login",
        "search_url": "http://localhost:8000/api/search_email?q=",
        "create_url": [
            {
                "label": "EMBA Contact",
                "url": "http://localhost:8000/api/contact/",
                "mapping": {
                    "firstname": "prenom",
                    "lastname": "nom"
                }
            },
            {
                "label": "EMBA Participants",
                "url": "http://localhost:8000/api/participant/",
                "mapping": {
                    "firstname": "prenom",
                    "lastname": "nom"
                }
            },
            {
                "label": "EMBA Intervenant",
                "url": "http://localhost:8000/api/intervenant/",
                "mapping": {
                    "firstname": "prenom",
                    "lastname": "nom"
                }
            }
        ],
        "enabled": false
    },
    {
        "name": "EMBA",
        "auth_url": "https://admin.myemba.ch/api/auth/login",
        "search_url": "https://admin.myemba.ch/api/search_email?q=",
        "create_url": [
            {
                "label": "EMBA Contact",
                "url": "https://admin.myemba.ch/api/contact/",
                "mapping": {
                    "firstname": "prenom",
                    "lastname": "nom"
                }
            },
            {
                "label": "EMBA Participants",
                "url": "https://admin.myemba.ch/api/participant/",
                "mapping": {
                    "firstname": "prenom",
                    "lastname": "nom"
                }
            },
            {
                "label": "EMBA Intervenant",
                "url": "https://admin.myemba.ch/api/intervenant/",
                "mapping": {
                    "firstname": "prenom",
                    "lastname": "nom"
                }
            }
        ],
        "enabled": true
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