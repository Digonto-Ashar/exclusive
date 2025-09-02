import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { AnimatedAlert } from './shared/components/animated-alert/animated-alert';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, AnimatedAlert], 
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
 
}
