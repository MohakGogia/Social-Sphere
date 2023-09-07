import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './core/components/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { SigninRedirectCallbackComponent } from './core/components/signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './core/components/signout-redirect-callback/signout-redirect-callback.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
