import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.html',
  styleUrl: './section-header.scss'
})
export class SectionHeader{
  @Input() category: string = '';
  @Input() title: string = '';
  @Input() showViewAllButton: boolean = true;
}
