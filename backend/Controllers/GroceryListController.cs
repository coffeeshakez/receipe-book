// Controllers/GroceryListController.cs
using Microsoft.AspNetCore.Mvc;
using GroceryListApi.Models;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace GroceryListApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroceryListController : ControllerBase
    {
        private const string GroceryListFilePath = "MockData/groceryList.json";

        // Load grocery items from the JSON file
        private List<GroceryItem> LoadGroceryItems()
        {
            var json = System.IO.File.ReadAllText(GroceryListFilePath);
            return JsonSerializer.Deserialize<List<GroceryItem>>(json);
        }

        // Save grocery items to the JSON file
        private void SaveGroceryItems(List<GroceryItem> items)
        {
            var json = JsonSerializer.Serialize(items);
            System.IO.File.WriteAllText(GroceryListFilePath, json);
        }

        // GET: api/grocerylist/grocery-items
        [HttpGet("grocery-items")]
        public ActionResult<List<GroceryItem>> GetGroceryItems() => LoadGroceryItems();

        // POST: api/grocerylist/grocery-items
        [HttpPost("grocery-items")]
        public ActionResult<GroceryItem> AddGroceryItem(GroceryItem item)
        {
            var groceryItems = LoadGroceryItems();
            groceryItems.Add(item);
            SaveGroceryItems(groceryItems);
            return CreatedAtAction(nameof(GetGroceryItems), new { name = item.Name }, item);
        }
    }
}