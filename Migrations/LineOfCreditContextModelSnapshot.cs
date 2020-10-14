﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Models;

namespace demo.Migrations
{
    [DbContext(typeof(LineOfCreditContext))]
    partial class LineOfCreditContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.9");

            modelBuilder.Entity("Models.Client", b =>
                {
                    b.Property<int>("ClientId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CreditorId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasMaxLength(100);

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasMaxLength(100);

                    b.Property<byte[]>("Timestamp")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("BLOB");

                    b.HasKey("ClientId");

                    b.HasIndex("CreditorId");

                    b.ToTable("Clients");
                });

            modelBuilder.Entity("Models.Creditor", b =>
                {
                    b.Property<int>("CreditorId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasMaxLength(100);

                    b.Property<byte[]>("Timestamp")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("BLOB");

                    b.HasKey("CreditorId");

                    b.ToTable("Creditors");
                });

            modelBuilder.Entity("Models.LineOfCredit", b =>
                {
                    b.Property<int>("LineOfCreditId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<decimal>("Balance")
                        .HasColumnType("TEXT");

                    b.Property<int>("ClientId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CreditorId")
                        .HasColumnType("INTEGER");

                    b.Property<decimal>("MinPaymentPercentage")
                        .HasColumnType("TEXT");

                    b.Property<byte[]>("Timestamp")
                        .IsConcurrencyToken()
                        .ValueGeneratedOnAddOrUpdate()
                        .HasColumnType("BLOB");

                    b.HasKey("LineOfCreditId");

                    b.HasIndex("ClientId");

                    b.HasIndex("CreditorId");

                    b.ToTable("LinesOfCredit");
                });

            modelBuilder.Entity("Models.Client", b =>
                {
                    b.HasOne("Models.Creditor", null)
                        .WithMany("Clients")
                        .HasForeignKey("CreditorId");
                });

            modelBuilder.Entity("Models.LineOfCredit", b =>
                {
                    b.HasOne("Models.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Models.Creditor", "Creditor")
                        .WithMany()
                        .HasForeignKey("CreditorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
