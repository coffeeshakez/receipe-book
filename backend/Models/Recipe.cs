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

        public int CuisineId { get; set; }
        public Cuisine Cuisine { get; set; }

        public List<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
        public List<Instruction> Instructions { get; set; } = new List<Instruction>();
        public List<Menu> Menus { get; set; } = new List<Menu>();
    }
}
