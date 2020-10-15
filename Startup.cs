using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;

using Breeze.AspNetCore;
using Breeze.Core;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Models;
namespace demo
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            var mvcBuilder = services.AddMvc();

            services.AddControllers().AddNewtonsoftJson(opt =>
            {
                // Set Breeze defaults for entity serialization
                var ss = JsonSerializationFns.UpdateWithDefaults(opt.SerializerSettings);
                if (ss.ContractResolver is DefaultContractResolver resolver)
                {
                    resolver.NamingStrategy = null;  // remove json camelCasing; names are converted on the client.
                }
                ss.Formatting = Newtonsoft.Json.Formatting.Indented; // format JSON for debugging
            });
            // Add Breeze exception filter to send errors back to the client
            mvcBuilder.AddMvcOptions(o => { o.Filters.Add(new GlobalExceptionFilter()); });

            // Add DbContext using connection string
            var connectionString = Configuration.GetConnectionString("LineOfCredit");
            services.AddDbContext<LineOfCreditContext>(options => options.UseSqlite(connectionString));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting(); 

            // Allow any host - development only!
            // TODO Harden cors
            app.UseCors(builder => builder
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed((host) => true)
                .AllowCredentials()
            );

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
