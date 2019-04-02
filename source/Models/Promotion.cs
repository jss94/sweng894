namespace source.Models
{
    public class Promotion

    {
        // promotion identifier
        public int promotionId { get; set; }

        // reference to the vendor who created the promotion.
        public int vendorId { get; set; }
        
        //The date that the promotion will start.
        public string startDate { get; set; }

        //The date that the promotion will end.
        public string endDate { get; set; }

        // Type of promotion (i.e. PercentageOff, DollarOff)
        public string promotionType { get; set; }

        // Discounted amount.  Dependent upon promotionType
        public int discount { get; set; }

        public string description { get; set; }
    }
}
