namespace backend.DTOs
{
    public class CuisineWithRecipesDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<RecipeSummaryDto> Recipes { get; set; }
        public int TotalRecipes { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
    }

    public class RecipeSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Img { get; set; }
        public string Category { get; set; }
    }
}
