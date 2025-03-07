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
            { note: 'G', vfNote: 'g/5' },
            { note: 'A', vfNote: 'a/5' },  // Added for higher levels
            { note: 'B', vfNote: 'b/5' }   // Added for higher levels
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
            { note: 'C', vfNote: 'c/4' },  // Middle C
            { note: 'D', vfNote: 'd/2' },  // Added for higher levels
            { note: 'E', vfNote: 'e/2' }   // Added for higher levels
        ];

        this.currentClef = 'treble';
        this.currentNote = null;

        // Add properties for user level and experience points
        this.userLevel = 1;
        this.experiencePoints = 0;

        // Add properties to track consecutive correct answers and earned badges
        this.consecutiveCorrectAnswers = 0;
        this.earnedBadges = [];
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

        if (isCorrect) {
            this.consecutiveCorrectAnswers++;
            this.checkAndAwardBadges();
        } else {
            this.resetConsecutiveCorrectAnswers();
        }
        
        return isCorrect;
    }

    getCurrentNote() {
        return this.currentNote;
    }

    getCurrentClef() {
        return this.currentClef;
    }

    // Implement methods to update user level and experience points
    addExperiencePoints(points) {
        this.experiencePoints += points;
        this.checkLevelUp();
    }

    checkLevelUp() {
        const pointsNeeded = this.userLevel * 100; // Example: 100 points per level
        if (this.experiencePoints >= pointsNeeded) {
            this.userLevel++;
            this.experiencePoints -= pointsNeeded;
            this.unlockNewFeatures();
        }
    }

    unlockNewFeatures() {
        // Unlock new features based on user level
        if (this.userLevel === 2) {
            // Example: Unlock additional note ranges
            this.trebleNotes.push({ note: 'A', vfNote: 'a/5' });
            this.trebleNotes.push({ note: 'B', vfNote: 'b/5' });
            this.bassNotes.push({ note: 'D', vfNote: 'd/2' });
            this.bassNotes.push({ note: 'E', vfNote: 'e/2' });
        } else if (this.userLevel === 3) {
            // Example: Unlock even more note ranges
            this.trebleNotes.push({ note: 'C', vfNote: 'c/6' });
            this.trebleNotes.push({ note: 'D', vfNote: 'd/6' });
            this.bassNotes.push({ note: 'C', vfNote: 'c/2' });
            this.bassNotes.push({ note: 'B', vfNote: 'b/1' });
        }
        // Add more unlocks as needed
    }

    // Add a method to check and award badges based on consecutive correct answers
    checkAndAwardBadges() {
        const badgeCriteria = [
            { count: 5, badge: '5 correct answers in a row' },
            { count: 10, badge: '10 correct answers in a row' },
            { count: 20, badge: '20 correct answers in a row' }
        ];

        badgeCriteria.forEach(criteria => {
            if (this.consecutiveCorrectAnswers === criteria.count && !this.earnedBadges.includes(criteria.badge)) {
                this.earnedBadges.push(criteria.badge);
                Logger.log('NoteData', 'Badge awarded', { badge: criteria.badge });
            }
        });
    }

    // Add a method to reset the consecutive correct answers count on incorrect answer
    resetConsecutiveCorrectAnswers() {
        this.consecutiveCorrectAnswers = 0;
    }

    // Add a method to get the list of earned badges
    getEarnedBadges() {
        return this.earnedBadges;
    }
}

const noteData = new NoteData();
