class NoteData {
    constructor() {
        Logger.log('NoteData', 'Initializing NoteData');
        
        // Define notes by level for treble clef
        this.trebleNotesLevel1 = [ // Notes on staff only (E4 to F5)
            { note: 'E', vfNote: 'e/4' },
            { note: 'F', vfNote: 'f/4' },
            { note: 'G', vfNote: 'g/4' },
            { note: 'A', vfNote: 'a/4' },
            { note: 'B', vfNote: 'b/4' },
            { note: 'C', vfNote: 'c/5' },
            { note: 'D', vfNote: 'd/5' },
            { note: 'E', vfNote: 'e/5' },
            { note: 'F', vfNote: 'f/5' }
        ];
        
        this.trebleNotesLevel2 = [ // First ledger line below and above
            { note: 'D', vfNote: 'd/4' }, // One ledger line below staff
            { note: 'G', vfNote: 'g/5' }  // One ledger line above staff
        ];
        
        this.trebleNotesLevel3 = [ // Extended ledger lines
            { note: 'C', vfNote: 'c/4' }, // Middle C (one more ledger line below)
            { note: 'A', vfNote: 'a/5' }, // Two ledger lines above
            { note: 'B', vfNote: 'b/5' }, // Three ledger lines above
            { note: 'C', vfNote: 'c/6' }  // Four ledger lines above
        ];
        
        // Define notes by level for bass clef
        this.bassNotesLevel1 = [ // Notes on staff only (G2 to A3)
            { note: 'G', vfNote: 'g/2' },
            { note: 'A', vfNote: 'a/2' },
            { note: 'B', vfNote: 'b/2' },
            { note: 'C', vfNote: 'c/3' },
            { note: 'D', vfNote: 'd/3' },
            { note: 'E', vfNote: 'e/3' },
            { note: 'F', vfNote: 'f/3' },
            { note: 'G', vfNote: 'g/3' },
            { note: 'A', vfNote: 'a/3' }
        ];
        
        this.bassNotesLevel2 = [ // First ledger line below and above
            { note: 'F', vfNote: 'f/2' }, // One ledger line below staff
            { note: 'B', vfNote: 'b/3' }  // One ledger line above staff
        ];
        
        this.bassNotesLevel3 = [ // Extended ledger lines
            { note: 'E', vfNote: 'e/2' }, // Two ledger lines below
            { note: 'D', vfNote: 'd/2' }, // Three ledger lines below
            { note: 'C', vfNote: 'c/2' }, // Four ledger lines below
            { note: 'C', vfNote: 'c/4' }  // Middle C (one more ledger line above)
        ];
        
        // Initialize active notes with level 1 only
        this.trebleNotes = [...this.trebleNotesLevel1];
        this.bassNotes = [...this.bassNotesLevel1];

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
            level: this.userLevel,
            vfNote: this.currentNote.vfNote
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
            const oldLevel = this.userLevel;
            this.userLevel++;
            
            // Calculate new values for the modal
            const newPointsNeeded = this.userLevel * 100;
            const remainingXP = this.experiencePoints - pointsNeeded;
            
            // Award level badge
            const levelBadge = `Reached level ${this.userLevel}`;
            if (!this.earnedBadges.includes(levelBadge)) {
                this.earnedBadges.push(levelBadge);
                Logger.log('NoteData', 'Level badge awarded', { badge: levelBadge });
                
                // Show badge modal for level badge
                if (typeof window.showBadgeModal === 'function') {
                    // We'll show this after the level up modal
                    setTimeout(() => {
                        window.showBadgeModal(levelBadge);
                    }, 4000); // Show after level up modal is likely dismissed
                }
            }
            
            // Unlock new features
            this.unlockNewFeatures();
            
            // Reset XP (but keep overflow)
            this.experiencePoints = remainingXP;
            
            // Trigger level up modal
            // We use setTimeout to ensure the DOM is updated before showing the modal
            setTimeout(() => {
                if (typeof window.showLevelUpModal === 'function') {
                    window.showLevelUpModal(oldLevel, this.userLevel, remainingXP, newPointsNeeded);
                }
            }, 500);
            
            Logger.log('NoteData', 'Level up', { 
                oldLevel, 
                newLevel: this.userLevel, 
                remainingXP, 
                newPointsNeeded 
            });
        }
    }

    unlockNewFeatures() {
        // Unlock new features based on user level
        if (this.userLevel === 2) {
            // Level 2: Add first ledger line notes
            Logger.log('NoteData', 'Unlocking Level 2 notes (first ledger lines)');
            this.trebleNotes = [...this.trebleNotesLevel1, ...this.trebleNotesLevel2];
            this.bassNotes = [...this.bassNotesLevel1, ...this.bassNotesLevel2];
        } else if (this.userLevel === 3) {
            // Level 3: Add extended ledger line notes
            Logger.log('NoteData', 'Unlocking Level 3 notes (extended ledger lines)');
            this.trebleNotes = [...this.trebleNotesLevel1, ...this.trebleNotesLevel2, ...this.trebleNotesLevel3];
            this.bassNotes = [...this.bassNotesLevel1, ...this.bassNotesLevel2, ...this.bassNotesLevel3];
        }
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
                
                // Show badge modal
                if (typeof window.showBadgeModal === 'function') {
                    window.showBadgeModal(criteria.badge);
                }
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

    // Add a method to check if the user has reached the last level
    isLastLevel() {
        const lastLevel = 3; // Define the last level
        return this.userLevel > lastLevel;
    }

    // Add a method to check if the user is at the end of a specific level
    isEndOfLevel(level) {
        const pointsNeeded = level * 100;
        return this.experiencePoints >= pointsNeeded;
    }
}

const noteData = new NoteData();
