# Recipe Book Backend

## Database Setup and Troubleshooting

If you encounter issues with the database, such as missing tables or columns, follow these steps to reset and reinitialize your database:

1. Delete the existing database file:
   - Look for a file named `app.db` or similar in your project root or `Data` folder.
   - Delete this file.

2. Ensure your migrations are up to date:
   ```
   dotnet ef migrations add InitialCreate
   ```
   - If you already have migrations, you'll see a message indicating this.

3. Apply the migrations to create a new database with the correct schema:
   ```
   dotnet ef database update
   ```

4. Run your application:
   ```
   dotnet watch run
   ```

5. If you still encounter issues, check the following:
   - Ensure your `ApplicationDbContext.cs` file includes a `DbSet` for each of your models:
     ```csharp
     public class ApplicationDbContext : DbContext
     {
         public DbSet<Recipe> Recipes { get; set; }
         // ... other DbSets ...  

         public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
             : base(options)
         {
         }
     }
     ```
   - Verify that your `DbInitializer.cs` file is correctly seeding the database.
   - Check that your model classes (e.g., `Recipe.cs`) match the structure of your JSON seed data.

6. If problems persist, you may need to:
   - Delete all migration files in the `Migrations` folder.
   - Remove the database from your SQL Server.
   - Re-run the migration commands (steps 2 and 3).

Remember to always backup your data before performing these steps in a production environment.
