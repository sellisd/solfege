const translations = {
    en: {
        title: 'Music Note Flashcards',
        toggleClef: 'Toggle Clef',
        score: 'Score',
        submit: 'Submit',
        next: 'Next',
        reset: 'Reset',
        enterNote: 'Enter note name',
        correct: 'Correct!',
        incorrect: 'Try again! The correct answer was:',
        trebleClef: 'Treble Clef',
        bassClef: 'Bass Clef'
    },
    fr: {
        title: 'Cartes Flash de Notes de Musique',
        toggleClef: 'Changer de Clé',
        score: 'Score',
        submit: 'Valider',
        next: 'Suivant',
        reset: 'Réinitialiser',
        enterNote: 'Entrez le nom de la note',
        correct: 'Correct !',
        incorrect: 'Essayez encore ! La bonne réponse était :',
        trebleClef: 'Clé de Sol',
        bassClef: 'Clé de Fa'
    },
    el: {
        title: 'Κάρτες Μουσικών Νοτών',
        toggleClef: 'Αλλαγή Κλειδιού',
        score: 'Βαθμολογία',
        submit: 'Υποβολή',
        next: 'Επόμενο',
        reset: 'Επαναφορά',
        enterNote: 'Εισάγετε το όνομα της νότας',
        correct: 'Σωστό!',
        incorrect: 'Προσπαθήστε ξανά! Η σωστή απάντηση ήταν:',
        trebleClef: 'Κλειδί του Σολ',
        bassClef: 'Κλειδί του Φα'
    }
};

const noteTranslations = {
    en: {
        C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'B'
    },
    fr: {
        C: 'Do', D: 'Ré', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si'
    },
    el: {
        C: 'Ντο', D: 'Ρε', E: 'Μι', F: 'Φα', G: 'Σολ', A: 'Λα', B: 'Σι'
    }
};

class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        Logger.log('I18n', 'Initializing with language', { language: this.currentLanguage });
        this.init();
    }

    init() {
        this.setLanguage(this.currentLanguage);
        this.setupLanguageSelector();
    }

    setLanguage(lang) {
        Logger.log('I18n', 'Changing language', {
            from: this.currentLanguage,
            to: lang
        });
        
        try {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            this.updateTranslations();
            this.updatePlaceholders();
            Logger.log('I18n', 'Language change completed');
        } catch (error) {
            Logger.error('I18n', 'Error changing language', error);
            throw error;
        }
    }

    setupLanguageSelector() {
        const selector = document.getElementById('languageSelect');
        if (selector) {
            selector.value = this.currentLanguage;
            selector.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    updateTranslations() {
        Logger.log('I18n', 'Updating translations', { language: this.currentLanguage });
        
        try {
            // Update regular translations
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[this.currentLanguage][key]) {
                    element.textContent = translations[this.currentLanguage][key];
                } else {
                    Logger.error('I18n', 'Missing translation', { key, language: this.currentLanguage });
                }
            });

            // Update note button texts
            const noteButtons = document.querySelectorAll('.note-btn');
            noteButtons.forEach(button => {
                const note = button.getAttribute('data-note');
                button.textContent = noteTranslations[this.currentLanguage][note];
            });
            
            Logger.log('I18n', 'Translations updated successfully');
        } catch (error) {
            Logger.error('I18n', 'Error updating translations', error);
            throw error;
        }
    }

    updatePlaceholders() {
        const noteInput = document.getElementById('noteInput');
        if (noteInput) {
            noteInput.placeholder = translations[this.currentLanguage].enterNote;
        }
    }

    translate(key) {
        return translations[this.currentLanguage][key] || key;
    }

    translateNote(note) {
        const translated = noteTranslations[this.currentLanguage][note];
        if (!translated) {
            Logger.error('I18n', 'Missing note translation', { note, language: this.currentLanguage });
            return note;
        }
        
        Logger.log('I18n', 'Note translated', {
            from: note,
            to: translated,
            language: this.currentLanguage
        });
        
        return translated;
    }

    getAllValidNoteNames(note) {
        return Object.values(noteTranslations).map(trans => trans[note]);
    }
}

const i18n = new I18n();
