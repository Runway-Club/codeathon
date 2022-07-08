import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.scss']
})
export class ProblemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public problem = {
    title: "Tính tổng 2 số",
    tags: [
      "Nhập môn lập trình",
      "Code thiếu nhi"
    ],
    author: "admin-itss@gmail.com",
    description: " A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.",
    content: " A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.",
    level: 5,
    samples: [
      {
        input: "1 + 2",
        output: "3"
      },
      {
        input: "999 + 1",
        output: "1000"
      },
    ],
    createDate: "1657253729835"
  }

}
