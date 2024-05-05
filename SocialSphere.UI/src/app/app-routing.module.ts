import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninRedirectCallbackComponent } from './auth/signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './auth/signout-redirect-callback/signout-redirect-callback.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { FindComponent } from './find/find.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { MessagesComponent } from './messages/messages.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { UserDataResovler } from './core/resolvers/user-data.resolver';
import { PreventUnsavedChangesGuard } from './core/guards/prevent-unsaved-changes.guard';
import { UserDetailedInfoResolver } from './core/resolvers/user-detailed-info.resolver';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'find', component: FindComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'followers', component: FollowersComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'following', component: FollowingComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'messages', component: MessagesComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
  { path: 'edit-profile', component: EditProfileComponent,
      canActivate: [() => inject(AuthGuard).canActivate()], resolve: { user: UserDataResovler }, canDeactivate: [ PreventUnsavedChangesGuard ]},
  { path: 'profile/:username', component: ProfileComponent,
    canActivate: [() => inject(AuthGuard).canActivate()], resolve: { user: UserDetailedInfoResolver }},
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
