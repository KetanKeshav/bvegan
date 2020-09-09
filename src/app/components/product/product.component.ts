import { UserService } from '@app/services/user.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {CartService} from '../../services/cart.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {map} from 'rxjs/operators';

declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit { //, AfterViewInit
  categoryId: number;
  prdtId;
  products: any[] = [];
  thumbImages: any[] = [];
  userRole = '';
  compRoute: ActivatedRoute;
  

  @ViewChild('quantity') quantityInput;

  constructor(private productService: ProductService,
              private userService: UserService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private router: Router) {
              this.compRoute = route;
              this.route.params.subscribe(q => {
                this.categoryId = q.id;
                this.loadProducts();
              });
            
              this.route.queryParams.subscribe(q => {
                this.prdtId = q['productId'];
                this.loadProducts();
              });
                // override the route reuse strategy
      /*this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };*/
  }

  
  ngOnInit(): void {
      this.userService.userRoleName$.subscribe(rlName=> {
        this.userRole = rlName;
      });

      
     
  }

 

  loadProducts() {
    if (this.categoryId) {
      this.productService.getAllProducts().subscribe((prod: any) => {
        this.products = prod.model.products;
        let prdts = this.products.filter(p=>{
         return p.categoryId == this.categoryId;
        }).sort(function(a, b){
          return a.priorityOrder == b.priorityOrder ? 0 : +(a.priorityOrder > b.priorityOrder) || -1;
        });
        
        let nonCatPrdts = this.products.filter(p=>{
          return p.categoryId != this.categoryId;
        }).sort(function(a, b){
          return a.priorityOrder == b.priorityOrder ? 0 : +(a.priorityOrder > b.priorityOrder) || -1;
        });
        
        nonCatPrdts.forEach(p=>{
          prdts.push(p);
        });
        this.products = prdts;
        if (this.prdtId) {
          this.products = prdts.filter(p=>{
            return p.productId == this.prdtId;
           });
        }
      });
      
    }
  }

  /*ngAfterViewInit(): void {
// Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    // tslint:disable-next-line:prefer-const
    const zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  Increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);

    if (this.product.quantity >= 1) {
      value++;

      if (value > this.product.quantity) {
        value = this.product.quantity;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();

  }

  Decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);

    if (this.product.quantity > 0) {
      value--;

      if (value <= 1) {
        value = 1;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  addToCart(id: number) {
    this.cartService.AddProductToCart(id, this.quantityInput.nativeElement.value);
  }*/
}
