# StaKick - Polis 2013

Applicazione web per il conteggio delle partite di calcio con statistiche in tempo reale.

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
├── service-worker.js       # Service worker per PWA
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

## Licenza

ISC
