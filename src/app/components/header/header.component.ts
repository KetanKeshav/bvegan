import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {UserService} from '../../services/user.service';
import { CategoryService } from '@app/services/category.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData: CartModelServer;
  cartTotal: number;
  authState: boolean;
  roleName = '';
  selectedCategory;
  categories;
  constructor(public cartService: CartService,
              public userService: UserService,
              private categoryService: CategoryService
  ) {
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories: any) => {
      //Access-Control-Allow-Origin :  *
      this.categories = categories.model.categoryInformations.sort(function(a, b){
        return a.priorityOrder == b.priorityOrder ? 0 : +(a.priorityOrder > b.priorityOrder) || -1;
      });
    });


    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.roleName = this.userService.getRoleName();
    this.authState = this.roleName != undefined && this.roleName.length > 0;
    // this.userService.authState$.subscribe(authState => this.authState = authState);
  }

  searchProducts() {
    
  }

}
