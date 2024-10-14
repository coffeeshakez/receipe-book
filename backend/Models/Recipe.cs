using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Recipe
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        public required string Img { get; set; }

        [Required]
        public required string Category { get; set; } // MainCourse, Dessert, Starter

        [Required]
        public required string Cuisine { get; set; } // Italian, Indian, etc.

        public List<Ingredient> Ingredients { get; set; }
        public List<Instruction> Instructions { get; set; }
    }
}
