namespace GroceryListApi.Models
{
    public class GroceryItem
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public bool Checked { get; set; }
    }
}