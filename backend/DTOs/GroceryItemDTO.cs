namespace backend.DTOs
{
    public class GroceryItemDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Quantity { get; set; }
        public required string Unit { get; set; }
        public bool Checked { get; set; }
    }
}