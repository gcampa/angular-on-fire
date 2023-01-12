import { Exercise } from './training/exercise.model';
import { Injectable, ɵɵsetComponentScope } from '@angular/core';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { collection, Firestore } from '@firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise?: Exercise | null;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore) { }

    fetchAvailableExercises() {
        this.db.collection<Exercise>('availableExercises')
            .snapshotChanges()
            .pipe(map((docArray: any[]) => docArray.map(doc => {
                let e: Exercise =
                {
                    id: doc.payload.doc.id,
                    name: doc.payload.doc.data().name,
                    calories: doc.payload.doc.data().calories,
                    duration: doc.payload.doc.data().duration
                }
                return e
            }))
            )
            .subscribe((exercises: Exercise[]) => {
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises]);
            })
    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()})
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId)
        if (this.runningExercise) {
            this.exerciseChanged.next({ ...this.runningExercise })
        }
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise as Exercise,
            date: new Date(),
            state: 'completed'
        })
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise as Exercise,
            date: new Date(),
            duration: this.runningExercise?.duration! * (progress / 100),
            calories: this.runningExercise?.calories! * (progress / 100),
            state: 'cancelled'
        })
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise }
    }

    fetchCompletedOrCancelledExercises() {
        this.db.collection('finishedExercises')
            .valueChanges()
            .subscribe(exercises => {
                this.finishedExercisesChanged.next(exercises as Exercise[]);
            });
        // .subscribe({
        //     next: (exercises => {
        //         this.finishedExercisesChanged.next(exercises as Exercise[])
        //     }),
        //     error: (err) => console.log(err),
        //     complete: () => console.log('complete')
        // })
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}