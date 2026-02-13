// Campus Impact Simulator - Game Logic (Version 3 - With Hotspots & Interaction)



const game = {
    // Globale Roche-Basiswerte (Big Picture)
    // Diese Werte dienen als Ausgangspunkt für jedes Szenario
    globalBaseStats: {
        satisfaction: 6.5, // Aktueller Roche-Standard (Zufriedenheit)
        productivity: 7.0, // Aktueller Roche-Standard (Produktivität)
        fluctuation: 12.5  // Aktueller Roche-Standard (Fluktuation in %)
    },

    currentScenario: null,
    selectedObject: null,
    placedObjects: [],
    mousePos: { x: 0, y: 0 },
    canvas: null,
    ctx: null,
    collaborationBonus: false,
    backgroundImage: null,

character: {
        x: 600,
        y: 400,
        targetX: 600,
        targetY: 400,
        speed: 2,
        image: null,
        isLoaded: false,
        size: 60
    },

// NEU: Speichert den Zustand der Pfeiltasten
    keys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    },
    
scenarios: {
        overview: {
            name: "Campus Cockpit",
            stakeholder: "Zentrales Monitoring",
            map: { 
                width: 1200, 
                height: 800, 
                background: '#1a1a2e', 
                image: 'mob_map2.png' 
            },
            relatedStakeholders: [],
            hotspots: [
                { x: 325, y: 190, w: 170, h: 50, label: "PARKHAUS NORD", details: "Belegung: 742 / 1000\nE-Ladestationen: 1/5" },
                { x: 405, y: 530, w: 104, h: 50, label: "FOKUS-ZONE B1", details: "Belegung: 18 / 24 Tische\nTemperatur: 23°\nLuftfeuchtigkeit: 40%" },
                { x: 740, y: 298, w: 75, h: 165, label: "RESTAURANT-LIVE", details: "Verkaufte Menüs: 142 Stück\nDavon Vegi: 66\nDavon Fleisch: 76" }
            ],
            positiveObjects: [], 
            negativeObjects: [],
            nudges: ["Willkommen im Live-Cockpit. Hier siehst du alle Campus-Daten auf einen Blick."]
        },
        mobility: {
            name: "Mobility",
            stakeholder: "Fläche: 12000 m2",
            map: { width: 1200, height: 800, background: '#4a6741', image: 'mobility-map.png' },
            relatedStakeholders: ["Site Experience Management", "REAM", "Facility Coordinators", "New Joiner SPOC", "Business Partners", "Onsite Services"],
            // hotspots: [{ x: 180, y: 150, w: 200, h: 70, label: "PARKHAUS NORD", details: "Belegung: 742 / 1000\nE-Ladestationen: 1/5" }],
            positiveObjects: [
{ id: 1, name: "Bus (Shuttle)", icon: "🚌", satisfaction: 3, productivity: 1, fluctuation: -3, revenue: 60000, cost: 100000 },
                { id: 2, name: "Bushaltestelle", icon: "🚏", satisfaction: 1, productivity: 0, fluctuation: -1, revenue: 15000, cost: 3000 },
                { id: 3, name: "Fahrradstation", icon: "🚲", satisfaction: 2, productivity: 1, fluctuation: -2, revenue: 25000, cost: 5000 },
                { id: 4, name: "Motorrad-Parking", icon: "🏍️", satisfaction: 1, productivity: 0, fluctuation: -1, revenue: 15000, cost: 8000 },
                { id: 5, name: "E-Ladestation", icon: "🔌", satisfaction: 2, productivity: 0, fluctuation: -2, revenue: 30000, cost: 35000 },
                { id: 6, name: "Objekt entfernen", icon: "❌", satisfaction: 0, productivity: 0, fluctuation: 0, revenue: 0, cost: 0 }
            ],
            negativeObjects: [{ id: 6, name: "Objekt entfernen", icon: "❌", satisfaction: -1, productivity: -1, fluctuation: -1, revenue: -1000 }],
            nudges: ["Daten zeigen: 35% der Mitarbeiter nutzen den Shuttle.", "Analyse: E-Ladestationen erhöhen Zufriedenheit um durchschnittlich 12%"]
        },
        workplace: {
            name: "Workplace",
            stakeholder: "Fläche: 1200 m2  Renoviert: 04.03.2016",
            map: { width: 1200, height: 800, background: '#5a5a7a', image: 'workplace-map.png' },
            relatedStakeholders: ["Site Experience Management", "REAM", "Facility Coordinators", "Health & Wellbeing", "Managed Spaces", "Business Partners", "Onsite Services"],
            //hotspots: [{ x: 370, y: 150, w: 200, h: 100, label: "FOKUS-ZONE B1", details: "Belegung: 18 / 24 Tische\nTemperatur: 23°\nLuftfeuchtigkeit: 40%" }],
            positiveObjects: [
{ id: 1, name: "Pflanzenwand", icon: "🌿", satisfaction: 2, productivity: 1, fluctuation: -2, revenue: 40000, cost: 25000 },
                { id: 2, name: "Ergo-Tisch (Set)", icon: "🖥️", satisfaction: 1, productivity: 3, fluctuation: -3, revenue: 70000, cost: 8000 },
                { id: 3, name: "Moderne Lampe", icon: "💡", satisfaction: 1, productivity: 2, fluctuation: -1, revenue: 35000, cost: 15000 },
                { id: 4, name: "Akustik-Paneel", icon: "🔇", satisfaction: 2, productivity: 3, fluctuation: -2, revenue: 60000, cost: 18000 },
                { id: 5, name: "Lounge-Bereich", icon: "🛋️", satisfaction: 3, productivity: 1, fluctuation: -3, revenue: 50000, cost: 45000 },
                { id: 6, name: "Objekt entfernen", icon: "❌", satisfaction: 0, productivity: 0, fluctuation: 0, revenue: 0, cost: 0 }
            ],
            negativeObjects: [{ id: 6, name: "Objekt entfernen", icon: "❌", satisfaction: -1, productivity: -1, fluctuation: -1, revenue: -1000 }],
            nudges: ["Daten zeigen: Fokus-Zonen im 3. Stock haben Lärmbeschwerden halbiert."]
        },
        tavero: {
            name: "Tavero",
            stakeholder: "Fläche: 450 m2   Renoviert: 23.08.2023",
            map: { width: 1200, height: 800, background: '#6b4423', image: 'tavero-map.png' },
            relatedStakeholders: ["Site Experience Management", "REAM", "Facility Coordinators", "Health & Wellbeing", "Managed Spaces", "Business Partners"],
            //hotspots: [{ x: 650, y: 680, w: 250, h: 120, label: "RESTAURANT-LIVE", details: "Verkaufte Menüs: 142 Stück\nDavon Vegi:66\nDavon Fleisch: 76" }],
            positiveObjects: [
{ id: 1, name: "Front-Cooking", icon: "👨‍🍳", satisfaction: 3, productivity: 1, fluctuation: -2, revenue: 100000, cost: 200000 },
                { id: 2, name: "Salatbuffet", icon: "🥗", satisfaction: 2, productivity: 0, fluctuation: -1, revenue: 45000, cost: 15000 },
                { id: 3, name: "Self-Checkout Kasse", icon: "💳", satisfaction: 2, productivity: 2, fluctuation: -2, revenue: 60000, cost: 20000 },
                { id: 4, name: "Lounge", icon: "🛋️", satisfaction: 2, productivity: 1, fluctuation: -2, revenue: 35000, cost: 60000 },
                { id: 5, name: "Veggie-Menü", icon: "🥦", satisfaction: 2, productivity: 0, fluctuation: -2, revenue: 40000, cost: 10000 },
                { id: 6, name: "Objekt entfernen", icon: "❌", satisfaction: 0, productivity: 0, fluctuation: 0, revenue: 0, cost: 0 }
            ],
            negativeObjects: [{ id: 6, name: "Objekt entfernen", icon: "❌", satisfaction: -1, productivity: -1, fluctuation: -1, revenue: -1000 }],
            nudges: ["Umfrage: Vegetarische Optionen sind der meistgewünschte Verbesserungsvorschlag"]
        }
    },

