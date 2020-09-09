import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {UserService} from '../../services/user.service';
import { CategoryService } from '@app/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map  } from 'rxjs/operators';
import { ProductService } from '@app/services/product.service';

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
  prdts: any;
  public selectedProduct: any;
  constructor(public cartService: CartService,
              public userService: UserService,
              private productService: ProductService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories: any) => {
      //Access-Control-Allow-Origin :  *
      this.categories = categories.model.categoryInformations.sort(function(a, b){
        return a.priorityOrder == b.priorityOrder ? 0 : +(a.priorityOrder > b.priorityOrder) || -1;
      });
    });
    
    this.productService.getAllProducts().subscribe((prod: any) => {
      this.prdts = prod.model.products;
    });

   

    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.roleName = this.userService.getRoleName();
    this.authState = this.roleName != undefined && this.roleName.length > 0;
    // this.userService.authState$.subscribe(authState => this.authState = authState);
  }

  inputFormatter(value: any)   {
    if(value.name)
      return value.name
    return value;
  }

  resultFormatter(value: any)   {
    if(value.name)
      return value.name
    return value;
  }

  
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(prd => prd.length < 2 ? []
        : this.prdts.filter(v => v.name.toLowerCase().indexOf(prd.toLowerCase()) > -1).slice(0, 10))
    )
 

  searchProducts() {
    if (this.selectedProduct) {
      this.router.navigateByUrl('/product/1?'+'productId=' + this.selectedProduct.productId);
    }
    if (this.selectedCategory) {
      this.router.navigateByUrl('/product/'+this.selectedCategory.categoryId);
    }
  }

}
