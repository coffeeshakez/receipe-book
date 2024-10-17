using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenusController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<MenusController> _logger;

        public MenusController(ApplicationDbContext context, ILogger<MenusController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            var menus = await _context.Menus
                .Include(m => m.Recipes)
                .ToListAsync();

            return Ok(menus.Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                RecipeIds = m.Recipes.Select(r => r.Id).ToList()
            }));
        }

        [HttpPost]
        public async Task<ActionResult<MenuDto>> CreateMenu(CreateMenuDto createMenuDto)
        {
            _logger.LogInformation($"Attempting to create menu: {createMenuDto.Name}");
            var menu = new Menu { Name = createMenuDto.Name };
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenu), new { id = menu.Id }, new MenuDto
            {
                Id = menu.Id,
                Name = menu.Name,
                RecipeIds = new List<int>()
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenu(int id, UpdateMenuDto updateMenuDto)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu == null)
            {
                return NotFound();
            }

            menu.Name = updateMenuDto.Name;
            menu.Recipes = await _context.Recipes.Where(r => updateMenuDto.RecipeIds.Contains(r.Id)).ToListAsync();

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MenuDto>> GetMenu(int id)
        {
            var menu = await _context.Menus
                .Include(m => m.Recipes)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (menu == null)
            {
                return NotFound();
            }

            return new MenuDto
            {
                Id = menu.Id,
                Name = menu.Name,
                RecipeIds = menu.Recipes.Select(r => r.Id).ToList()
            };
        }
    }
}
