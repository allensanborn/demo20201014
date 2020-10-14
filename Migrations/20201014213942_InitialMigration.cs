using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace demo.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Creditors",
                columns: table => new
                {
                    CreditorId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Timestamp = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Creditors", x => x.CreditorId);
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    ClientId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    Timestamp = table.Column<byte[]>(rowVersion: true, nullable: true),
                    CreditorId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.ClientId);
                    table.ForeignKey(
                        name: "FK_Clients_Creditors_CreditorId",
                        column: x => x.CreditorId,
                        principalTable: "Creditors",
                        principalColumn: "CreditorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LinesOfCredit",
                columns: table => new
                {
                    LineOfCreditId = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClientId = table.Column<int>(nullable: false),
                    CreditorId = table.Column<int>(nullable: false),
                    Balance = table.Column<decimal>(nullable: false),
                    MinPaymentPercentage = table.Column<decimal>(nullable: false),
                    Timestamp = table.Column<byte[]>(rowVersion: true, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LinesOfCredit", x => x.LineOfCreditId);
                    table.ForeignKey(
                        name: "FK_LinesOfCredit_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LinesOfCredit_Creditors_CreditorId",
                        column: x => x.CreditorId,
                        principalTable: "Creditors",
                        principalColumn: "CreditorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_CreditorId",
                table: "Clients",
                column: "CreditorId");

            migrationBuilder.CreateIndex(
                name: "IX_LinesOfCredit_ClientId",
                table: "LinesOfCredit",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_LinesOfCredit_CreditorId",
                table: "LinesOfCredit",
                column: "CreditorId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LinesOfCredit");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Creditors");
        }
    }
}
