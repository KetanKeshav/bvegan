import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {UserService} from '../../services/user.service';

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
  constructor(public cartService: CartService,
              public userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.roleName = this.userService.getRoleName();
    this.authState = this.roleName != undefined && this.roleName.length > 0;
    // this.userService.authState$.subscribe(authState => this.authState = authState);
  }

}
