
import { Promotion } from 'src/app/vendor-promotions/Model/promotion.model';

export class FakePromotion implements Promotion {
  description: 'promotionDescription';
  promotionId: 1;
  promotionType: 'percent';
  discount: '15';
  vendorId: 1;
  startDate: '2019-01-01';
  endDate: '2019-01-16';
}

export class FakePromotions {
    arr: Promotion[] = [
        new FakePromotion(),
        new FakePromotion(),
        new FakePromotion(),
    ];
}
