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
        [MaxLength(50)]
        public required string Category { get; set; }

        // Additional useful fields
        public string? Description { get; set; }
        public string? NutritionalInfo { get; set; }
        public bool IsAllergenic { get; set; }
        public string? AllergenType { get; set; }
        public string? CommonUnit { get; set; }

        // Navigation properties
        [JsonIgnore]
        public List<RecipeIngredient> RecipeIngredients { get; set; } = new List<RecipeIngredient>();
    }
}