import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TrainingService } from '../training.service';
import { Exercise } from '../training/exercise.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  private exChangedSubscription: Subscription | undefined
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state' ]
  dataSource = new MatTableDataSource<Exercise>()

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.exChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe(exercises => {
      this.dataSource.data = exercises  
    })
    this.trainingService.fetchCompletedOrCancelledExercises()
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
  }

  handlePageEvent(e: PageEvent) {
    
  }

  ngOnDestroy(): void {
    this.exChangedSubscription?.unsubscribe()
  }
}
