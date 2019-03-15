using System.Collections.Generic;
using System.Threading.Tasks;
using source.Models;
using System;

namespace source.Queries
{
    public interface IVendorMetricsQuery
    {
        Task<List<MonthlyMetric>> GetMonthlyReservationMetricAsync(int vendorId);
        
    }
}