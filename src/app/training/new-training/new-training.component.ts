import { Component, EventEmitter, Output } from '@angular/core';
import { Exercise } from '../training/exercise.model';
import { TrainingService } from '../training.service';
import { Form, NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent {
  @Output() trainingStart = new EventEmitter<void>();

  exercises: Exercise[] = []

  constructor(private trainingService: TrainingService) {
    this.exercises = trainingService.getAvailableExercises()
  }

  ngOnInit() {

  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise)
  }
}