init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Charakter-Bild laden
    this.character.image = new Image();
    this.character.image.onload = () => { this.character.isLoaded = true; };
    this.character.image.src = 'Character.png'; // Pfad zu deinem PNG

    this.setupEventListeners();
    this.updateMetrics();
    
    // Start der Animations-Schleife
    requestAnimationFrame(() => this.gameLoop());
    },

setupEventListeners() {
        // 1. Szenario-Auswahl im Menü
        document.querySelectorAll('.scenario-card.active').forEach(card => {
            card.addEventListener('click', () => {
                const scenario = card.getAttribute('data-scenario');
                this.startScenario(scenario);
            });
        });

        // 2. Canvas-Interaktionen (Klicken & Bewegen)
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (this.currentScenario && this.currentScenario.hotspots) {
                const spot = this.currentScenario.hotspots.find(s => 
                    x > s.x && x < s.x + s.w && y > s.y && y < s.y + s.h
                );
                if (spot) {
                    this.showLiveData(spot);
                    return;
                }
            }
            this.placeObject(e);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos.x = e.clientX - rect.left;
            this.mousePos.y = e.clientY - rect.top;
            this.drawMap();
        });

        // 3. Objekt-Auswahl in der Sidebar
        document.addEventListener('click', (e) => {
            const item = e.target.closest('.object-item');
            if (item) {
                this.selectObject(item);
            }
        });

        // 4. TASTATUR-STEUERUNG (Hier liegen sie richtig: Eigenständig in setupEventListeners)
        window.addEventListener('keydown', (e) => {
            if (this.keys && e.key in this.keys) {
                this.keys[e.key] = true;
                e.preventDefault(); // Verhindert das Scrollen des Browsers
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys && e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    },

    startScenario(scenarioId) {
        this.currentScenario = this.scenarios[scenarioId];
        this.placedObjects = [];
        this.selectedObject = null;
        this.collaborationBonus = false;

        this.canvas.width = this.currentScenario.map.width;
        this.canvas.height = this.currentScenario.map.height;

        if (this.currentScenario.map.image) {
            this.backgroundImage = new Image();
            this.backgroundImage.onload = () => this.drawMap();
            this.backgroundImage.src = this.currentScenario.map.image;
        } else {
            this.backgroundImage = null;
            this.drawMap();
        }

        document.getElementById('menuScreen').style.display = 'none';
        document.getElementById('gameScreen').classList.add('active');
        this.populateObjects();
        this.updateMetrics();
    },

    drawMap() {
        if (!this.currentScenario) return;
        const mapConfig = this.currentScenario.map;
        
        // 1. Hintergrund
        if (this.backgroundImage && this.backgroundImage.complete) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, mapConfig.width, mapConfig.height);
        } else {
            this.ctx.fillStyle = mapConfig.background;
            this.ctx.fillRect(0, 0, mapConfig.width, mapConfig.height);
        }

        // 2. Hotspots (Gelb leuchtend)
        let isAnyHotspotHovered = false;
        if (this.currentScenario.hotspots) {
            this.currentScenario.hotspots.forEach(spot => {
                const isHovering = this.mousePos.x > spot.x && 
                                   this.mousePos.x < spot.x + spot.w &&
                                   this.mousePos.y > spot.y && 
                                   this.mousePos.y < spot.y + spot.h;

                if (isHovering) {
                    isAnyHotspotHovered = true;
                    this.ctx.fillStyle = "rgba(0, 217, 255, 0.3)";
                    this.ctx.strokeStyle = "#00d9ff";
                } else {
                    this.ctx.fillStyle = "rgba(255, 255, 0, 0.25)"; 
                    this.ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
                }

                this.ctx.fillRect(spot.x, spot.y, spot.w, spot.h);
                this.ctx.setLineDash([5, 5]);
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(spot.x, spot.y, spot.w, spot.h);
                this.ctx.setLineDash([]); 
            });
        }

        this.canvas.style.cursor = isAnyHotspotHovered ? 'pointer' : 'crosshair';

        // 3. UI & Objekte
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(20, 20, 300, 60);
        this.ctx.fillStyle = '#00d9ff';
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText(this.currentScenario.name.toUpperCase(), 35, 55);

        this.placedObjects.forEach(obj => this.drawObject(obj.x, obj.y, obj.data));

// NEU: Charakter hier zeichnen (nach den Objekten, damit er darüber läuft)
        if (this.character.isLoaded && this.currentScenario && this.currentScenario.name !== "Campus Cockpit") {
            this.ctx.drawImage(
                this.character.image, 
                this.character.x - this.character.size / 2, 
                this.character.y - this.character.size / 2, 
                this.character.size, 
                this.character.size
            );
        }

        if (this.selectedObject) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.4;
            this.drawObject(this.mousePos.x, this.mousePos.y, this.selectedObject);
            this.ctx.restore();
        }
    },

    populateObjects() {
        const pos = document.getElementById('positiveObjects');
        const neg = document.getElementById('negativeObjects');
        pos.innerHTML = ''; neg.innerHTML = '';
        this.currentScenario.positiveObjects.forEach(obj => pos.appendChild(this.createObjectElement(obj, 'positive')));
        this.currentScenario.negativeObjects.forEach(obj => neg.appendChild(this.createObjectElement(obj, 'negative')));
    },

    createObjectElement(obj, type) {
        const div = document.createElement('div');
        div.className = `object-item ${type}`;
        div.dataset.objectId = obj.id;
        div.dataset.objectType = type;
        div.innerHTML = `<div class="object-icon">${obj.icon}</div><div class="object-name">${obj.name}</div>`;
        return div;
    },

    selectObject(element) {
        document.querySelectorAll('.object-item').forEach(i => i.classList.remove('selected'));
        element.classList.add('selected');
        const list = element.dataset.objectType === 'positive' ? this.currentScenario.positiveObjects : this.currentScenario.negativeObjects;
        this.selectedObject = list.find(o => o.id === parseInt(element.dataset.objectId));
    },

    placeObject(e) {
        if (!this.selectedObject) return;
        const rect = this.canvas.getBoundingClientRect();
        this.placedObjects.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, data: this.selectedObject });
        this.drawMap();
        this.updateMetrics();
        this.selectedObject = null;
        document.querySelectorAll('.object-item').forEach(i => i.classList.remove('selected'));
    },

    drawObject(x, y, obj) {
        this.ctx.fillStyle = obj.satisfaction > 0 ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 107, 107, 0.5)';
        this.ctx.beginPath(); this.ctx.arc(x, y, 30, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 2; this.ctx.stroke();
        this.ctx.font = '28px Arial'; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
        this.ctx.fillText(obj.icon, x, y);
    },

