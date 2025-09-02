import { Routes } from '@angular/router';
import { Home} from './pages/home/home';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { Cart} from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Account } from './pages/account/account';
import { Profile } from './pages/account/profile/profile';
import { Wishlist  } from './pages/wishlist/wishlist'; 
import { ProductDetails} from './pages/product-details/product-details';
import { NotFound } from './pages/not-found/not-found';



export const routes: Routes = [
  // This is the homepage route. The empty path '' means it's the default page.
  { path: '', component: Home },

  // Other pages
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'product/:id', component: ProductDetails },
  { path: 'wishlist', component: Wishlist },

  // Nested routes for the account section
  {
    path: 'account',
    component: Account,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, // Default to profile
      { path: 'profile', component: Profile },
      

    ]
  },


  { path: '**', component: NotFound }
];
