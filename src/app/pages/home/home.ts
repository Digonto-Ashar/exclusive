import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'; // Import OnInit
import { CommonModule, SlicePipe } from '@angular/common';

// Import our new service and interface
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/interfaces/product.interface';
import { Slide } from '../../core/interfaces/slide.interface';

// Import all necessary components
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { CategoryCard } from '../../shared/components/category-card/category-card';
import { SkeletonProductCard} from '../../shared/components/skeleton-product-card/skeleton-product-card'; // Import the skeleton component
import { PromoBanner } from '../../shared/components/promo-banner/promo-banner'; // Import the promo banner component
import { ServiceFeature } from '../../shared/components/service-feature/service-feature'; // Import the service feature component

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    SectionHeader, 
    ProductCard, 
    CategoryCard,
    SkeletonProductCard,
    PromoBanner,
    ServiceFeature,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
   // References to our scrolling divs
  @ViewChild('productsCarousel') productsCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('categoryGrid') categoryGrid!: ElementRef<HTMLDivElement>;
  @ViewChild('exploreProductsSection') exploreProductsSection!: ElementRef<HTMLDivElement>;
  @ViewChild('flashSalesSection') flashSalesSection!: ElementRef<HTMLDivElement>;
  @ViewChild('bestSellingSection') bestSellingSection!: ElementRef<HTMLDivElement>;
  @ViewChild('flashSaleCarousel') flashSaleCarousel!: ElementRef<HTMLDivElement>;
  //@ViewChild('categoryGrid') categoryGrid!: ElementRef<HTMLDivElement>;
  @ViewChild('bestSellingCarousel') bestSellingCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('exploreProductsCarousel') exploreProductsCarousel!: ElementRef<HTMLDivElement>;

  public isCategoryMenuOpen = false;

  // Hero Slider Properties
  slides: Slide[] = [
    { brandInfo: 'iPhone 14 Series', title: 'Up to 10% off Voucher', shopNowLink: '#', imageUrl: 'assets/images/iphone-hero.png' },
    { brandInfo: 'Latest Headphones', title: 'Immersive Sound Experience', shopNowLink: '#', imageUrl: 'assets/images/headphone-hero.jpg' },
    { brandInfo: 'Gaming Consoles', title: 'Next-Gen Gaming is Here', shopNowLink: '#', imageUrl: 'assets/images/console2.jpg' }
  ];
  currentSlide = 0;
  private slideInterval: any;

  // Product Section Properties

  // Flash Sale Products
  flashSaleProducts: Product[] = [];
  isLoading: boolean = true;
  skeletonItems = Array(8).fill(0);
  public _allFlashSaleProducts: Product[] = [];
  public isFlashSalesExpanded: boolean = false;

  // Best Selling Products
  bestSellingProducts: Product[] = [];
  isBestSellingLoading: boolean = true;
  bestSellingSkeletonItems = Array(8).fill(0);
  public _allBestSellingProducts: Product[] = [];
  public isBestSellingExpanded: boolean = false;

  // NEW: Properties for the "Explore Our Products" section
  exploreProducts: Product[] = [];
  isExploreLoading: boolean = true;
  exploreSkeletonItems = Array(8).fill(0); // For the 8-product grid
  private _allExploreProducts: Product[] = []; // This will hold ALL products from the API
  public isExploreProductsExpanded: boolean = false; // This tracks if we're showing "All" or "Less"

  // Countdown timer properties
  private timerInterval: any;
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
  // Static data
  categories = [ "Woman's Fashion", "Men's Fashion", "Electronics", "Home & Lifestyle", "Medicine", "Sports & Outdoor", "Baby's & Toys", "Groceries & Pets", "Health & Beauty" ];
  browseCategories = [ { name: 'Phones', icon: 'assets/icons/phone.svg' }, { name: 'Computers', icon: 'assets/icons/computer.svg' }, { name: 'SmartWatch', icon: 'assets/icons/smartwatch.svg' }, { name: 'Camera', icon: 'assets/icons/camera.svg' }, { name: 'HeadPhones', icon: 'assets/icons/headphone.svg' }, { name: 'Gaming', icon: 'assets/icons/gamepad.svg' } ];
  serviceFeatures = [ { iconUrl: 'assets/icons/delivery.svg', title: 'FREE AND FAST DELIVERY', subtitle: 'Free delivery for all orders over $140' }, { iconUrl: 'assets/icons/support.svg', title: '24/7 CUSTOMER SERVICE', subtitle: 'Friendly 24/7 customer support' }, { iconUrl: 'assets/icons/secure.svg', title: 'MONEY BACK GUARANTEE', subtitle: 'We return money within 30 days' } ];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadFlashSaleProducts();
    this.loadBestSellingProducts();
    this.loadExploreProducts(); // NEW: Call the new load function
    this.startTimer();
    this.startSlideShow();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) { clearInterval(this.timerInterval); }
    if (this.slideInterval) { clearInterval(this.slideInterval); }
  }

    toggleCategoryMenu(): void {
        console.log('Category menu button clicked!'); 
  this.isCategoryMenuOpen = !this.isCategoryMenuOpen;
  console.log('isCategoryMenuOpen is now:', this.isCategoryMenuOpen);

  }

  closeCategoryMenu(): void {
    this.isCategoryMenuOpen = false;
  }

  // --- NEW: Function to toggle the "Explore Our Products" view ---  
  toggleExploreProductsView(): void {
    if (this.isExploreProductsExpanded) {
      this.exploreProductsSection.nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    this.isExploreProductsExpanded = !this.isExploreProductsExpanded;
    if (this.isExploreProductsExpanded) {
      this.exploreProducts = this._allExploreProducts.slice(0, 20);
    } else {
      this.exploreProducts = this._allExploreProducts.slice(0, 8);
    }
  }

  // NEW: Function to toggle the flash sales view
toggleFlashSalesView(): void {
  if (this.isFlashSalesExpanded) {
    this.flashSalesSection.nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  this.isFlashSalesExpanded = !this.isFlashSalesExpanded;
  if (this.isFlashSalesExpanded) {
    this.flashSaleProducts = this._allFlashSaleProducts.slice(0, 20);
  } else {
    this.flashSaleProducts = this._allFlashSaleProducts.slice(0, 16); // Or your default number
  }
}

// Function to toggle the best selling products view
toggleBestSellingView(): void {
  if (this.isBestSellingExpanded) {
    this.bestSellingSection.nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  this.isBestSellingExpanded = !this.isBestSellingExpanded;
  if (this.isBestSellingExpanded) {
    this.bestSellingProducts = this._allBestSellingProducts.slice(0, 20);
  } else {
    this.bestSellingProducts = this._allBestSellingProducts.slice(0, 16); // Or your default number
  }
}


  // Function to load data for the "Explore" section ---
  loadExploreProducts(): void {
    this.isExploreLoading = true;
    // We'll just grab a different "slice" of products from the same API endpoint
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this._allExploreProducts = data; 
        this.exploreProducts = this._allExploreProducts.slice(0, 8);  // Get the first 8 products for the grid
        this.isExploreLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching explore products', err);
        this.isExploreLoading = false;
      }
    });
  }

