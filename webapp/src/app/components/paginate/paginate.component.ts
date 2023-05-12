import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.scss']
})
export class PaginateComponent implements OnInit {

  constructor() { }

  @Input() page: number = 1;
  @Input() totalPages: number = 1;

  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

  _maxPages: number = 3;
  _totalPages: number[] = [];


  ngOnInit(): void {
    this._totalPages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  changePageEvent(page: number) {
    this.changePage.emit(page);
  }

}
