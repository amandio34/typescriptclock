# 🌍 World Clock React

Ett React + TypeScript-projekt där man kan hålla reda på lokala tider i olika städer runt om i världen.  
Användaren kan lägga till städer, visa tiden både digitalt och analogt, samt öppna en detaljvy för varje stad.  
Projektet använder `worldtimeapi.org` för att hämta tidszoner och tider. Nedan är länken till skissen.

**Länk till skiss: https://www.figma.com/design/8LFCQkeG1MmtNXp6285GYw/Untitled?m=dev&t=htlcQjxdHNl11uqQ-1 **

---

## 📖 Loggbok

### Vecka 1
- Skapade repo och satte upp projektet med **Vite + React + TypeScript**.  
- Installerade och konfigurerade **Tailwind CSS** för styling.  
- Byggde komponenten `AddCityForm.tsx` där man kan skriva in stad, land och söka tidszon.  
- Skapade hooken `useLocalStorage` för att spara städer lokalt i webbläsaren.  
- Lade till lista av städer på startsidan där varje stad visas med en digital klocka.  
- Kopplade på `worldtimeapi.org` så tider hämtas live.  

### Vecka 2
- Implementerade `ClockCard.tsx` med möjlighet att växla mellan **digital** och **analog** klocka.  
- Fick analogklockans visare (timme, minut, sekund) att snurra i realtid.  
- Gjorde `CityPage.tsx` där en enskild stad kan visas i detaljvy med bakgrundsbild.  
- Lade till **ta bort-knapp** för städer.  
- Finslipade användarupplevelsen med sökbar tidszonslista, knapp för att rensa fält och responsiv design.  
- Dokumenterade arbetet och skrev README.  

---

## 📌 User stories
1. Som användare vill jag kunna lägga till en stad för att se den lokala tiden.  
2. Som användare vill jag kunna välja mellan digital och analog klocka för att se tiden på mitt sätt.  
3. Som användare vill jag kunna öppna en stad i en detaljvy med bakgrundsbild.  
4. Som användare vill jag att mina städer sparas i localStorage så jag slipper lägga in dem igen.  
5. Som användare vill jag kunna ta bort en stad jag inte längre behöver.  

---

## ⚡ Fördelar med TypeScript jämfört med JavaScript

1. **Tydliga typer för data (t.ex. `City`)**  
   Säkerställer att alla städer alltid har `id`, `name` och `timezone`.  
   I JavaScript hade jag kunnat missa fält av misstag.  

2. **Typade props och hooks**  
   Props till komponenter som `ClockCard` är strikt typade.  
   Jag får direkt fel om jag skickar fel data.  

3. **Bättre utvecklarstöd**  
   TypeScript ger autocomplete och varningar direkt i editorn.  
   Det minskar antalet buggar som annars bara skulle märkas vid körning i webbläsaren.  

---

## 🔧 Hur TypeScript transpileras till JavaScript

- Projektet körs med **Vite** som använder TypeScript-kompilatorn.  
- `.ts` och `.tsx`-filerna kompileras till **vanlig JavaScript** som webbläsaren kan förstå.  
- Alla typer tas bort i processen – de används bara för utveckling.  
- I `dist/`-mappen hamnar färdig JavaScript-, HTML- och CSS-kod som kan köras på vilken webbläsare som helst.  

---

## 🚀 Kör projektet

```bash
# Installera beroenden
npm install

# Starta utvecklingsserver
npm run dev

# Bygg för produktion
npm run build
