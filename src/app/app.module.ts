import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/**
 * Material Module
 */
import { MaterialModule } from './material.module';

/**
 * Components
 */
import { AppComponent } from './app.component';
import { GridCardsComponent } from './components/grid-cards/grid-cards.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { InfoBarComponent } from './components/info-bar/info-bar.component';
import { ButtonComponent } from './components/button/button.component';
import { HeroImageComponent } from './components/hero-image/hero-image.component';

/**
 * Test Components
 */
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    GridCardsComponent,
    InfoBarComponent,
    ButtonComponent,
    HeroImageComponent,

    TestComponent, // Test Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