// Function to load flash sale products
loadFlashSaleProducts(): void {
  this.isLoading = true;
  this.productService.getProducts().subscribe({
    next: (data) => {
      const allProducts = data.map(product => ({ 
        ...product, 
        discountPercent: 40, 
        oldPrice: parseFloat((product.price / 0.6).toFixed(2)) 
      }));
      this._allFlashSaleProducts = allProducts; // Save all
      this.flashSaleProducts = this._allFlashSaleProducts.slice(0, 16); // Show default
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error fetching flash sale products', err);
      this.isLoading = false;
    }
  });
}

// Function to load best selling products

loadBestSellingProducts(): void {
  this.isBestSellingLoading = true;
  this.productService.getProducts().subscribe({
    next: (data: Product[]) => {
      const bestSelling = data.slice(8, 28); // Get a different slice for variety
      this._allBestSellingProducts = bestSelling; // Save all
      this.bestSellingProducts = this._allBestSellingProducts.slice(0, 12); // Show default
      this.isBestSellingLoading = false;
    },
    error: (err) => {
      console.error('Error fetching best selling products', err);
      this.isBestSellingLoading = false;
    }
  });
}

  // --- 2. THE NEW, POWERFUL, REUSABLE SCROLL FUNCTION ---
  scrollCarousel(direction: 'left' | 'right', carouselElement: ElementRef<HTMLDivElement>): void {
    const scrollAmount = direction === 'left' ? -300 : 300;
    if (carouselElement && carouselElement.nativeElement) {
      carouselElement.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // --- 3. THE ORIGINAL CATEGORY SCROLL FUNCTIONS (if you still need them) ---
  scrollCategoriesLeft(): void { this.categoryGrid.nativeElement.scrollBy({ left: -300, behavior: 'smooth' }); }
  scrollCategoriesRight(): void { this.categoryGrid.nativeElement.scrollBy({ left: 300, behavior: 'smooth' }); }
  

  // All other methods (startSlideShow, startTimer, scroll functions, etc.) remain the same

    // All other methods (startSlideShow, startTimer, scroll functions, etc.) remain the same
  startSlideShow() { this.slideInterval = setInterval(() => { this.currentSlide = (this.currentSlide + 1) % this.slides.length; }, 5000); }
  goToSlide(slideIndex: number): void { this.currentSlide = slideIndex; clearInterval(this.slideInterval); this.startSlideShow(); }
  startTimer(): void { const saleEndDate = new Date(); saleEndDate.setDate(saleEndDate.getDate() + 3); this.timerInterval = setInterval(() => { const now = new Date().getTime(); const distance = saleEndDate.getTime() - now; if (distance < 0) { clearInterval(this.timerInterval); this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 }; } else { this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24)); this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000); } }, 1000); }
  
}
