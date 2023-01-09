import { Exercise } from './training/exercise.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class TrainingService {

    exerciseChanged = new Subject<Exercise | null>();

    private runningExercise?: Exercise | null;
    private exercises: Exercise[] = [];
    private availableExercises: Exercise[] =
        [
            { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
            { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 10 },
            { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 6 },
            { id: 'burpees', name: 'Burpees', duration: 60, calories: 15 },
        ];

    getAvailableExercises(): Exercise[] {
        return this.availableExercises.slice()
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id == selectedId)
        if (this.runningExercise) {
            this.exerciseChanged.next({ ...this.runningExercise })
        }
    }

    completeExercise() {
        this.exercises.push({ ...this.runningExercise as Exercise, date: new Date(), state: 'completed' });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.exercises.push({ ...this.runningExercise as Exercise, 
            date: new Date(), 
            duration: this.runningExercise?.duration! * (progress / 100), 
            calories: this.runningExercise?.calories! * (progress / 100), 
            state: 'cancelled' });
            this.runningExercise = null;
            this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise }
    }
    
    getCompletedOrCancelledExercises() {
        return this.exercises.slice();
      }
}