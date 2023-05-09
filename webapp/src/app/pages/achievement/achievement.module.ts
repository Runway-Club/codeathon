import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AchievementRoutingModule } from './achievement-routing.module';
import { AchievementComponent } from './achievement.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NbCalendarModule, NbCalendarRangeModule } from '@nebular/theme';
import { SharedNebularModule } from 'src/app/modules/nebular/nebular.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { RankingComponent } from './components/ranking/ranking.component';
import { ContentComponent } from './components/content/content.component';

@NgModule({
  declarations: [
    AchievementComponent,
    CalendarComponent,
    RankingComponent,
    ContentComponent,
  ],
  imports: [
    CommonModule,
    AchievementRoutingModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    SharedNebularModule,
    SharedModule,
  ],
})
export class AchievementModule {}
