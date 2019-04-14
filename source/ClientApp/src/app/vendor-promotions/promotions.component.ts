import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Promotion } from './Model/promotion.model';
import { PromotionService } from './Services/promotion.service';
import { VendorService } from '../vendors/Services/vendor.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: [ './promotions.component.css']
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  vendorId: number;
  selectedPromotionType: string;

  promotionForm = new FormGroup({
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    discount: new FormControl('', [Validators.required]),
  });

  options: DropDownOption[] = [
    { value: 'dollar', viewValue: 'Dollar Off' },
    { value: 'percent', viewValue: 'Percentage Off' },
  ];

  constructor(
    private auth: AuthService,
    private vendorService: VendorService,
    private promotionService: PromotionService,
    private snackbar: MatSnackBar,
    private datePipe: DatePipe,
   ) {
  }

  ngOnInit() {
    if (this.auth.user) {
      this.setPromotions(this.auth.user);
    } else {
      this.auth.user$.subscribe((user) => {
        this.setPromotions(user);
      });
    }
  }

  setPromotions(user: User) {
    this.vendorService.getVendor(user.userName).subscribe(vendor => {
      this.vendorId = vendor.id;
      this.promotionService.getAllPromotions(this.vendorId).subscribe(response => {
          this.promotions = response;
      });
    });
  }

  onCreate(): void {
    const promotionStartDate = this.formatDate(this.promotionForm.controls['startDate'].value);
    const promotionEndDate = this.formatDate(this.promotionForm.controls['endDate'].value);

    const promotion: Promotion = {
      vendorId: this.vendorId,
      startDate: promotionStartDate,
      endDate: promotionEndDate,
      description: this.promotionForm.controls['description'].value,
      promotionType: this.selectedPromotionType,
      discount: this.promotionForm.controls['discount'].value,
     };

    this.promotionService.createPromotion(promotion).subscribe(() => {
      this.ngOnInit();
      this.promotionForm.reset();
      this.snackbar.open('Successfully Created Promotion', '', {
        duration: 1500
      });
    });

  }

  formatDate(promotionDate: any): any {
    return this.datePipe.transform(promotionDate, 'yyyy-MM-dd');
  }

   deletePromotion(promotionId: number): void {
    this.promotionService.deletePromotion(promotionId).subscribe(() => {
      // reload page
      this.ngOnInit();
      this.snackbar.open('Successfully Deleted Promotion', '', {
        duration: 3000
      });
    });
  }
}

export interface DropDownOption {
  value: string;
  viewValue: string;
}
