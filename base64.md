# Come Convertire SVG in formato Base64

Per personalizzare le icone del chatbot, è necessario fornire i file SVG come stringhe base64. Ecco alcuni metodi semplici per ottenere questa conversione:

## Metodo 1: Utilizzando uno strumento online

Esistono numerosi strumenti online gratuiti che permettono di convertire file SVG in formato base64:

1. Vai su [Base64 Encoder](https://www.base64encode.org/) o siti simili
2. Carica il tuo file SVG o incolla il codice SVG
3. Esegui la conversione
4. Copia la stringa risultante
5. Aggiungi il prefisso `data:image/svg+xml;base64,` prima della stringa

## Metodo 2: Usando la console del browser

Puoi utilizzare la console del browser per eseguire rapidamente la conversione:

1. Apri la console di sviluppo nel tuo browser (F12 o Cmd+Option+I su Mac)
2. Incolla e esegui questo codice, sostituendo `tuoSvgString` con il contenuto del tuo file SVG:

```javascript
const svgString = `tuoSvgString`; // Incolla qui il contenuto del tuo SVG
const base64 = btoa(svgString);
console.log(`data:image/svg+xml;base64,${base64}`);
```

3. Copia la stringa risultante dalla console

## Metodo 3: Usando Node.js

Se preferisci usare Node.js:

```javascript
const fs = require('fs');
const path = require('path');

// Leggi il file SVG
const svgPath = path.join(__dirname, 'tuaIcona.svg');
const svgContent = fs.readFileSync(svgPath, 'utf-8');

// Converti in base64
const base64 = Buffer.from(svgContent).toString('base64');

// Output completo
console.log(`data:image/svg+xml;base64,${base64}`);
```

## Note importanti

- Assicurati che i file SVG siano ottimizzati (senza commenti o metadati inutili) per ridurre la dimensione della stringa risultante
- Verifica che gli SVG funzionino correttamente dopo la conversione testandoli in un tag `<img>` prima di usarli nella configurazione
- Se i tuoi SVG contengono caratteri speciali, potrebbero richiedere una codifica aggiuntiva prima della conversione in base64

Questa stringa base64 può poi essere utilizzata nella configurazione del chatbot:

```javascript
createChat({
  webhookUrl: 'YOUR_WEBHOOK_URL',
  icons: {
    openChat: 'data:image/svg+xml;base64,ABC123...', // La tua stringa base64
    // altre icone...
  }
});
```