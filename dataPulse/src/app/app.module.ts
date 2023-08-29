import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { TableItemComponent } from './table-item/table-item.component';

@NgModule({
  declarations: [
    AppComponent,
    TableItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
