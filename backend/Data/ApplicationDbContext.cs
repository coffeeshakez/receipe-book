using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Instruction> Instructions { get; set; }
        public DbSet<GroceryList> GroceryLists { get; set; }
        public DbSet<GroceryItem> GroceryItems { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Cuisine> Cuisines { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Ingredients)
                .WithOne(i => i.Recipe)
                .HasForeignKey(i => i.RecipeId);

            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Instructions)
                .WithOne(i => i.Recipe)
                .HasForeignKey(i => i.RecipeId);

            modelBuilder.Entity<Instruction>()
                .HasMany(i => i.Ingredients)
                .WithMany(i => i.Instructions)
                .UsingEntity(j => j.ToTable("IngredientInstruction"));

            modelBuilder.Entity<Menu>()
                .Property(m => m.RecipeIds)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
                );

            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.Category)
                .WithMany(c => c.Recipes)
                .HasForeignKey(r => r.CategoryId);

            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.Cuisine)
                .WithMany(c => c.Recipes)
                .HasForeignKey(r => r.CuisineId);
        }
    }
}
