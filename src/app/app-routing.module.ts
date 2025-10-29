import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WomenComponent } from './women/women.component';
import { MenComponent } from './men/men.component';
import { KidsComponent } from './kids/kids.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';  
import { SearchResultsComponent } from './search-results/search-results.component';
import { ProfileComponent } from './profile/profile.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'women', component: WomenComponent },
  { path: 'men', component: MenComponent },
  { path: 'kids', component: KidsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
