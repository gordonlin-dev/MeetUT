﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using API.Models;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace API
{
    public class Util
    {
        d80elsmr4eis6uContext _context;
        public Util()
        {
        }

        public void AddProgramValue()
        {
            var categories = _context.LookupProgramOfStudyCategories.ToList();
            var interval = 0;
            foreach (var category in categories)
            {
                var query = _context.QuestionnaireProgramOfStudyCategories.
                    Where(x => x.CategoryId == category.Id).
                    Join(
                        _context.QuestionnaireProgramOfStudies,
                        programCategory => programCategory.ProgramId,
                        program => program.Id,
                        (programCategory, program) => program
                    ).ToList();
                var count = 0;
                foreach (var program in query)
                {
                    program.MatchValue = count + interval;
                    count++;
                }
                interval += 100;
                _context.QuestionnaireProgramOfStudies.UpdateRange(query);
            }
            _context.SaveChanges();
        }
        public void AddHobbyValue()
        {
            var updateList = new List<QuestionnaireHobby>();
            var interval = 0;
            var categories = _context.LookupHobbyCategories.ToList();
            foreach (var category in categories)
            {

                var query = _context.QuestionnaireHobbyCategories.
                    Where(x => x.CategoryId == category.Id).Join(
                        _context.QuestionnaireHobbies,
                        hobbyCategory => hobbyCategory.HobbyId,
                        hobby => hobby.Id,
                        (hobbyCategory, hobby) => hobby
                    ).ToList();
                var count = 0;
                foreach (var hobby in query)
                {

                    hobby.MatchValue = count + interval;
                    count++;

                }
                interval += 100;
                _context.QuestionnaireHobbies.UpdateRange(query);
            }

            _context.SaveChanges();
        }

        public void loadHobbiesData()
        {
            string filePath = "DataSource/hobbies.xlsx";
            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                using (SpreadsheetDocument doc = SpreadsheetDocument.Open(fs, false))
                {
                    WorkbookPart workbookPart = doc.WorkbookPart;
                    SharedStringTablePart sstpart = workbookPart.GetPartsOfType<SharedStringTablePart>().First();
                    SharedStringTable sst = sstpart.SharedStringTable;

                    WorksheetPart worksheetPart = workbookPart.WorksheetParts.First();
                    Worksheet sheet = worksheetPart.Worksheet;
                    var rows = sheet.Descendants<Row>();
                    foreach (Row row in rows)
                    {
                        var firstCell = row.Elements<Cell>().ToList().ElementAt(0);
                        int firstSSID = int.Parse(firstCell.CellValue.Text);
                        string firstString = sst.ChildElements[firstSSID].InnerText;
                        var secondCell = row.Elements<Cell>().ToList().ElementAt(1);
                        int secondSSID = int.Parse(secondCell.CellValue.Text);
                        string secondString = sst.ChildElements[secondSSID].InnerText;
                        var stringList = secondString.Split(",");
                        foreach (string str in stringList)
                        {
                            int categoryId = _context.LookupHobbyCategories.
                                Where(x => x.Value == firstString).First().Id;
                            QuestionnaireHobby hobby = new QuestionnaireHobby()
                            {
                                Value = str
                            };
                            _context.QuestionnaireHobbies.Add(hobby);
                            _context.SaveChanges();
                            int hobbyId = _context.QuestionnaireHobbies.
                                Where(x => x.Value == str).First().Id;
                            _context.QuestionnaireHobbyCategories.
                                Add(new QuestionnaireHobbyCategory()
                                {
                                    CategoryId = categoryId,
                                    HobbyId = hobbyId
                                });
                            _context.SaveChanges();
                        }
                        //_context.LookupHobbyCategories.Add(new LookupHobbyCategory()
                        //{
                        //    Value = firstString
                        //});

                    }
                    //_context.SaveChanges();
                }
            }
        }

        public void loadProgramData()
        {
            string filePath = "DataSource/programs.xlsx";
            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                using (SpreadsheetDocument doc = SpreadsheetDocument.Open(fs, false))
                {
                    WorkbookPart workbookPart = doc.WorkbookPart;
                    SharedStringTablePart sstpart = workbookPart.GetPartsOfType<SharedStringTablePart>().First();
                    SharedStringTable sst = sstpart.SharedStringTable;

                    WorksheetPart worksheetPart = workbookPart.WorksheetParts.First();
                    Worksheet sheet = worksheetPart.Worksheet;
                    var rows = sheet.Descendants<Row>();
                    foreach (Row row in rows)
                    {
                        var firstCell = row.Elements<Cell>().ToList().ElementAt(0);
                        int firstSSID = int.Parse(firstCell.CellValue.Text);
                        string firstString = sst.ChildElements[firstSSID].InnerText;
                        //_context.QuestionnaireProgramOfStudies.
                        //    Add(new QuestionnaireProgramOfStudy()
                        //    {
                        //        Value = firstString
                        //    });
                        /*
                        var secondCell = row.Elements<Cell>().ToList().ElementAt(1);
                        //int secondSSID = int.Parse(secondCell.CellValue.Text);
                        string secondString = secondCell.LastChild.InnerText;

                        
                        

                        var categoryId = _context.LookupProgramOfStudyCategories.
                            Where(x => x.Value == secondString).First().Id;

                        var programId = _context.QuestionnaireProgramOfStudies.
                            Where(x => x.Value == firstString).First().Id;
                        _context.QuestionnaireProgramOfStudyCategoriies.
                            Add(new QuestionnaireProgramOfStudyCategoriie(){
                                ProgramId = programId,
                                CategoryId = categoryId
                        });
                        */
                        if (row.Elements<Cell>().ToList().Count() == 3)
                        {
                            var thirdCell = row.Elements<Cell>().ToList().ElementAt(2);
                            string thirdString = thirdCell.LastChild.InnerText;

                            var categoryId = _context.LookupProgramOfStudyCategories.
                            Where(x => x.Value == thirdString).First().Id;

                            var programId = _context.QuestionnaireProgramOfStudies.
                                Where(x => x.Value == firstString).First().Id;
                            _context.QuestionnaireProgramOfStudyCategories.
                                Add(new QuestionnaireProgramOfStudyCategory()
                                {
                                    ProgramId = programId,
                                    CategoryId = categoryId
                                });

                        }


                    }
                    _context.SaveChanges();
                }
            }
        }
    }
}
