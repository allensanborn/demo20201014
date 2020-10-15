in cmd run
SET ASPNETCORE_Environment=Development
dotnet dev-certs https --trust
dotnet build
dotnet run

https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-3.1&tabs=netcore-cli
https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react-with-redux?view=aspnetcore-3.1

dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet ef migrations add InitialCreate
dotnet ef database update

generate metadata 
dotnet .\bin\Debug\netcoreapp3.1\demo.dll metadata > metadata.json