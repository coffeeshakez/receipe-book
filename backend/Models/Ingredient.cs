using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Ingredient
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        [Required]
        public required string Quantity { get; set; }

        [MaxLength(50)]
        public required string Measurement { get; set; }

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }

        [JsonIgnore]
        public List<Instruction> Instructions { get; set; } = new List<Instruction>();
    }
}