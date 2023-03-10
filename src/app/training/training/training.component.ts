import { Component, OnInit, OnDestroy } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subscription } from 'rxjs';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  exerciseSubscription: Subscription | undefined;

  constructor(private trainingService: TrainingService) {

  }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(exercise => {
      this.ongoingTraining = exercise? true : false
    })
  }  

  ngOnDestroy() {
    this.exerciseSubscription?.unsubscribe()
  }
}