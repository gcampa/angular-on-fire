import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Exercise } from '../training/exercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] | undefined;
  exerciseSubscription: Subscription = new Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    // this.ExercisesSubscription =
    //   this.trainingService.exercisesChanged.subscribe(exercises => {
    //     this.exercises = exercises
    //   })
    // this.trainingService.fetchAvailableExercises()
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => (this.exercises = exercises)
    );
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.exerciseSubscription?.unsubscribe()
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise)
  }
}
