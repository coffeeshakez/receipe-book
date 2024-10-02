using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Ingredient
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public string Quantity { get; set; }

        [MaxLength(50)]
        public string Measurement { get; set; }

        [ForeignKey("Recipe")]
        public int RecipeId { get; set; }

        public virtual Recipe Recipe { get; set; }
    }
}