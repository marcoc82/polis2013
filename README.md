# StaKick - Polis 2013

Applicazione web per il conteggio delle partite di calcio con statistiche in tempo reale.

**Versione 3.0 - Progressive Web App (PWA)**

## Caratteristiche PWA

Dalla versione 3.0, StaKick è una Progressive Web App completa con:

- 📱 **Installabile**: Può essere installata come app sul dispositivo
- 🔌 **Offline**: Funziona completamente offline grazie al service worker
- ⚡ **Veloce**: Risorse cached per caricamento istantaneo
- 🎨 **Standalone**: Si apre come app nativa senza la barra del browser

## Requisiti

- Node.js (versione 14 o superiore)
- npm (viene installato automaticamente con Node.js)

## Installazione

1. Clonare il repository:
```bash
git clone https://github.com/marcoc82/polis2013.git
cd polis2013
```

2. Installare le dipendenze:
```bash
npm install
```

## Build CSS

Il progetto utilizza Tailwind CSS come framework CSS. È necessario generare il file CSS prima di utilizzare l'applicazione.

### Build per Produzione

Per generare il file CSS minificato per la produzione:

```bash
npm run build:css
```

Questo comando:
- Legge il file sorgente `src/styles.css` contenente le direttive Tailwind
- Scansiona tutti i file HTML per identificare le classi utilizzate
- Genera un file CSS ottimizzato e minificato in `dist/tailwind.css`

### Sviluppo con Watch Mode

Durante lo sviluppo, è possibile utilizzare la modalità watch per rigenerare automaticamente il CSS quando i file vengono modificati:

```bash
npm run watch:css
```

Questo comando:
- Monitora i file HTML e il file `src/styles.css`
- Rigenera automaticamente `dist/tailwind.css` ogni volta che vengono rilevate modifiche
- Non minifica il CSS per facilitare il debugging

## Struttura del Progetto

```
polis2013/
├── src/
│   └── styles.css          # File sorgente CSS con direttive Tailwind
├── dist/
│   └── tailwind.css        # CSS compilato e minificato (generato)
├── index.html              # File HTML principale
├── manifest.json           # PWA manifest
├── service-worker.js       # Service worker per PWA (v3.0)
├── tailwind.config.js      # Configurazione Tailwind CSS
├── package.json            # Dipendenze e script npm
└── README.md               # Questo file
```

## Deployment

Prima di effettuare il deployment dell'applicazione:

1. Assicurarsi di aver eseguito `npm run build:css` per generare la versione minificata del CSS
2. Il file `dist/tailwind.css` deve essere committato nel repository
3. Assicurarsi che tutti i file necessari siano presenti (HTML, CSS, JavaScript, immagini, ecc.)

## Sviluppo

Per sviluppare l'applicazione localmente:

1. Eseguire `npm run watch:css` in un terminale per il watch del CSS
2. Aprire `index.html` in un browser
3. Modificare i file HTML o CSS secondo necessità
4. Il CSS verrà rigenerato automaticamente

## Note sulla Migrazione da CDN

Questo progetto è stato migrato dall'utilizzo del CDN Tailwind CSS (`https://cdn.tailwindcss.com`) a un processo di build locale. Vantaggi di questa migrazione:

- **Performance**: CSS minificato e ottimizzato contiene solo le classi effettivamente utilizzate
- **Affidabilità**: Non dipende da servizi esterni che potrebbero non essere disponibili
- **Offline**: L'applicazione funziona completamente offline grazie al service worker
- **Sicurezza**: Riduce la dipendenza da risorse esterne
- **Dimensioni**: Il file CSS finale è molto più piccolo del framework completo

## Progressive Web App (PWA)

Dalla versione 3.0, l'applicazione è una PWA completa:

- **Manifest**: `manifest.json` definisce nome, icone, colori e comportamento dell'app
- **Service Worker**: Cache intelligente delle risorse per funzionamento offline
- **Installabile**: Gli utenti possono installare l'app sul proprio dispositivo
- **Aggiornamenti automatici**: Il service worker gestisce automaticamente gli aggiornamenti

Per installare l'app:
1. Aprire l'applicazione in un browser compatibile (Chrome, Edge, Safari, ecc.)
2. Cercare l'opzione "Installa app" o "Aggiungi alla schermata home"
3. L'app verrà installata e funzionerà anche offline

### Best Practice: Percorsi Relativi per GitHub Pages

Per garantire la compatibilità con GitHub Pages (es. `https://marcoc82.github.io/polis2013/`), tutti i riferimenti ai file statici utilizzano percorsi relativi **senza slash iniziale**:

- ✅ **Corretto**: `logo-stakick.png`, `manifest.json`, `favicon.ico`
- ❌ **Errato**: `/logo-stakick.png`, `/manifest.json`, `/favicon.ico`

Questa convenzione si applica a:
- `manifest.json`: Icone dell'app (192x192, 512x512, 500x500)
- `index.html`: Favicon e apple-touch-icon
- `service-worker.js`: File da mettere in cache

## Licenza

ISC
