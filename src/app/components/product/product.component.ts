import { UserService } from '@app/services/user.service';
import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {CartService} from '../../services/cart.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import * as _ from 'lodash';
import { NotificationService } from '@app/services/notification.service';

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
  productsOnLoad: any[] = [];
  thumbImages: any[] = [];
  userRole = '';
  inLineBlock=false;
  compRoute: ActivatedRoute;
  @ViewChild('fileInput') el: ElementRef;
  

  @ViewChild('quantity') quantityInput;

  constructor(private productService: ProductService,
              private userService: UserService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private router: Router,
              private notifyService : NotificationService) {
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
    this.userRole = this.userService.getRoleName();  
  }

  uploadFile(event) {
  }
  getAddRemoveButtonCss(product:any, origClass){
    if (product['userBuying']) {
      return 'inline-block';
    } else {
      return origClass;
    }
  }

  modifyQuantity(product:any, action:string) {
    if (action=='add') {
      product['quantity'] = product['quantity'] + 1;
    } else {
      product['quantity'] = product['quantity'] - 1;
    }
    if (product['quantity'] == 0) {
      product.userBuying = false;
      
    }
  }
  addToCart(product:any) {
    product['userBuying']=true;
    product['quantity']=1;
    
  }

  loadProducts() {
    if (this.categoryId) {
      this.productService.getAllProducts().subscribe((prod: any) => {
        this.products = prod.model.products;
        if (this.userService.getRoleName() != 'ADMIN') {
          this.products = this.products.filter(p=>{
            return p.status == 'ACTIVE';
           });
        }
        
        this.productsOnLoad = _.cloneDeep(this.products);
        //productsOnLoad
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

  adminUpdateProductDetails(productId) {
    if (this.userService.getRoleName() == 'ADMIN') {
      let modifiedProduct:any = this.products.filter(p=>p.productId == productId);
      let prdtTobSaved:any = {};
      prdtTobSaved['productId'] = productId;
      prdtTobSaved['name'] = modifiedProduct[0].name;
      prdtTobSaved['displayPricePerUnit'] = modifiedProduct[0].displayPricePerUnit;
      prdtTobSaved['sellingPricePerUnit'] = modifiedProduct[0].sellingPricePerUnit;
      prdtTobSaved['status'] = modifiedProduct[0].status;
      prdtTobSaved['unitInGramsPerUnit'] = modifiedProduct[0].unitInGramsPerUnit;
      prdtTobSaved['categoryId'] = modifiedProduct[0].categoryId;
      this.productService.updateProduct(prdtTobSaved).subscribe((res:any)=>{
       /* if (res && res.code == 200) {
          this.notifyService.showSuccess(res.model.msg, "Success");
        } */
      },(err)=>{
       // this.notifyService.showError(err.message, "Failure");
      })
      
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
