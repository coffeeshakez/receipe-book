using System.Collections.Generic;

namespace backend.DTOs
{
    public class MenuDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> RecipeIds { get; set; }
    }

    public class CreateMenuDto
    {
        public string Name { get; set; }
        public List<int> RecipeIds { get; set; } = new List<int>();
    }

    public class UpdateMenuDto
    {
        public string Name { get; set; }
        public List<int> RecipeIds { get; set; }
    }
}
