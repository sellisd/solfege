class NoteData {
    constructor() {
        Logger.log('NoteData', 'Initializing NoteData');
        // VexFlow uses standard music notation where middle C is C4
        this.trebleNotes = [
            { note: 'C', vfNote: 'c/4' },  // Middle C
            { note: 'D', vfNote: 'd/4' },
            { note: 'E', vfNote: 'e/4' },
            { note: 'F', vfNote: 'f/4' },
            { note: 'G', vfNote: 'g/4' },
            { note: 'A', vfNote: 'a/4' },
            { note: 'B', vfNote: 'b/4' },
            { note: 'C', vfNote: 'c/5' },
            { note: 'D', vfNote: 'd/5' },
            { note: 'E', vfNote: 'e/5' },
            { note: 'F', vfNote: 'f/5' },
            { note: 'G', vfNote: 'g/5' }
        ];

        this.bassNotes = [
            { note: 'F', vfNote: 'f/2' },
            { note: 'G', vfNote: 'g/2' },
            { note: 'A', vfNote: 'a/2' },
            { note: 'B', vfNote: 'b/2' },
            { note: 'C', vfNote: 'c/3' },
            { note: 'D', vfNote: 'd/3' },
            { note: 'E', vfNote: 'e/3' },
            { note: 'F', vfNote: 'f/3' },
            { note: 'G', vfNote: 'g/3' },
            { note: 'A', vfNote: 'a/3' },
            { note: 'B', vfNote: 'b/3' },
            { note: 'C', vfNote: 'c/4' }  // Middle C
        ];

        this.currentClef = 'treble';
        this.currentNote = null;
    }

    getRandomNote() {
        const notes = this.currentClef === 'treble' ? this.trebleNotes : this.bassNotes;
        const randomIndex = Math.floor(Math.random() * notes.length);
        this.currentNote = notes[randomIndex];
        
        Logger.log('NoteData', 'Generated random note', {
            clef: this.currentClef,
            note: this.currentNote.note,
            position: this.currentNote.position
        });
        
        return this.currentNote;
    }

    toggleClef() {
        const previousClef = this.currentClef;
        this.currentClef = this.currentClef === 'treble' ? 'bass' : 'treble';
        
        Logger.log('NoteData', 'Clef toggled', {
            from: previousClef,
            to: this.currentClef
        });
        
        return this.currentClef;
    }

    checkAnswer(userInput) {
        if (!this.currentNote) {
            Logger.error('NoteData', 'Attempted to check answer with no current note');
            return false;
        }
        
        // Get all valid translations of the current note
        const validAnswers = i18n.getAllValidNoteNames(this.currentNote.note);
        
        // Check if the selected note matches
        const isCorrect = validAnswers.some(answer => 
            userInput.toLowerCase() === answer.toLowerCase()
        );
        
        Logger.log('NoteData', 'Answer checked', {
            userInput,
            currentNote: this.currentNote.note,
            validAnswers,
            isCorrect,
            clef: this.currentClef
        });
        
        return isCorrect;
    }

    getCurrentNote() {
        return this.currentNote;
    }

    getCurrentClef() {
        return this.currentClef;
    }
}

const noteData = new NoteData();