updateMetrics() {
        // 1. Basis-Werte als Startpunkt definieren
        let s = this.globalBaseStats.satisfaction;
        let p = this.globalBaseStats.productivity;
        let f = this.globalBaseStats.fluctuation;
        let totalRevenue = 0;
        let totalInvestment = 0;

        // 2. Nur rechnen, wenn ein Szenario aktiv ist und Objekte platziert wurden
        if (this.currentScenario && this.placedObjects.length > 0) {
            this.placedObjects.forEach(o => {
                s += o.data.satisfaction * 0.1;
                p += o.data.productivity * 0.1;
                f += o.data.fluctuation * 0.05;
                totalRevenue += o.data.revenue;
                totalInvestment += (o.data.cost || 0);
            });
        }

        // 3. Netto-Gewinn berechnen
        const netProfit = totalRevenue - totalInvestment;

        // 4. Werte in das HTML schreiben
        const satEl = document.getElementById('satisfactionScore');
        const prodEl = document.getElementById('productivityScore');
        const flucEl = document.getElementById('fluctuationScore');
        const revEl = document.getElementById('revenueScore');

        if (satEl) satEl.textContent = Math.max(0, Math.min(10, s)).toFixed(1);
        if (prodEl) prodEl.textContent = Math.max(0, Math.min(10, p)).toFixed(1);
        if (flucEl) flucEl.textContent = Math.max(0, Math.min(100, f)).toFixed(1) + '%';
        
        if (revEl) {
            revEl.textContent = netProfit.toLocaleString('de-CH') + ' CHF';
            revEl.style.color = netProfit >= 0 ? '#00ff88' : '#ff6b6b';
        }
    },

    showRandomNudge() {
        const n = this.currentScenario.nudges;
        const nudgeContainer = document.getElementById('nudgeContainer');
        nudgeContainer.textContent = '💡 ' + n[Math.floor(Math.random() * n.length)];
        nudgeContainer.classList.add('show');
        setTimeout(() => nudgeContainer.classList.remove('show'), 5000);
    },

    confirmPlanning() {
        if (this.placedObjects.length === 0) return alert('Bitte platziere ein Element!');
        const list = document.getElementById('stakeholderList');
        const checklistHtml = this.currentScenario.relatedStakeholders.map((s, i) => `
            <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" id="sh-${i}" class="stakeholder-checkbox" ${s === "Site Experience Management" ? 'checked' : ''}> 
                <label for="sh-${i}">${s}</label>
            </div>`).join('');
        list.innerHTML = `<div style="text-align: left; padding: 15px;">${checklistHtml}</div><p id="warningText" style="color:red"></p>`;
        document.getElementById('stakeholderModal').classList.add('show');
    },

    stakeholderCheckResponse(confirmed) {
        const selected = Array.from(document.querySelectorAll('.stakeholder-checkbox')).filter(cb => cb.checked);
        if (confirmed && selected.length < 2) {
            document.getElementById('warningText').textContent = "Bitte wähle mindestens 2 Stakeholder!";
            return;
        }
        if (confirmed) this.showDataMessagingScreen(selected.map(cb => cb.nextElementSibling.textContent));
        else { this.collaborationBonus = false; document.getElementById('stakeholderModal').classList.remove('show'); this.showResults(); }
    },

    showDataMessagingScreen(stakeholders) {
        const list = document.getElementById('stakeholderList');
        const modalTitle = document.querySelector('#stakeholderModal .modal-title');
        modalTitle.textContent = "DATENANFRAGE FORMULIEREN";
        let html = stakeholders.map(s => `
            <div style="margin-bottom: 15px; text-align: left;">
                <label style="color: #00d9ff; font-size: 10px;">AN: ${s}</label>
                <textarea style="width: 100%; background: #1a1a2e; color: white; border: 1px solid #00d9ff; padding: 5px; height: 50px;"></textarea>
            </div>`).join('');
        list.innerHTML = html;
        document.querySelector('#stakeholderModal .button-group').innerHTML = `<button class="btn" onclick="game.finalizeCollaboration()">SENDEN</button>`;
    },

    finalizeCollaboration() {
        this.collaborationBonus = true;
        document.getElementById('stakeholderModal').classList.remove('show');
        this.showResults();
    },

