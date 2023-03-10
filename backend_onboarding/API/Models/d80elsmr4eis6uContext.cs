using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Npgsql;

#nullable disable

namespace API.Models
{
    public partial class d80elsmr4eis6uContext : DbContext
    {
        public d80elsmr4eis6uContext()
        {
        }

        public d80elsmr4eis6uContext(DbContextOptions<d80elsmr4eis6uContext> options)
            : base(options)
        {
        }

        public virtual DbSet<LookupHobbyCategory> LookupHobbyCategories { get; set; }
        public virtual DbSet<LookupProgramOfStudyCategory> LookupProgramOfStudyCategories { get; set; }
        public virtual DbSet<QuestionnaireCountry> QuestionnaireCountries { get; set; }
        public virtual DbSet<QuestionnaireHobby> QuestionnaireHobbies { get; set; }
        public virtual DbSet<QuestionnaireHobbyCategory> QuestionnaireHobbyCategories { get; set; }
        public virtual DbSet<QuestionnaireIndustryExperience> QuestionnaireIndustryExperiences { get; set; }
        public virtual DbSet<QuestionnaireLanguage> QuestionnaireLanguages { get; set; }
        public virtual DbSet<QuestionnaireProgramOfStudy> QuestionnaireProgramOfStudies { get; set; }
        public virtual DbSet<QuestionnaireProgramOfStudyCategory> QuestionnaireProgramOfStudyCategories { get; set; }
        public virtual DbSet<QuestionnaireProjectInterest> QuestionnaireProjectInterests { get; set; }
        public virtual DbSet<QuestionnaireReasonsToJoin> QuestionnaireReasonsToJoins { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserCompatability> UserCompatabilities { get; set; }
        public virtual DbSet<UserCountry> UserCountries { get; set; }
        public virtual DbSet<UserDemographic> UserDemographics { get; set; }
        public virtual DbSet<UserHobby> UserHobbies { get; set; }
        public virtual DbSet<UserIndustryExperience> UserIndustryExperiences { get; set; }
        public virtual DbSet<UserLanguage> UserLanguages { get; set; }
        public virtual DbSet<UserProgramOfStudy> UserProgramOfStudies { get; set; }
        public virtual DbSet<UserProjectInterest> UserProjectInterests { get; set; }
        public virtual DbSet<UserReasonsToJoin> UserReasonsToJoins { get; set; }
        public virtual DbSet<UserReligion> UserReligions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var url = Environment.GetEnvironmentVariable("DATABASE_URL");
                if(url == null)
                {
                    url = "User ID=qhdnfykzfqptki;Password=ad77410c793d023714c38b394481f5d6027ffd1c9c56286495c11deaf880ce3a;Host=ec2-52-0-67-144.compute-1.amazonaws.com;Port=5432;Database=d80elsmr4eis6u;Pooling=true;SSL Mode=Require;TrustServerCertificate=True;";

                }
                else
                {
                    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
                    var databaseUri = new Uri(databaseUrl);
                    var userInfo = databaseUri.UserInfo.Split(':');

                    url = string.Format("User ID={0};Password={1};Host={2};Port={3};Database={4};Pooling=true;SSL Mode=Require;TrustServerCertificate=True;",
                        userInfo[0],
                        userInfo[1],
                        databaseUri.Host,
                        databaseUri.Port,
                        databaseUri.LocalPath.TrimStart('/'));
                }
                optionsBuilder.UseNpgsql(url);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "en_US.UTF-8");

