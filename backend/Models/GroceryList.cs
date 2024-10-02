using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class GroceryList
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<GroceryItem> Items { get; set; } = new List<GroceryItem>();
    }
}