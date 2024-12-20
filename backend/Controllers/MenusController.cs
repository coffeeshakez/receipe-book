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

        public MenusController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Menus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            var menus = await _context.Menus.ToListAsync();
            return menus.Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                RecipeIds = m.RecipeIds
            }).ToList();
        }

        // GET: api/Menus/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuDto>> GetMenu(int id)
        {
            var menu = await _context.Menus.FindAsync(id);

            if (menu == null)
            {
                return NotFound();
            }

            return new MenuDto
            {
                Id = menu.Id,
                Name = menu.Name,
                RecipeIds = menu.RecipeIds
            };
        }

        // POST: api/Menus
        [HttpPost]
        public async Task<ActionResult<MenuDto>> PostMenu(CreateMenuDto createMenuDto)
        {
            var menu = new Menu
            {
                Name = createMenuDto.Name,
                RecipeIds = createMenuDto.RecipeIds
            };

            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenu), new { id = menu.Id }, new MenuDto
            {
                Id = menu.Id,
                Name = menu.Name,
                RecipeIds = menu.RecipeIds
            });
        }

        // PUT: api/Menus/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenu(int id, UpdateMenuDto updateMenuDto)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu == null)
            {
                return NotFound();
            }

            menu.Name = updateMenuDto.Name;
            menu.RecipeIds = updateMenuDto.RecipeIds;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenuExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool MenuExists(int id)
        {
            return _context.Menus.Any(e => e.Id == id);
        }
    }
}
