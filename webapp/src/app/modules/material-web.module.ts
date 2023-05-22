import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//button
import '@material/web/button/elevated-button';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/tonal-button.js';

import '@material/web/fab/fab.js';
import '@material/web/fab/branded-fab.js';

//icon
import '@material/web/icon/icon.js';

//icon-button
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/iconbutton/standard-icon-button.js';

//checkbox
import '@material/web/checkbox/checkbox.js';

//menu
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

//select
import '@material/web/select/filled-select.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';

//divider and elevation
import '@material/web/divider/divider.js';
import '@material/web/elevation/elevation.js';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class MaterialWebModule { }
