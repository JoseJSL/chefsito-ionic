import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe';

@Component({
  selector: 'app-recipe-card-grid',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent implements OnInit {
  public recipes: Recipe[];
  constructor() { }

  ngOnInit() {
    this.recipes = [
      {UID: 'test', ImageURL: 'https://i.imgur.com/6x1SJWN.png',  Title: 'Pay de quesooooooooooooooooooooooooooooooooo', TimeTip:{Description: '30 min', Icon: '', Color: ''}, Rating: 4.3, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      {UID: 'test', ImageURL: 'https://i.imgur.com/3nalEtz.png',  Title: 'Todo Mexicano', TimeTip:{Description: '1:05 hrs', Icon: '', Color: ''}, Rating: 4.8, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      {UID: 'test', ImageURL: 'https://i.imgur.com/SceNSUH.png',  Title: 'Pasta clásica', TimeTip:{Description: '25 min', Icon: '', Color: ''}, Rating: 4.2, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      {UID: 'test', ImageURL: 'https://i.imgur.com/tiRb69w.jpg',  Title: 'Lasagna como la del gato naranja', TimeTip:{Description: '1:20 hrs', Icon: '', Color: ''}, Rating: 4.9, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      {UID: 'test', ImageURL: 'https://i.imgur.com/d0DA0Jy.png',  Title: 'Bistec a la vistek', TimeTip:{Description: '80 min', Icon: '', Color: ''}, Rating: 4.9, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      {UID: 'test', ImageURL: 'https://i.imgur.com/RGkH3xu.png',  Title: 'Anborgesa', TimeTip:{Description: '45 min', Icon: '', Color: ''}, Rating: 4.1, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      {UID: 'test', ImageURL: 'https://i.imgur.com/tiRb69w.jpg',  Title: 'Lasagna como la del gato naranja', TimeTip:{Description: '1:20 hrs', Icon: '', Color: ''}, Rating: 4.9, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      {UID: 'test', ImageURL: 'https://i.imgur.com/tiRb69w.jpg',  Title: 'Lasagna como la del gato naranja', TimeTip:{Description: '1:20 hrs', Icon: '', Color: ''}, Rating: 4.9, UploadTime: new Date(), Author:{Name: 'Remy', ImageUrl: 'https://imgur.com/JgjqbN3.png'}},
      
    ]
  }

  getFullDate(date: Date){
    return date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
  }

}
