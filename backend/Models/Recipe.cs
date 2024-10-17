using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Img { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int CuisineId { get; set; }
        public Cuisine Cuisine { get; set; }
        public List<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
        public List<Instruction> Instructions { get; set; } = new List<Instruction>();
    }
}
