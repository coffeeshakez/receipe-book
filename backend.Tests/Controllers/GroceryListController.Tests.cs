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
using backend.Controllers;

namespace backend.Tests.Controllers
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
            var actionResult = await _controller.GetAllGroceryLists();

            // Assert
            var result = Assert.IsType<ActionResult<IEnumerable<GroceryListDTO>>>(actionResult);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLists = Assert.IsType<List<GroceryListDTO>>(okResult.Value);
            Assert.Equal(expectedLists.Count, returnedLists.Count);
        }

        [Fact]
        public async Task GetGroceryList_ReturnsOkResult_WhenListExists()
        {
            // Arrange
            var listId = 1;
            var expectedList = new GroceryListDTO 
            { 
                Id = listId, 
                CreatedAt = DateTime.UtcNow,
                Items = new List<GroceryItemDTO>() 
            };
            _mockService.Setup(s => s.GetByIdAsync(listId)).ReturnsAsync(expectedList);

            // Act
            var actionResult = await _controller.GetGroceryList(listId);

            // Assert
            var result = Assert.IsType<ActionResult<GroceryListDTO>>(actionResult);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedList = Assert.IsType<GroceryListDTO>(okResult.Value);
            Assert.Equal(expectedList.Id, returnedList.Id);
        }

        [Fact]
        public async Task GetGroceryList_ReturnsNotFound_WhenListDoesNotExist()
        {
            // Arrange
            var listId = 999;
            _mockService.Setup(s => s.GetByIdAsync(listId))
                .ThrowsAsync(new NotFoundException($"Grocery list with ID {listId} not found"));

            // Act
            var actionResult = await _controller.GetGroceryList(listId);

            // Assert
            var result = Assert.IsType<ActionResult<GroceryListDTO>>(actionResult);
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateGroceryList_ReturnsCreatedAtAction()
        {
            // Arrange
            var newList = new GroceryListDTO 
            { 
                Id = 1, 
                CreatedAt = DateTime.UtcNow,
                Items = new List<GroceryItemDTO>() 
            };
            _mockService.Setup(s => s.CreateAsync()).ReturnsAsync(newList);

            // Act
            var actionResult = await _controller.CreateGroceryList(null);

            // Assert
            var result = Assert.IsType<ActionResult<GroceryListDTO>>(actionResult);
            var createdAtResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(GroceryListController.GetGroceryList), createdAtResult.ActionName);
            var returnedList = Assert.IsType<GroceryListDTO>(createdAtResult.Value);
            Assert.Equal(newList.Id, returnedList.Id);
        }

        [Fact]
        public async Task CreateGroceryListFromRecipe_ReturnsCreatedAtAction()
        {
            // Arrange
            var recipeId = 1;
            var newList = new GroceryListDTO 
            { 
                Id = 1, 
                CreatedAt = DateTime.UtcNow,
                Items = new List<GroceryItemDTO>() 
            };
            _mockService.Setup(s => s.CreateFromRecipeAsync(recipeId)).ReturnsAsync(newList);

            // Act
            var result = await _controller.CreateGroceryList(recipeId);

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
        public async Task RemoveGroceryItem_ReturnsNotFound_WhenItemDoesNotExist()
        {
            // Arrange
            var listId = 1;
            var itemId = 999;
            _mockService.Setup(s => s.RemoveItemAsync(listId, itemId))
                .ThrowsAsync(new NotFoundException($"Grocery item with ID {itemId} not found"));

            // Act
            var result = await _controller.RemoveGroceryItem(listId, itemId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
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
        public async Task AddRecipeToGroceryList_ReturnsNotFound_WhenListDoesNotExist()
        {
            // Arrange
            var listId = 999;
            var recipeId = 1;
            _mockService.Setup(s => s.AddRecipeToListAsync(listId, recipeId))
                .ThrowsAsync(new NotFoundException($"Grocery list with ID {listId} not found"));

            // Act
            var result = await _controller.AddRecipeToGroceryList(listId, recipeId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetAllGroceryLists_ReturnsOkResult_WhenEmpty()
        {
            // Arrange
            var emptyList = new List<GroceryListDTO>();
            _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(emptyList);

            // Act
            var actionResult = await _controller.GetAllGroceryLists();

            // Assert
            var result = Assert.IsType<ActionResult<IEnumerable<GroceryListDTO>>>(actionResult);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedLists = Assert.IsType<List<GroceryListDTO>>(okResult.Value);
            Assert.Empty(returnedLists);
        }

        [Fact]
        public async Task CreateGroceryListFromRecipe_ReturnsNotFound_WhenRecipeDoesNotExist()
        {
            // Arrange
            var invalidRecipeId = 999;
            _mockService.Setup(s => s.CreateFromRecipeAsync(invalidRecipeId))
                .ThrowsAsync(new NotFoundException($"Recipe with ID {invalidRecipeId} not found"));

            // Act
            var result = await _controller.CreateGroceryList(invalidRecipeId);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task AddGroceryItem_ReturnsNotFound_WhenListDoesNotExist()
        {
            // Arrange
            var invalidListId = 999;
            var itemDto = new GroceryItemDTO 
            { 
                Name = "Test Item",
                Quantity = "1",
                Unit = "piece"
            };
            _mockService.Setup(s => s.AddItemAsync(invalidListId, itemDto))
                .ThrowsAsync(new NotFoundException($"Grocery list with ID {invalidListId} not found"));

            // Act
            var result = await _controller.AddGroceryItem(invalidListId, itemDto);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateGroceryItem_ReturnsNotFound_WhenItemDoesNotExist()
        {
            // Arrange
            var listId = 1;
            var invalidItemId = 999;
            var patchDto = new GroceryItemPatchDTO { Checked = true };
            _mockService.Setup(s => s.PatchItemAsync(listId, patchDto))
                .ThrowsAsync(new NotFoundException($"Grocery item with ID {invalidItemId} not found"));

            // Act
            var result = await _controller.UpdateGroceryItem(listId, invalidItemId, patchDto);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateGroceryItem_ReturnsBadRequest_WhenPatchDataIsInvalid()
        {
            // Arrange
            var listId = 1;
            var itemId = 1;
            GroceryItemPatchDTO patchDto = null;

            // Act
            var result = await _controller.UpdateGroceryItem(listId, itemId, patchDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }
    }
} 