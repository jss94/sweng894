using System.Threading.Tasks;
using Moq;
using source.Queries;
using Xunit;
using System.Collections.Generic;
using source.Controllers;
using Microsoft.AspNetCore.Mvc;
using source.Models;
using System;
using source.Database;

namespace UnitTests.Controllers
{
    public class VendorMetricsControllerShould
    {
        // System Under Test
        readonly VendorMetricsController _metricsController;
        readonly Mock<IVendorMetricsQuery> __metricsQueryMock;

        public VendorMetricsControllerShould()
        {
            __metricsQueryMock = new Mock<IVendorMetricsQuery>();

            _metricsController = new VendorMetricsController(__metricsQueryMock.Object);
        }

        [Fact]
        public void GetMonthlyReservationMetrics_ReturnMonthlyReservationCount()
        {
            //arrange
            var marchMetric = new ReservationCountMetric { dateCategory = "March", reservationCount = 5};
            var monthlyMetrics = new List<ReservationCountMetric> { marchMetric };


            //act
            __metricsQueryMock.Setup(x => x.GetMonthlyReservationCountMetricAsync(5))
                .Returns(Task.Factory.StartNew(() => monthlyMetrics));

            var task = _metricsController.GetMonthlyReservationMetrics(5);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var results = result.Value as List<ReservationCountMetric>;
            Assert.Equal("March", results[0].dateCategory);
            Assert.Equal(5, results[0].reservationCount);
        }

        [Fact]
        public void GetWeeklyReservationCountMetrics_ReturnWeeklyReservationsCount()
        {
            //arrange
            var tuesdayMetric = new ReservationCountMetric { dateCategory = "Tuesday", reservationCount = 2 };
            var weekdayMetrics = new List<ReservationCountMetric> { tuesdayMetric };


            //act
            __metricsQueryMock.Setup(x => x.GetWeekdayReservationCountMetricAsync(2))
                .Returns(Task.Factory.StartNew(() => weekdayMetrics));

            var task = _metricsController.GetWeeklyReservationCountMetrics(2);

            // assert
            Assert.IsType<OkObjectResult>(task.Result);

            var result = task.Result as OkObjectResult;
            var results = result.Value as List<WeekdayReservationCountMetric>;
            Assert.Equal("Tuesday", results[0].weekday);
            Assert.Equal(2, results[0].reservationCount);
        }

        [Fact]
        public void GetMonthlyReservationSalesMetrics_ReturnSalesMetrics()
        {
            throw new NotImplementedException();
        }

        [Fact]
        public void GetWeekdayReservationSalesMetrics_ReturnSalesMetrics()
        {
            throw new NotImplementedException();
        }

    }
}
