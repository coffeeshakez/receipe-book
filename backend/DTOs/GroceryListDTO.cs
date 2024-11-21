namespace backend.DTOs
{
    public class GroceryListDTO
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<GroceryItemDTO> Items { get; set; } = new();
    }
}