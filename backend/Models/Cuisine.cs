using System.Collections.Generic;

namespace backend.Models
{
    public class Cuisine
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Recipe> Recipes { get; set; }
    }
}
