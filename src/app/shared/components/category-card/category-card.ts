import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss'
})
export class CategoryCard {

 // These inputs will receive data from the homepage
  @Input() iconUrl: string = '';
  @Input() categoryName: string = '';

}
