import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.scss']
})
export class AproposComponent implements OnInit {
src= "./../../../assets/maison2.png";
  constructor() { }

  ngOnInit(): void {
  }
  orange(){
    this.src= "./../../../assets/maison1.png";
  }
  gris(){
    this.src= "./../../../assets/maison2.png";
  }

}
