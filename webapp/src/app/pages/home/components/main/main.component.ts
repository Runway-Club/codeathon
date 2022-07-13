import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { listingProblem } from 'src/actions/problem.action';
import { Problem } from 'src/models/problem.model';
import { ProblemListing } from 'src/states/problem.state';
@Component({
  selector: 'app-main',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  listing$: Observable<ProblemListing>;

  problems: Problem[] = [];
  prevDoc: DocumentSnapshot | undefined = undefined;

  constructor(private store: Store<{ problemListing: ProblemListing }>, private cd: ChangeDetectorRef, private router: Router) {
    this.listing$ = this.store.select('problemListing');
  }

  ngOnInit(): void {
    this.listing$.subscribe(listing => {
      this.problems.splice(0, this.problems.length);
      if (listing.list != undefined) {
        for (let i = 0; i < listing.list.length; i++) {
          this.problems.push(listing.list[0]);
        }
      }
      // console.log(this.problems);
      this.cd.detectChanges();
    });
    this.store.dispatch(listingProblem({ prevDoc: this.prevDoc }));
  }

  viewProblem(problem: Problem) {
    // console.log(problem);
    this.router.navigate(['problem', problem.id]);
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
