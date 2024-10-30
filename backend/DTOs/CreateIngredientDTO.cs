namespace backend.DTOs
{
    public class CreateIngredientDTO
    {
        public required string Name { get; set; }
        public required string Category { get; set; }
        public string? Description { get; set; }
        public string? NutritionalInfo { get; set; }
        public bool IsAllergenic { get; set; }
        public string? AllergenType { get; set; }
        public string? CommonUnit { get; set; }
    }
} 