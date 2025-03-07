class MusicFlashcards {
    constructor() {
        Logger.log('MusicFlashcards', 'Initializing application');
        
        // Get VexFlow reference
        this.VF = Vex.Flow;
        
        // Initialize score
        this.score = 0;
        
        // Initialize user level and experience points
        this.userLevel = noteData.userLevel;
        this.experiencePoints = noteData.experiencePoints;
        
        // Initialize VexFlow and set up event listeners
        this.setupVexFlow();
        this.setupEventListeners();
        this.updateProgressBar();
    }

    setupVexFlow() {
        try {
            const container = document.getElementById('staff');
            container.innerHTML = ''; // Clear previous content

            // Create renderer with fixed dimensions
            this.renderer = new this.VF.Renderer(
                container,
                this.VF.Renderer.Backends.SVG
            );

            // Set fixed dimensions - smaller width for more focused view
            this.width = 400;
            this.height = 200;
            this.staffWidth = 300;
            
            // Configure renderer
            this.renderer.resize(this.width, this.height);
            this.context = this.renderer.getContext();

            // Draw initial staff and note
            this.drawNewNote();

            Logger.log('MusicFlashcards', 'VexFlow initialized', {
                width: this.width,
                height: this.height,
                staffWidth: this.staffWidth
            });
        } catch (error) {
            Logger.error('MusicFlashcards', 'Error initializing VexFlow', error);
        }
    }

    drawStaff() {
        try {
            // Clear previous content
            this.context.clear();
            
            const staffX = 50;  // More left margin for cleaner look
            const staffY = 50;  // More top margin for cleaner look

            // Create a new staff with fixed width
            this.stave = new this.VF.Stave(staffX, staffY, this.staffWidth);
            
            // Add clef
            const clefType = noteData.getCurrentClef();
            this.stave.addClef(clefType);
            
            // Draw the staff
            this.stave.setContext(this.context).draw();

            Logger.log('MusicFlashcards', 'Staff drawn', {
                clefType,
                staffWidth: this.staffWidth,
                staffX,
                staffY
            });
        } catch (error) {
            Logger.error('MusicFlashcards', 'Error drawing staff', error);
            throw error; // Rethrow to handle in calling function
        }
    }

    drawNote(noteInfo) {
        try {
            if (!noteInfo || !noteInfo.vfNote) {
                throw new Error('Invalid note info provided');
            }

            this.drawStaff();

            // Create the note with larger size
            const note = new this.VF.StaveNote({
                clef: noteData.getCurrentClef(),
                keys: [noteInfo.vfNote],
                duration: "w" // Whole note
            }).setStyle({
                fillStyle: "#000000",
                strokeStyle: "#000000",
                scale: 1.2 // Make note 20% larger
            });

            // Create a voice and add the note
            const voice = new this.VF.Voice({
                num_beats: 4,
                beat_value: 4
            });
            voice.addTickable(note);

            // Format and draw with more space around the note
            new this.VF.Formatter()
                .joinVoices([voice])
                .format([voice], this.staffWidth - 80);

            voice.draw(this.context, this.stave);

            Logger.log('MusicFlashcards', 'Note drawn successfully', {
                note: noteInfo.vfNote,
                clef: noteData.getCurrentClef()
            });
        } catch (error) {
            Logger.error('MusicFlashcards', 'Error drawing note', {
                noteInfo,
                error
            });
        }
    }

    drawNewNote() {
        try {
            const note = noteData.getRandomNote();
            if (!note) {
                Logger.error('MusicFlashcards', 'Failed to get random note');
                return;
            }
            
            Logger.log('MusicFlashcards', 'Drawing new note', {
                note: note.note,
                vfNote: note.vfNote,
                clef: noteData.getCurrentClef()
            });
            
            this.drawNote(note);
        } catch (error) {
            Logger.error('MusicFlashcards', 'Error drawing new note', error);
        }
    }

    updateScore(correct) {
        if (correct) {
            const oldScore = this.score;
            this.score++;
            document.getElementById('score').textContent = this.score;
            Logger.log('MusicFlashcards', 'Score updated', {
                oldScore,
                newScore: this.score
            });
            
            // Add experience points and update level
            noteData.addExperiencePoints(10); // Example: 10 points per correct answer
            this.userLevel = noteData.userLevel;
            this.experiencePoints = noteData.experiencePoints;
            document.getElementById('level').textContent = this.userLevel;
            this.updateProgressBar();
        }
    }

    showFeedback(correct, correctAnswer) {
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
        
        if (correct) {
            feedback.textContent = i18n.translate('correct');
        } else {
            feedback.textContent = `${i18n.translate('incorrect')} ${i18n.translateNote(correctAnswer)}`;
        }
        
        // Add level progression feedback
        if (correct) {
            feedback.textContent += ` | Level: ${this.userLevel}`;
        }
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progress');
        const pointsNeeded = this.userLevel * 100; // Example: 100 points per level
        const progressPercentage = (this.experiencePoints / pointsNeeded) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    setupEventListeners() {
        const noteButtons = document.querySelectorAll('.note-btn');
        const nextBtn = document.getElementById('nextBtn');
        const resetBtn = document.getElementById('resetBtn');
        const clefToggle = document.getElementById('clefToggle');

        const handleNoteSelection = (button) => {
            Logger.log('MusicFlashcards', 'Note button clicked', {
                selectedNote: button.getAttribute('data-note')
            });
            // Remove any previous selections
            noteButtons.forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
            });
            
            const userInput = button.getAttribute('data-note');
            const currentNote = noteData.getCurrentNote();
            
            if (!currentNote) {
                Logger.error('MusicFlashcards', 'No current note available');
                return;
            }
            
            const correct = noteData.checkAnswer(userInput);
            
            // Add appropriate class to selected button
            button.classList.add(correct ? 'correct' : 'incorrect');
            
            this.showFeedback(correct, currentNote.note);
            this.updateScore(correct);
            
            if (correct) {
                Logger.log('MusicFlashcards', 'Correct answer given', {
                    note: currentNote.note,
                    userInput,
                    score: this.score + 1
                });
                
                // Disable all buttons temporarily
                noteButtons.forEach(btn => btn.disabled = true);
                
                setTimeout(() => {
                    this.drawNewNote();
                    document.getElementById('feedback').textContent = '';
                    // Re-enable all buttons
                    noteButtons.forEach(btn => {
                        btn.disabled = false;
                        btn.classList.remove('selected', 'correct', 'incorrect');
                    });
                }, 1500);
            } else {
                Logger.log('MusicFlashcards', 'Incorrect answer given', {
                    note: currentNote.note,
                    userInput
                });
            }
        };

        noteButtons.forEach(button => {
            button.addEventListener('click', () => handleNoteSelection(button));
        });

        nextBtn.addEventListener('click', () => {
            Logger.log('MusicFlashcards', 'Next button clicked');
            this.drawNewNote();
            document.getElementById('feedback').textContent = '';
            noteButtons.forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
                btn.disabled = false;
            });
        });

        resetBtn.addEventListener('click', () => {
            Logger.log('MusicFlashcards', 'Reset button clicked', {
                previousScore: this.score
            });
            this.score = 0;
            document.getElementById('score').textContent = '0';
            this.drawNewNote();
            document.getElementById('feedback').textContent = '';
            noteButtons.forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
                btn.disabled = false;
            });
        });

        clefToggle.addEventListener('click', () => {
            Logger.log('MusicFlashcards', 'Clef toggle clicked');
            noteData.toggleClef();
            this.drawNewNote();
            document.getElementById('feedback').textContent = '';
            noteButtons.forEach(btn => {
                btn.classList.remove('selected', 'correct', 'incorrect');
                btn.disabled = false;
            });
        });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicFlashcards();
});
