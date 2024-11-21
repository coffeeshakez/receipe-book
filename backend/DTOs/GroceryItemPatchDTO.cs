using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class GroceryItemPatchDTO
    {
        [JsonIgnore]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Quantity { get; set; }
        public string? Unit { get; set; }
        public bool? Checked { get; set; }
    }
} 