namespace backend.DTOs
{
    public class RecipeIngredientDTO
    {
        public int IngredientId { get; set; }
        public required string Quantity { get; set; }
        public required string Measurement { get; set; }
    }
} 