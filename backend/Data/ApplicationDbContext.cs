using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Collections.Generic;
using System.Linq;

namespace backend.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<Recipe> Recipes { get; set; } = null!;
        public DbSet<Ingredient> Ingredients { get; set; } = null!;
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; } = null!;
        public DbSet<Instruction> Instructions { get; set; } = null!;
        public DbSet<GroceryList> GroceryLists { get; set; } = null!;
        public DbSet<GroceryItem> GroceryItems { get; set; } = null!;
        public DbSet<Menu> Menus { get; set; } = null!;
        public DbSet<Cuisine> Cuisines { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Recipe relationships
            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Instructions)
                .WithOne(i => i.Recipe)
                .HasForeignKey(i => i.RecipeId);

            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.Category)
                .WithMany(c => c.Recipes)
                .HasForeignKey(r => r.CategoryId);

            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.Cuisine)
                .WithMany(c => c.Recipes)
                .HasForeignKey(r => r.CuisineId);

            // RecipeIngredient relationships
            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(ri => ri.Recipe)
                .WithMany(r => r.RecipeIngredients)
                .HasForeignKey(ri => ri.RecipeId);

            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(ri => ri.Ingredient)
                .WithMany(i => i.RecipeIngredients)
                .HasForeignKey(ri => ri.IngredientId);

            // Instruction-RecipeIngredient many-to-many relationship
            modelBuilder.Entity<Instruction>()
                .HasMany(i => i.RecipeIngredients)
                .WithMany(ri => ri.Instructions)
                .UsingEntity(j => j.ToTable("InstructionRecipeIngredient"));

            // Menu RecipeIds conversion and comparison
            modelBuilder.Entity<Menu>()
                .Property(m => m.RecipeIds)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
                )
                .Metadata.SetValueComparer(new ValueComparer<List<int>>(
                    (c1, c2) => c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()
                ));

            // GroceryList - GroceryItem relationship
            modelBuilder.Entity<GroceryList>()
                .HasMany(gl => gl.Items)
                .WithOne(gi => gi.GroceryList)
                .HasForeignKey(gi => gi.GroceryListId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
