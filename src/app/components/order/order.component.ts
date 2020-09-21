import { ProductService } from '@app/services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  userOrders=[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getListOfUserOrders().subscribe((data:any)=>{
      this.userOrders = data.model.userOrders
    });
  }

}
