using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class RecipeIngredient
    {
        public int Id { get; set; }

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        [Required]
        public required string Quantity { get; set; }

        [MaxLength(50)]
        public required string Measurement { get; set; }

        public List<Instruction> Instructions { get; set; } = new List<Instruction>();
    }
} 