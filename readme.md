# 🤚 GloveReader JS
Transforms and filter vending machine excel files

### Build 📦
```
npm run electron:build
```

Use the `dist_electron\win-unpacked` version and execute it with `glovereaderjs.exe`.

### Config ⚙️

All config json files should be placed at `src/config` folder. Use one file for each config. f.i. `ALEMANYA.json`

```
[
    {
        "id" : "00333333",
        "items" : [
            {"line" : "1", "name" : "ECOPU 7"},
            {"line" : "2", "name" : "ECOPU 8"},
            {"line" : "3", "name" : "ECOPU 9"},
            {"line" : "4", "name" : "ECOPU 10"},
            {"line" : "5", "name" : "JUBA 416 +7"},
            {"line" : "6", "name" : "JUBA 416 +8"},
            {"line" : "7", "name" : "PROTECTOR DIADEMA"},
            {"line" : "8", "name" : "TUFF JUBA 416 +9"},
            {"line" : "9", "name" : "GAFAS"},
            {"line" : "10", "name" : "MASCARILLA"}
        ]
    }
]
```

`id` stands for the machine 'Código Máquina' column, and `line` stands for 'D1-Línea' column. Multiples lines with same `name` will be grouped and summed as so.

### Use 💻

Simply execute `glovereader.js` and upload your excel files. All transformed files should be placed at the same location.