namespace backend.DTOs
{
    public class InstructionDTO
    {
        public required string InstructionText { get; set; }
        public required List<IngredientDTO> Ingredients { get; set; }
    }
}