            modelBuilder.Entity<LookupHobbyCategory>(entity =>
            {
                entity.ToTable("Lookup_HobbyCategories");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<LookupProgramOfStudyCategory>(entity =>
            {
                entity.ToTable("Lookup_ProgramOfStudyCategories");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<QuestionnaireCountry>(entity =>
            {
                entity.ToTable("Questionnaire_Countries");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<QuestionnaireHobby>(entity =>
            {
                entity.ToTable("Questionnaire_Hobby");

                entity.Property(e => e.Id).HasColumnName("ID");
            });

            modelBuilder.Entity<QuestionnaireHobbyCategory>(entity =>
            {
                entity.ToTable("Questionnaire_Hobby_Category");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasDefaultValueSql("nextval('\"QuestionnaireHobby_Category_ID_seq\"'::regclass)");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.HobbyId).HasColumnName("HobbyID");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.QuestionnaireHobbyCategories)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_LookupHobbyCategories");

                entity.HasOne(d => d.Hobby)
                    .WithMany(p => p.QuestionnaireHobbyCategories)
                    .HasForeignKey(d => d.HobbyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_QuestionnaireHobby");
            });

            modelBuilder.Entity<QuestionnaireIndustryExperience>(entity =>
            {
                entity.ToTable("Questionnaire_IndustryExperience");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<QuestionnaireLanguage>(entity =>
            {
                entity.ToTable("Questionnaire_Language");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<QuestionnaireProgramOfStudy>(entity =>
            {
                entity.ToTable("Questionnaire_ProgramOfStudy");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<QuestionnaireProgramOfStudyCategory>(entity =>
            {
                entity.ToTable("Questionnaire_ProgramOfStudy_Categories");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasDefaultValueSql("nextval('\"Questionnaire_ProgramOfStudy_Categoriies_ID_seq\"'::regclass)");

                entity.Property(e => e.CategoryId).HasColumnName("CategoryID");

                entity.Property(e => e.ProgramId).HasColumnName("ProgramID");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.QuestionnaireProgramOfStudyCategories)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Category");

                entity.HasOne(d => d.Program)
                    .WithMany(p => p.QuestionnaireProgramOfStudyCategories)
                    .HasForeignKey(d => d.ProgramId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProgramOfStudy");
            });

            modelBuilder.Entity<QuestionnaireProjectInterest>(entity =>
            {
                entity.ToTable("Questionnaire_ProjectInterest");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<QuestionnaireReasonsToJoin>(entity =>
            {
                entity.ToTable("Questionnaire_ReasonsToJoin");

                entity.Property(e => e.Value).IsRequired();
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.HasIndex(e => e.Email, "Email constraint")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Email).IsRequired();

                entity.Property(e => e.FirstName).IsRequired();

                entity.Property(e => e.LastName).IsRequired();
            });

            modelBuilder.Entity<UserCompatability>(entity =>
            {
                entity.ToTable("User_Compatability");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.HasOne(d => d.User1)
                    .WithMany(p => p.UserCompatabilityUser1s)
                    .HasForeignKey(d => d.User1Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User1");

                entity.HasOne(d => d.User2)
                    .WithMany(p => p.UserCompatabilityUser2s)
                    .HasForeignKey(d => d.User2Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User2");
            });

            modelBuilder.Entity<UserCountry>(entity =>
            {
                entity.ToTable("User_Countries");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.UserCountries)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Country");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserCountries)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserDemographic>(entity =>
            {
                entity.ToTable("User_Demographics");

                entity.Property(e => e.DateOfBirth).HasColumnType("date");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserDemographics)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserHobby>(entity =>
            {
                entity.ToTable("User_Hobby");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.HobbyId).HasColumnName("HobbyID");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.Hobby)
                    .WithMany(p => p.UserHobbies)
                    .HasForeignKey(d => d.HobbyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Hobby");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserHobbies)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserIndustryExperience>(entity =>
            {
                entity.ToTable("User_IndustryExperience");

                entity.HasOne(d => d.IndustryExperience)
                    .WithMany(p => p.UserIndustryExperiences)
                    .HasForeignKey(d => d.IndustryExperienceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_IndustryExperience");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserIndustryExperiences)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserLanguage>(entity =>
            {
                entity.ToTable("User_Language");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.UserLanguages)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Language");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserLanguages)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserProgramOfStudy>(entity =>
            {
                entity.ToTable("User_ProgramOfStudy");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ProgramId).HasColumnName("ProgramID");

                entity.Property(e => e.UserId).HasColumnName("UserID");

                entity.HasOne(d => d.Program)
                    .WithMany(p => p.UserProgramOfStudies)
                    .HasForeignKey(d => d.ProgramId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Program");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserProgramOfStudies)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserProjectInterest>(entity =>
            {
                entity.ToTable("User_ProjectInterest");

                entity.HasOne(d => d.ProjectInterest)
                    .WithMany(p => p.UserProjectInterests)
                    .HasForeignKey(d => d.ProjectInterestId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProjectInterest");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserProjectInterests)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserReasonsToJoin>(entity =>
            {
                entity.ToTable("User_ReasonsToJoin");

                entity.HasOne(d => d.Reason)
                    .WithMany(p => p.UserReasonsToJoins)
                    .HasForeignKey(d => d.ReasonId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Reason");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserReasonsToJoins)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            modelBuilder.Entity<UserReligion>(entity =>
            {
                entity.ToTable("User_Religion");

                entity.Property(e => e.Value).IsRequired();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserReligions)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
