# Istruzioni per il Deployment

**Versione 3.0 - Progressive Web App (PWA)**

## Pre-requisiti per lo Sviluppo

Prima di lavorare sul progetto, è necessario:

1. **Installare Node.js** (versione 14 o superiore)
   - Scaricare da: https://nodejs.org/
   
2. **Installare le dipendenze**
   ```bash
   npm install
   ```

## Workflow di Sviluppo

### 1. Modalità Watch (Sviluppo Continuo)

Durante lo sviluppo, eseguire:

```bash
npm run watch:css
```

Questo comando:
- Monitora i file HTML e `src/styles.css`
- Rigenera automaticamente `dist/tailwind.css` ad ogni modifica
- Non minifica il CSS per facilitare il debug

### 2. Build per Produzione

Prima di committare o deployare:

```bash
npm run build:css
```

Questo comando:
- Genera `dist/tailwind.css` minificato e ottimizzato
- Include solo le classi Tailwind effettivamente utilizzate
- Produce un file CSS di circa 10KB

## Deployment

### Checklist Pre-Deployment

- [ ] Eseguire `npm run build:css`
- [ ] Verificare che `dist/tailwind.css` sia aggiornato
- [ ] Testare l'applicazione localmente
- [ ] Verificare che il service worker sia registrato correttamente
- [ ] Testare la funzionalità offline dell'app
- [ ] Verificare che il manifest.json sia valido
- [ ] Committare tutti i file necessari incluso `dist/tailwind.css`

### File Necessari per il Deployment

I seguenti file devono essere presenti sul server:

```
├── dist/
│   └── tailwind.css          # CSS generato (OBBLIGATORIO)
├── index.html                # Pagina principale
├── polis v4.html             # Pagina alternativa
├── service-worker.js         # Service worker per PWA (v3.0)
├── manifest.json             # Manifest PWA (OBBLIGATORIO per PWA)
├── firebase-app-modular.js   # Firebase SDK
├── logo-stakick.png          # Icona app (per PWA)
├── favicon-48x48.png         # Favicon (per PWA)
└── [altri file statici]      # Immagini, icone, audio, ecc.
```

### File NON Necessari per il Deployment

Questi file sono solo per lo sviluppo e NON devono essere deployati:

```
node_modules/         # Dipendenze npm (escluse da .gitignore)
src/                  # File sorgente CSS (usato solo per il build)
tailwind.config.js    # Configurazione Tailwind (solo per build)
package.json          # Metadata npm (solo per build)
package-lock.json     # Lock file npm (solo per build)
```

## Risoluzione Problemi

### Il CSS non si carica

1. Verificare che `dist/tailwind.css` esista
2. Eseguire `npm run build:css`
3. Verificare il path nel file HTML: `<link rel="stylesheet" href="./dist/tailwind.css">`

### Le classi Tailwind non funzionano

1. Verificare che i file HTML siano elencati in `tailwind.config.js`
2. Rigenerare il CSS: `npm run build:css`
3. Verificare che le classi siano presenti nel CSS generato:
   ```bash
   grep "nome-classe" dist/tailwind.css
   ```

### Il file CSS è troppo grande

Il CSS generato dovrebbe essere circa 10KB. Se è più grande:
1. Verificare che `--minify` sia presente nello script di build
2. Rimuovere classi inutilizzate dai file HTML

## Migrazione da CDN

### Prima (CDN)
```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Problemi:**
- Dipendenza da servizi esterni
- File CSS molto grande (~3MB)
- Non funziona offline
- Tempo di caricamento più lento

### Dopo (Build Locale)
```html
<link rel="stylesheet" href="./dist/tailwind.css">
```

**Vantaggi:**
- ✅ File CSS ottimizzato (10KB)
- ✅ Funziona completamente offline
- ✅ Nessuna dipendenza esterna
- ✅ Caricamento più veloce
- ✅ Migliore per SEO e performance

## Progressive Web App (PWA) v3.0

### Caratteristiche PWA

Dalla versione 3.0, StaKick è una PWA completa:

- **Installabile**: Gli utenti possono installare l'app sul dispositivo
- **Offline-first**: Funziona completamente offline grazie al service worker
- **Cache intelligente**: Risorse principali cached per caricamento istantaneo
- **Aggiornamenti automatici**: Il service worker gestisce automaticamente gli aggiornamenti
- **Standalone mode**: Si apre come app nativa senza browser UI

### File PWA Essenziali

1. **manifest.json**: Definisce metadata dell'app (nome, icone, colori, display mode)
2. **service-worker.js**: Gestisce cache e funzionamento offline (versione 3.0)
3. **Icone**: Logo dell'app in varie dimensioni per installazione

### Best Practice: Percorsi Relativi per GitHub Pages

Per garantire la compatibilità con GitHub Pages (es. `https://marcoc82.github.io/polis2013/`), tutti i riferimenti ai file statici utilizzano percorsi relativi **senza slash iniziale**:

**Configurazione corretta:**
- `manifest.json`: Usa `"src": "logo-stakick.png"` per le icone (192x192, 512x512, 500x500)
- `index.html`: Usa `href="logo-stakick.png"` per favicon e apple-touch-icon
- `service-worker.js`: Usa `'logo-stakick.png'` nell'array urlsToCache

**Esempi:**
- ✅ **Corretto**: `logo-stakick.png`, `manifest.json`, `favicon.ico`
- ❌ **Errato**: `/logo-stakick.png`, `/manifest.json`, `/favicon.ico`

Questa convenzione garantisce che l'app funzioni correttamente sia nella root del dominio che in sottocartelle.

### Testing PWA

Per testare la PWA localmente:

1. Servire l'app con un server HTTPS (PWA richiede HTTPS in produzione)
2. Aprire Chrome DevTools > Application > Service Workers
3. Verificare che il service worker sia registrato
4. Testare offline mode disabilitando la rete in DevTools
5. Verificare che l'app offra l'opzione di installazione

## Supporto

Per problemi o domande, fare riferimento a:
- README.md per documentazione generale
- https://tailwindcss.com/docs per documentazione Tailwind
