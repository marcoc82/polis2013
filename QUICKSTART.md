# Quick Reference Guide - Tailwind CSS Build

## 🚀 Comandi Rapidi

### Setup Iniziale (una volta sola)
```bash
npm install
```

### Build per Produzione
```bash
npm run build:css
```
Genera `dist/tailwind.css` minificato (~10KB)

### Sviluppo con Watch Mode
```bash
npm run watch:css
```
Rigenera automaticamente il CSS quando modifichi i file

## 📝 Quando Eseguire il Build

### ✅ DEVI eseguire `npm run build:css` quando:
- Aggiungi nuove classi Tailwind nei file HTML
- Prima di committare modifiche ai file HTML
- Prima di fare il deployment
- Dopo aver modificato `src/styles.css`
- Dopo aver aggiornato `tailwind.config.js`

### ❌ NON serve eseguire il build quando:
- Modifichi solo il JavaScript
- Modifichi solo il contenuto testuale dell'HTML (senza classi)
- Modifichi file che non usano Tailwind

## 📦 File Importanti

| File | Scopo | Versioning |
|------|-------|------------|
| `src/styles.css` | Sorgente CSS con direttive Tailwind | ✅ Git |
| `dist/tailwind.css` | CSS compilato e minificato | ✅ Git |
| `tailwind.config.js` | Configurazione Tailwind | ✅ Git |
| `package.json` | Dipendenze e script | ✅ Git |
| `package-lock.json` | Lock file dipendenze | ✅ Git |
| `node_modules/` | Dipendenze installate | ❌ No Git |

## 🔍 Troubleshooting Veloce

### Problema: Classi Tailwind non funzionano
**Soluzione:**
```bash
npm run build:css
```

### Problema: `dist/tailwind.css` non esiste
**Soluzione:**
```bash
npm install
npm run build:css
```

### Problema: CSS troppo vecchio
**Soluzione:**
```bash
rm dist/tailwind.css
npm run build:css
```

### Problema: Errore "tailwindcss command not found"
**Soluzione:**
```bash
npm install
```

## 📋 Checklist Pre-Commit

- [ ] Eseguito `npm run build:css`
- [ ] Testato localmente l'applicazione
- [ ] Verificato che `dist/tailwind.css` sia aggiornato
- [ ] Incluso `dist/tailwind.css` nel commit

## 📋 Checklist Pre-Deploy

- [ ] Eseguito `npm run build:css`
- [ ] Verificato dimensione `dist/tailwind.css` (~10KB)
- [ ] Testato l'applicazione con il CSS generato
- [ ] File HTML non contengono riferimenti al CDN
- [ ] Service worker aggiornato con la nuova versione

## 🎯 Struttura Progetto

```
polis2013/
├── src/
│   └── styles.css              # Sorgente: @tailwind directives
├── dist/
│   └── tailwind.css            # Output: CSS compilato
├── index.html                  # Include: ./dist/tailwind.css
├── polis v4.html               # Include: ./dist/tailwind.css
├── service-worker.js           # Cache: ./dist/tailwind.css
├── tailwind.config.js          # Config: file da scansionare
├── package.json                # Script: build:css, watch:css
└── README.md                   # Documentazione completa
```

## ⚡ Workflow Tipico

### Sviluppo
1. `npm run watch:css` (lascia in esecuzione)
2. Modifica i file HTML/CSS
3. Il CSS si rigenera automaticamente
4. Ricarica il browser per vedere le modifiche

### Deploy
1. `npm run build:css`
2. `git add .`
3. `git commit -m "Update styles"`
4. `git push`
5. Deploy su server

## 📞 Supporto

- **README.md** - Documentazione generale
- **DEPLOYMENT.md** - Guida al deployment
- **Questo file** - Quick reference

---
*Ultima modifica: Ottobre 2025*
