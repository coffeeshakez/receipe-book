using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class GroceryItem
    {
        public int Id { get; set; }
        
        [Required]
        public required string Name { get; set; }
        
        [Required]
        public required string Quantity { get; set; }
        
        [Required]
        public required string Unit { get; set; }
        
        public bool Checked { get; set; }
        
        public int GroceryListId { get; set; }
        public GroceryList GroceryList { get; set; } = null!;
    }
}