using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using System;

namespace source.Queries
{
    public interface IVendorPromotionQuery
    {
        Task<Promotion> GetPromotion(int promotionId);

        Task<List<Promotion>> GetPromotions(int vendorId);

        Task CreatePromotion(Promotion promotion);

        Task DeletePromotion(int promotionId);

    }
}