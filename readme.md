# 🤚 GloveReader JS

Transforms and filter vending machine excel files

### Build 📦

```
npm start        # local dev server
npm test         # unit tests
npm run lint     # eslint
npm run build    # type check + static site in dist/
```

`dist/` is a static site that can be served from any folder. Every push to `main` deploys it to GitHub Pages (see `.github/workflows/deploy.yml`).

### Config ⚙️

All config json files should be placed at `src/config` folder. Use one file for each config. f.i. `ALEMANYA.json`. Configs are bundled into the app at build time, so rebuild after changing them (new files must also be added to `src/Infrastructure/StaticConfigRepository.ts`).

```json
[
    {
        "id": "00333333",
        "items": [
            { "line": "1", "name": "ECOPU 7" },
            { "line": "2", "name": "ECOPU 8" },
            { "line": "3", "name": "ECOPU 9" },
            { "line": "4", "name": "ECOPU 10" },
            { "line": "5", "name": "JUBA 416 +7" },
            { "line": "6", "name": "JUBA 416 +8" },
            { "line": "7", "name": "PROTECTOR DIADEMA" },
            { "line": "8", "name": "TUFF JUBA 416 +9" },
            { "line": "9", "name": "GAFAS" },
            { "line": "10", "name": "MASCARILLA" }
        ]
    }
]
```

`id` stands for the machine 'Código Máquina' column, and `line` stands for 'D1-Línea' column. Multiples lines with same `name` will be grouped and summed as so.

### Use 💻

Open the web app and select your excel files. Everything is processed in the browser, files are never uploaded anywhere. Transformed files are downloaded by the browser.
