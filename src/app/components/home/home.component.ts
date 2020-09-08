import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';
import {ProductModelServer, ServerResponse} from '../../models/product.model';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1700/500`);

  categories = [];


  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories: any) => {
      //Access-Control-Allow-Origin :  *
      this.categories = categories.model.categoryInformations.sort(function(a, b){
        return a.priorityOrder == b.priorityOrder ? 0 : +(a.priorityOrder > b.priorityOrder) || -1;
      });
    });
  }
}
