using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using backend.Services;
using backend.DTOs;
using backend.Exceptions;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace backend.Controllers.Tests
{
    public class GroceryListControllerTests
    {
        private readonly Mock<IGroceryListService> _mockService;
        private readonly Mock<ILogger<GroceryListController>> _mockLogger;
        private readonly GroceryListController _controller;

        public GroceryListControllerTests()
        {
            _mockService = new Mock<IGroceryListService>();
            _mockLogger = new Mock<ILogger<GroceryListController>>();
            _controller = new GroceryListController(_mockService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetAllGroceryLists_ReturnsOkResult_WithLists()
        {
            // Arrange
            var expectedLists = new List<GroceryListDTO>
            {
                new() { Id = 1, Items = new List<GroceryItemDTO>() },
                new() { Id = 2, Items = new List<GroceryItemDTO>() }
            };
            _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(expectedLists);

            // Act
            var result = await _controller.GetAllGroceryLists();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLists = Assert.IsType<List<GroceryListDTO>>(okResult.Value);
            Assert.Equal(expectedLists.Count, returnedLists.Count);
        }

        [Fact]
        public async Task GetGroceryList_ReturnsOkResult_WhenListExists()
        {
            // Arrange
            var listId = 1;
            var expectedList = new GroceryListDTO { Id = listId, Items = new List<GroceryItemDTO>() };
            _mockService.Setup(s => s.GetByIdAsync(listId)).ReturnsAsync(expectedList);

            // Act
            var result = await _controller.GetGroceryList(listId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedList = Assert.IsType<GroceryListDTO>(okResult.Value);
            Assert.Equal(listId, returnedList.Id);
        }

        [Fact]
        public async Task GetGroceryList_ReturnsNotFound_WhenListDoesNotExist()
        {
            // Arrange
            var listId = 999;
            _mockService.Setup(s => s.GetByIdAsync(listId))
                .ThrowsAsync(new NotFoundException($"Grocery list with ID {listId} not found"));

            // Act
            var result = await _controller.GetGroceryList(listId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateGroceryList_ReturnsCreatedAtAction_WhenSuccessful()
        {
            // Arrange
            var newList = new GroceryListDTO { Id = 1, Items = new List<GroceryItemDTO>() };
            _mockService.Setup(s => s.CreateAsync()).ReturnsAsync(newList);

            // Act
            var result = await _controller.CreateGroceryList(null);

            // Assert
            var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(GroceryListController.GetGroceryList), createdAtResult.ActionName);
            var returnedList = Assert.IsType<GroceryListDTO>(createdAtResult.Value);
            Assert.Equal(newList.Id, returnedList.Id);
        }

        [Fact]
        public async Task AddGroceryItem_ReturnsCreatedAtAction_WhenSuccessful()
        {
            // Arrange
            var listId = 1;
            var itemDto = new GroceryItemDTO 
            { 
                Name = "Test Item",
                Quantity = "1",
                Unit = "piece",
                Checked = false
            };
            var createdItem = new GroceryItemDTO 
            { 
                Id = 1,
                Name = itemDto.Name,
                Quantity = itemDto.Quantity,
                Unit = itemDto.Unit,
                Checked = itemDto.Checked
            };
            
            _mockService.Setup(s => s.AddItemAsync(listId, itemDto)).ReturnsAsync(createdItem);

            // Act
            var result = await _controller.AddGroceryItem(listId, itemDto);

            // Assert
            var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(GroceryListController.GetGroceryList), createdAtResult.ActionName);
            var returnedItem = Assert.IsType<GroceryItemDTO>(createdAtResult.Value);
            Assert.Equal(createdItem.Id, returnedItem.Id);
        }

        [Fact]
        public async Task UpdateGroceryItem_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var listId = 1;
            var itemId = 1;
            var patchDto = new GroceryItemPatchDTO { Checked = true };
            var updatedItem = new GroceryItemDTO 
            { 
                Id = itemId,
                Name = "Test Item",
                Quantity = "1",
                Unit = "piece",
                Checked = true
            };
            
            _mockService.Setup(s => s.PatchItemAsync(listId, patchDto)).ReturnsAsync(updatedItem);

            // Act
            var result = await _controller.UpdateGroceryItem(listId, itemId, patchDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedItem = Assert.IsType<GroceryItemDTO>(okResult.Value);
            Assert.Equal(updatedItem.Id, returnedItem.Id);
            Assert.Equal(updatedItem.Checked, returnedItem.Checked);
        }

        [Fact]
        public async Task RemoveGroceryItem_ReturnsNoContent_WhenSuccessful()
        {
            // Arrange
            var listId = 1;
            var itemId = 1;
            _mockService.Setup(s => s.RemoveItemAsync(listId, itemId)).ReturnsAsync(true);

            // Act
            var result = await _controller.RemoveGroceryItem(listId, itemId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task AddRecipeToGroceryList_ReturnsOkResult_WhenSuccessful()
        {
            // Arrange
            var listId = 1;
            var recipeId = 1;
            var expectedItems = new List<GroceryItemDTO>
            {
                new() { Id = 1, Name = "Item 1", Quantity = "1", Unit = "piece" },
                new() { Id = 2, Name = "Item 2", Quantity = "2", Unit = "pieces" }
            };
            
            _mockService.Setup(s => s.AddRecipeToListAsync(listId, recipeId)).ReturnsAsync(expectedItems);

            // Act
            var result = await _controller.AddRecipeToGroceryList(listId, recipeId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedItems = Assert.IsType<List<GroceryItemDTO>>(okResult.Value);
            Assert.Equal(expectedItems.Count, returnedItems.Count);
        }

        [Fact]
        public async Task GetAllGroceryLists_Returns500_WhenServiceThrows()
        {
            // Arrange
            _mockService.Setup(s => s.GetAllAsync()).ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.GetAllGroceryLists();

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }
    }
} 