using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

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
        public virtual DbSet<QuestionnaireHobby> QuestionnaireHobbies { get; set; }
        public virtual DbSet<QuestionnaireHobbyCategory> QuestionnaireHobbyCategories { get; set; }
        public virtual DbSet<QuestionnaireProgramOfStudy> QuestionnaireProgramOfStudies { get; set; }
        public virtual DbSet<QuestionnaireProgramOfStudyCategory> QuestionnaireProgramOfStudyCategories { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserCompatability> UserCompatabilities { get; set; }
        public virtual DbSet<UserHobby> UserHobbies { get; set; }
        public virtual DbSet<UserProgramOfStudy> UserProgramOfStudies { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseNpgsql("User ID=qhdnfykzfqptki;Password=ad77410c793d023714c38b394481f5d6027ffd1c9c56286495c11deaf880ce3a;Host=ec2-52-0-67-144.compute-1.amazonaws.com;Port=5432;Database=d80elsmr4eis6u;Pooling=true;SSL Mode=Require;TrustServerCertificate=True;");
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

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.HasIndex(e => e.Email, "Email constraint")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Email).IsRequired();
            });

            modelBuilder.Entity<UserCompatability>(entity =>
            {
                entity.ToTable("User_Compatability");

                entity.Property(e => e.Id).ValueGeneratedNever();

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

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
