import { Router } from '@angular/router';
import { OrderService } from '@app/services/order.service';
import { UserService } from './../../services/user.service';
import { ProductService } from '@app/services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  userOrders=[];
  fromDate; 
  toDate;
  
  paymentSuccess=false;
  paymentInitialized=false;
  expired=false;

  constructor(private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router) { }

  ngOnInit(): void {
    this.productService.getListOfUserOrders().subscribe((data:any)=>{
      this.userOrders = data.model.userOrders
    });
  }

  routeToOrderDetail(order) {
    this.router.navigateByUrl('/order-detail/'+order.orderNumber);
  }

  getRoleName() {
    return this.userService.getRoleName();
  }

  getOrderBetweenDates() {
    let status=[];
    if (this.expired) {
      status.push('EXPIRED')
    }
    if (this.paymentInitialized) {
      status.push('PAYMENT_INTIALIZED')
    }
    if (this.paymentSuccess) {
      status.push('PAYMENT_SUCCESS')
    }
    
    let order = {
      'from': this.fromDate + ' 00:00:00',
      'to': this.toDate + ' 00:00:00',
      'status' : status
    }
    this.orderService.getOrderBetweenDates(order).subscribe((res:any)=>{
      this.userOrders=res.model.userOrders;
    })
    
  }

}
