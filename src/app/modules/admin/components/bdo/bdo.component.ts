import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bdo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bdo.component.html',
  styleUrl: './bdo.component.css'
})
export class BdoComponent {
  public email = "kundan@gmail.com";
  constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('BDO List');
  }
}
