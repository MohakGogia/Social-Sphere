import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { SigninRedirectCallbackComponent } from './auth/signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './auth/signout-redirect-callback/signout-redirect-callback.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ConfigurationService } from './core/services/configuration/configuration.service';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './shared/components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { ProfileComponent } from './profile/profile.component';
import { FindComponent } from './find/find.component';

const appInitializerFn = (appConfig: ConfigurationService) => {
  return () => {
    return appConfig.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    DashboardComponent,
    HeaderComponent,
    FollowersComponent,
    FollowingComponent,
    ProfileComponent,
    FindComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [ConfigurationService],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
