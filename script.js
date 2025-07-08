class ProfPitcher {
    constructor() {
        this.inputText = document.getElementById('input-text');
        this.genzBtn = document.getElementById('genz-btn');
        this.simpleBtn = document.getElementById('simple-btn');
        this.genzOutput = document.getElementById('genz-output');
        this.simpleOutput = document.getElementById('simple-output');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        this.genzBtn.addEventListener('click', () => this.handleTranslation('genz'));
        this.simpleBtn.addEventListener('click', () => this.handleTranslation('simple'));
        
        // Enter-Taste für Accessibility
        this.inputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleTranslation('genz');
            }
        });
    }
    
    async handleTranslation(type) {
        const text = this.inputText.value.trim();
        
        if (!text) {
            this.showError('Bitte gib zuerst einen Text ein!');
            this.inputText.focus();
            return;
        }
        
        const outputElement = type === 'genz' ? this.genzOutput : this.simpleOutput;
        const button = type === 'genz' ? this.genzBtn : this.simpleBtn;
        
        this.setLoadingState(button, outputElement, true);
        
        try {
            const result = await this.translateText(text, type);
            this.displayResult(outputElement, result);
        } catch (error) {
            this.displayError(outputElement, 'Fehler beim Übersetzen. Bitte versuche es erneut.');
        } finally {
            this.setLoadingState(button, outputElement, false);
        }
    }
    
    async translateText(text, type) {
     //   // Simuliere API-Call oder implementiere deine Übersetzungslogik
       /////             resolve(this.generateGenzVersion(text));
       //             resolve(this.generateSimpleVersion(text));
         //       }
          //  }, 1500);

          const response = await fetch("https://prof-pitcher.onrender.com/api/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, type})
          });

          if(!response.ok) {
            throw new Error("Fehler beim Abrufen der Übersetzung");
          }

          const data = await response.json();
          return data.result;
        }
    
    
    generateGenzVersion(text) {
        // Beispiel-Logik für Gen Z Version
        const genzPhrases = {
            'differenzierte Perspektive': 'verschiedene Blickwinkel, du weißt schon 🤷‍♂️',
            'Interpretation': 'wie man das halt so sieht',
            'Thematik': 'das Ding hier',
            'verlangt': 'braucht halt',
            'eine': 'ne'
        };
        
        let result = text;
        Object.entries(genzPhrases).forEach(([formal, casual]) => {
            result = result.replace(new RegExp(formal, 'gi'), casual);
        });
        
        return `${result} ...oder so ähnlich, keine Ahnung 😅`;
    }
    
    generateSimpleVersion(text) {
        // Beispiel-Logik für einfache Version
        const simplifications = {
            'differenzierte Perspektive': 'verschiedene Sichtweisen',
            'Interpretation': 'Auslegung',
            'Thematik': 'Thema',
            'verlangt': 'braucht'
        };
        
        let result = text;
        Object.entries(simplifications).forEach(([complex, simple]) => {
            result = result.replace(new RegExp(complex, 'gi'), simple);
        });
        
        return `Einfach gesagt: ${result}`;
    }
    
    setLoadingState(button, output, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.textContent = button.textContent.replace(/[😎🧠]/, '⏳');
            output.classList.add('loading');
            output.textContent = 'Wird übersetzt...';
        } else {
            button.disabled = false;
            button.textContent = button.textContent.replace('⏳', 
                button.id === 'genz-btn' ? '😎' : '🧠');
            output.classList.remove('loading');
        }
    }
    
    displayResult(element, text) {
        element.textContent = text;
        element.setAttribute('aria-live', 'polite');
    }
    
    displayError(element, message) {
        element.textContent = message;
        element.style.color = '#dc3545';
    }
    
    showError(message) {
        alert(message); // In Production: Toast-Notification verwenden
    }
}

// Initialisierung nach DOM-Load
document.addEventListener('DOMContentLoaded', () => {
    new ProfPitcher();
});
