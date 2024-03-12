import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MathValidators } from '../math-validators';
import { delay, filter, scan } from 'rxjs';
import { AnswerHighlightDirective } from '../answer-highlight.directive';

@Component({
  selector: 'app-equation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AnswerHighlightDirective],
  templateUrl: './equation.component.html',
  styleUrl: './equation.component.css'
})
export class EquationComponent {
  secondsPerSolution = 0;
  mathForm = new FormGroup({
    a: new FormControl(this.randomNumber()),
    b: new FormControl(this.randomNumber()),
    answer: new FormControl('')
  }, [
    MathValidators.addition('answer', 'a', 'b')  
  ]);

  ngOnInit() {
    this.mathForm.statusChanges.pipe(
      filter(value => value === 'VALID'),
      delay(100),
      scan((acc) => {
        return {
          numberSolved: acc.numberSolved+1,
          startTime: acc.startTime
        }
      }, { numberSolved: 0, startTime: new Date() })
      ).subscribe(({ numberSolved, startTime }) => {
      this.secondsPerSolution = (
        new Date().getTime() - startTime.getTime()
      ) / numberSolved / 1000;
      this.mathForm.setValue({
        a: this.randomNumber(),
        b: this.randomNumber(),
        answer: ''
      })
    })
  }

  get a() {
    return this.mathForm.get('a')?.value;
  }

  get b() {
    return this.mathForm.get('b')?.value;
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }
}
