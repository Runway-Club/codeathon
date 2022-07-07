import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-main',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public cards = [
    {
      title: "Tính tổng 2 số",
      tags: [
        "Nhập môn lập trình",
        "Code thiếu nhi"
      ],
      author: "admin-itss@gmail.com",
      description: " A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.",
      level: 5
    },
    {
      title: "Tính tổng 3 số",
      tags: [
        "Nhập môn lập trình",
        "Code thiếu nhi"
      ],
      author: "admin-itss@gmail.com",
      description: " A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.",
      level: 5
    },
    {
      title: "Tính tổng 4 số",
      tags: [
        "Nhập môn lập trình",
        "Code thiếu nhi"
      ],
      author: "admin-itss@gmail.com",
      description: " A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.",
      level: 5
    },
  ]

}
