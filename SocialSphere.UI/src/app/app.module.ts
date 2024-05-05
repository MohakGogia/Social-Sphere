import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CustomErrorHandler } from './shared/services/error-handler/custom-error-handler';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ConfirmationService } from 'primeng/api';
import { UserCardComponent } from './shared/components/user-card/user-card.component';
import { UserMessagesComponent } from './user-messages/user-messages.component';

const appInitializerFn = (appConfig: ConfigurationService) => {
  return () => {
    return appConfig.loadConfig();
  };
};

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent,
    DashboardComponent,
    HeaderComponent,
    FollowersComponent,
    FollowingComponent,
    ProfileComponent,
    EditProfileComponent,
    FindComponent,
    UserCardComponent,
    UserMessagesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ReactiveFormsModule,
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
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
    ConfirmationService
  ],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule { }
