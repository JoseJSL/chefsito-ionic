import { Component, OnInit } from '@angular/core';
import { ExploreCategory } from '../explore-category';

@Component({
  selector: 'app-explore-card',
  templateUrl: './explore-card.component.html',
  styleUrls: ['./explore-card.component.scss'],
})
export class ExploreCardComponent implements OnInit {
  public imgUrl: string;
  public title: string;
  public categories: ExploreCategory[];
  constructor() { 
  }

  ngOnInit() {
    this.categories = [
      {imgUrl:'https://i.imgur.com/6x1SJWN.png', title:'Postres'},
      {imgUrl:'https://i.imgur.com/3nalEtz.png', title:'Mexicana'},
      {imgUrl:'https://i.imgur.com/qDm7m0b.jpg', title:'Vegetariana'},
      {imgUrl:'https://i.imgur.com/0L1YST8.png', title:'Bebidas'},
      {imgUrl:'https://i.imgur.com/tKJN0NW.png', title:'Sushi'},
      {imgUrl:'https://i.imgur.com/d0DA0Jy.png', title:'Carnes'},
      {imgUrl:'https://i.imgur.com/SceNSUH.png', title:'Pastas'},
      {imgUrl:'https://i.imgur.com/2OWKZtO.png', title:'Pescados y Mariscos'},
      {imgUrl:'https://i.imgur.com/RGkH3xu.png', title:'Americana'},
      {imgUrl:'https://i.imgur.com/dE3BiPd.png', title:'Desayunos'},
      {imgUrl:'https://i.imgur.com/tiRb69w.jpg', title:'Italiana'},
      {imgUrl:'https://i.imgur.com/MKl99N4.jpg', title: 'Asiatica'}
    ];
  }
}
