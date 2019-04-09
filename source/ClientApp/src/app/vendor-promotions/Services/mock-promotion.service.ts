
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Promotion } from '../Model/promotion.model';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class MockPromotionService {

  getAllPromotions(vendorId: number): Observable<Promotion[]> {
      return of(undefined);
  }

  getPromotion(promotionId: number): Observable<Promotion> {
    return of(undefined);
  }

  createPromotion(promotion: Promotion): Observable<any> {
    return of(undefined);
  }

  deletePromotion(promotionId: number): Observable<any> {
    return of(undefined);
  }
}