showResults() {
        // 1. Basis-Werte aus den globalen Stats ziehen
        let s = this.globalBaseStats.satisfaction;
        let p = this.globalBaseStats.productivity;
        let f = this.globalBaseStats.fluctuation;
        let totalInvestment = 0; // Summe der Capex
        let totalAnnualRevenue = 0; // Jährlicher Nutzen

        // 2. Einfluss der Objekte, Kosten und Umsatz addieren
        this.placedObjects.forEach(obj => {
            s += obj.data.satisfaction * 0.1;
            p += obj.data.productivity * 0.1;
            f += obj.data.fluctuation * 0.05;
            totalAnnualRevenue += obj.data.revenue;
            totalInvestment += (obj.data.cost || 0); // Addiert die Investitionskosten
        });

        // 3. Netto-Impact berechnen (Nutzen minus Investition im ersten Jahr)
        const netImpact = totalAnnualRevenue - totalInvestment;
        
        // 4. ROI-Kennzahl: "Cost per Smile"
        const satGain = s - this.globalBaseStats.satisfaction;
        const costPerSmile = satGain > 0 ? (totalInvestment / satGain) : 0;

        // 5. Werte auf logische Bereiche begrenzen (Clamping)
        s = Math.max(0, Math.min(10, s));
        p = Math.max(0, Math.min(10, p));
        f = Math.max(0, Math.min(100, f));

        // 6. Differenzen für die Trend-Anzeige
        const satChange = s - this.globalBaseStats.satisfaction;
        const prodChange = p - this.globalBaseStats.productivity;
        const flucChange = f - this.globalBaseStats.fluctuation;

        // 7. Daten in das HTML schreiben
        document.getElementById('finalSatisfaction').textContent = s.toFixed(1) + '/10';
        document.getElementById('satisfactionChange').textContent = (satChange >= 0 ? '+' : '') + satChange.toFixed(1);
        
        document.getElementById('finalProductivity').textContent = p.toFixed(1) + '/10';
        document.getElementById('productivityChange').textContent = (prodChange >= 0 ? '+' : '') + prodChange.toFixed(1);
        
        document.getElementById('finalFluctuation').textContent = f.toFixed(1) + '%';
        document.getElementById('fluctuationChange').textContent = (flucChange <= 0 ? '' : '+') + flucChange.toFixed(1) + '%';
        
        // Netto-Umsatz Anzeige mit Farbanpassung
        const revenueEl = document.getElementById('finalRevenue');
        revenueEl.textContent = netImpact.toLocaleString('de-CH');
        revenueEl.style.color = netImpact >= 0 ? '#00ff88' : '#ff6b6b';

// ROI-Analyse wurde entfernt
        const bonusBadge = document.getElementById('collaborationBonus');
        if (bonusBadge) {
            bonusBadge.style.display = 'none'; // Versteckt das Feld komplett
        }

        // Label für Umsatz anpassen, damit klar ist, dass es der Netto-Impact ist
        const revLabel = document.querySelector('.result-card:last-child .result-label');
        if (revLabel) revLabel.textContent = "NETTO GEWINN";

        // Farben der Trend-Zahlen
        document.getElementById('satisfactionChange').style.color = satChange >= 0 ? '#00ff88' : '#ff6b6b';
        document.getElementById('productivityChange').style.color = prodChange >= 0 ? '#00ff88' : '#ff6b6b';
        document.getElementById('fluctuationChange').style.color = flucChange <= 0 ? '#00ff88' : '#ff6b6b';

        // Screen-Wechsel
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('resultsScreen').classList.add('show');
    },

    backToMenu() {
        location.reload();
    },

    showLiveData(spot) {
        document.getElementById('liveDataTitle').textContent = spot.label;
        document.getElementById('liveDataBody').innerHTML = spot.details.replace(/\n/g, '<br>');
        document.getElementById('liveDataModal').classList.add('show');
    },

// AB HIER NEU (Schritt B):
    gameLoop() {
        this.updateCharacterPosition();
        this.drawMap();
        requestAnimationFrame(() => this.gameLoop());
    },

updateCharacterPosition() {
        // Im Cockpit oder wenn kein Szenario geladen ist, bewegt sich nichts
        if (!this.currentScenario || this.currentScenario.name === "Campus Cockpit") return;

        // Bewegung basierend auf den Pfeiltasten (Zustand aus this.keys)
        if (this.keys.ArrowUp)    this.character.y -= this.character.speed;
        if (this.keys.ArrowDown)  this.character.y += this.character.speed;
        if (this.keys.ArrowLeft)  this.character.x -= this.character.speed;
        if (this.keys.ArrowRight) this.character.x += this.character.speed;

        // Rand-Begrenzung: Verhindert, dass der Charakter aus dem Canvas läuft
        this.character.x = Math.max(0, Math.min(this.canvas.width, this.character.x));
        this.character.y = Math.max(0, Math.min(this.canvas.height, this.character.y));
    }
}; // Schließt das game-Objekt

window.addEventListener('DOMContentLoaded', () => game.init());
