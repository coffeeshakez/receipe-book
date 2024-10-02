namespace backend.DTOs
{
    public class RecipeDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Img { get; set; }
        public required string Description { get; set; }
        public required List<IngredientDTO> Ingredients { get; set; }
        public required List<InstructionDTO> Instructions { get; set; }
    }
}