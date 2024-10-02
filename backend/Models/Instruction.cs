using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Instruction
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(1000)]
        public string InstructionText { get; set; }

        public int RecipeId { get; set; }
        public virtual Recipe Recipe { get; set; }

        public virtual ICollection<Ingredient> Ingredients { get; set; }
    }
}