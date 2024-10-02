using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Instruction
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(1000)]
        public required string InstructionText { get; set; }

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public List<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
    }
}