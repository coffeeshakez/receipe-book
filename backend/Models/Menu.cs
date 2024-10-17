using System.Collections.Generic;

namespace backend.Models
{
    public class Menu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Recipe> Recipes { get; set; } = new List<Recipe>();
    }
}
