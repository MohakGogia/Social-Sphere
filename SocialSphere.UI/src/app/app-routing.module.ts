import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninRedirectCallbackComponent } from './auth/signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './auth/signout-redirect-callback/signout-redirect-callback.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { AuthGuard } from './shared/guards/auth.guard';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [() => inject(AuthGuard).canActivate()]},
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
