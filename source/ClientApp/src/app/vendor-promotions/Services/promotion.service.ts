import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Promotion } from '../Model/promotion.model';

@Injectable()
export class PromotionService {
  constructor(
      private auth: AuthService,
      ) {
  }

  getAllPromotions(vendorId: number): Observable<Promotion[]> {
      return this.auth.get('Promotion/vendor/' + vendorId);
  }

  getPromotion(promotionId: number): Observable<Promotion> {
    return this.auth.get('Promotion/' + promotionId);
  }

  createPromotion(promotion: Promotion): Observable<any> {
    return this.auth.post('Promotion/',  promotion);
  }

  deletePromotion(promotionId: number): Observable<any> {
    return this.auth.delete('Promotion/' + promotionId);
}
}
