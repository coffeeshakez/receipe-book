using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMenuSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MenuRecipe");

            migrationBuilder.AddColumn<int>(
                name: "RecipeId",
                table: "Menus",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecipeIds",
                table: "Menus",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Menus_RecipeId",
                table: "Menus",
                column: "RecipeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Menus_Recipes_RecipeId",
                table: "Menus",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Menus_Recipes_RecipeId",
                table: "Menus");

            migrationBuilder.DropIndex(
                name: "IX_Menus_RecipeId",
                table: "Menus");

            migrationBuilder.DropColumn(
                name: "RecipeId",
                table: "Menus");

            migrationBuilder.DropColumn(
                name: "RecipeIds",
                table: "Menus");

            migrationBuilder.CreateTable(
                name: "MenuRecipe",
                columns: table => new
                {
                    MenusId = table.Column<int>(type: "INTEGER", nullable: false),
                    RecipesId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuRecipe", x => new { x.MenusId, x.RecipesId });
                    table.ForeignKey(
                        name: "FK_MenuRecipe_Menus_MenusId",
                        column: x => x.MenusId,
                        principalTable: "Menus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuRecipe_Recipes_RecipesId",
                        column: x => x.RecipesId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuRecipe_RecipesId",
                table: "MenuRecipe",
                column: "RecipesId");
        }
    }
}
