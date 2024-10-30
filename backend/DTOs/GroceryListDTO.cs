namespace backend.DTOs
{
    public class GroceryListDTO
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<GroceryItemDTO> Items { get; set; } = new List<GroceryItemDTO>();
    }
}

public class GroceryItemDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Quantity { get; set; }
    public string Unit { get; set; }
    public bool Checked { get; set; }
}