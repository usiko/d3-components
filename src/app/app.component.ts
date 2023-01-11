import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'd3';
  pieData: { label: string, value: number; }[] = [];
  ngOnInit() {
    this.pieData = [
      { label: 'option1', value: 100 },
      /*{ label: 'option2', value: 10 },
      { label: 'option3', value: 15 }*/
    ];
    setInterval(() => {
      this.pieData = [...this.pieData, { label: 'option3', value: 15 }];
    }, (1000));
  }
}
