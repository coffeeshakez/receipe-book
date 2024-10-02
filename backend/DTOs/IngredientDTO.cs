namespace backend.DTOs
{
    public class IngredientDTO
    {
        public required string Name { get; set; }
        public required string Quantity { get; set; }
        public required string Measurement { get; set; }
    }
}