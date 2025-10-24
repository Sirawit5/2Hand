import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule
import { SignupPageComponent } from './signup-page/signup-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';  // สมมติว่ามีหน้า Home
import { NavbarComponent } from './navbar/navbar.component';
import { AboutUSComponent } from './about-us/about-us.component';
import { WomenComponent } from './women/women.component';
import { MenComponent } from './men/men.component';
import { KidsComponent } from './kids/kids.component';
@NgModule({
  declarations: [
    AppComponent,
    SignupPageComponent,
    LoginPageComponent,
    HomeComponent, 
    NavbarComponent, AboutUSComponent, WomenComponent, MenComponent, KidsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  // เพิ่ม HttpClientModule ที่นี่
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
