using LibraryOfCongressImport.Lookups;
using LibraryOfCongressImport.Tools;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace LibraryOfCongressImport.Parsers
{
    class DataFieldParser
    {
        public static void ParseDataField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            var tag = element.Attribute("tag").Value.ToCharArray();
            // Numbers and Code Fields
            if (tag[0] == '0')
            {
                if (tag[1] != 0)
                {
                    ParseNumberOrCodeField(ref element, ref attributes);
                }
                else
                {
                    LogTools.LogUnknownTag("ParseDataField", element.Attribute("tag").Value);
                }
            }
            // Main Entry Fields
            else if (tag[0] == '1')
            {
                ParseMainEntryField(ref element, ref attributes);
            }
            else if (tag[0] == '2')
            {
                // Title and Title-Related Fields
                if (tag[1] <= '4')
                {
                    ParseTitleOrTitleRelatedField(ref element, ref attributes);
                }
                // Edition, Imprint, Etc. Fields
                else if (tag[1] <= '8')
                {
                    ParseEditionImprintOrRelatedField(ref element, ref attributes);
                }
                else
                {
                    LogTools.LogUnknownTag("ParseDataField", element.Attribute("tag").Value);
                }
            }
            // Physical Description, Etc. Fields
            else if (tag[0] == '3')
            {
                ParsePhysicalDescriptionOrRelatedField(ref element, ref attributes);
            }
            // Series Statement Fields
            else if (tag[0] == '4')
            {
                ParseSeriesStatementField(ref element, ref attributes);
            }
            // Note Fields
            else if (tag[0] == '5')
            {
                ParseNoteField(ref element, ref attributes);
            }
            // Subject Access Fields
            else if (tag[0] == '6')
            {
                ParseSubjectAccessField(ref element, ref attributes);
            }
            else if (tag[0] == '7')
            {
                // Added Entry Fields
                if (tag[1] <= '5')
                {
                    ParseAddedEntryField(ref element, ref attributes);
                }
                // Linking Entry Fields
                else if (tag[1] <= '8')
                {
                    ParseLinkingEntryField(ref element, ref attributes);
                }
                else
                {
                    LogTools.LogUnknownTag("ParseDataField", element.Attribute("tag").Value);
                }
            }
            else if (tag[0] == '8')
            {
                // Series Added Entry Fields
                if (tag[1] <= '3')
                {
                    ParseSeriesAddedEntryField(ref element, ref attributes);
                }
                // Holdings, Locations, Alternate Graphics, Etc. Fields
                else if (tag[1] <= '8')
                {
                    ParseHoldingLocationAlternateGraphicsOrRelatedField(ref element, ref attributes);
                }
                else
                {
                    LogTools.LogUnknownTag("ParseDataField", element.Attribute("tag").Value);
                }
            }
            else
            {
                LogTools.LogUnknownTag("ParseDataField", element.Attribute("tag").Value);
            }
        }

        private static void ParseNumberOrCodeField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.LibraryofCongressControlNumber:
                    break;
                case TagNumbers.PatentControlInformation:
                    break;
                case TagNumbers.NationalBibliographyNumber:
                    break;
                case TagNumbers.NationalBibliographicAgencyControlNumber:
                    break;
                case TagNumbers.CopyrightorLegalDepositNumber:
                    break;
                case TagNumbers.CopyrightArticleFeeCode:
                    break;
                case TagNumbers.InternationalStandardBookNumber:
                    break;
                case TagNumbers.InternationalStandardSerialNumber:
                    break;
                case TagNumbers.OtherStandardIdentifier:
                    break;
                case TagNumbers.OverseasAcquisitionNumber:
                    break;
                case TagNumbers.FingerprintIdentifier:
                    break;
                case TagNumbers.StandardTechnicalReportNumber:
                    break;
                case TagNumbers.PublisherorDistributorNumber:
                    break;
                case TagNumbers.CODENDesignation:
                    break;
                case TagNumbers.MusicalIncipitsInformation:
                    break;
                case TagNumbers.PostalRegistrationNumber:
                    break;
                case TagNumbers.DateTimeandPlaceofanEvent:
                    break;
                case TagNumbers.CodedCartographicMathematicalData:
                    break;
                case TagNumbers.SystemControlNumber:
                    break;
                case TagNumbers.OriginalStudyNumberforComputerDataFiles:
                    break;
                case TagNumbers.SourceofAcquisition:
                    break;
                case TagNumbers.RecordContentLicensor:
                    break;
                case TagNumbers.CatalogingSource:
                    break;
                case TagNumbers.LanguageCode:
                    break;
                case TagNumbers.AuthenticationCode:
                    break;
                case TagNumbers.GeographicAreaCode:
                    break;
                case TagNumbers.CountryofPublishingProducingEntityCode:
                    break;
                case TagNumbers.TimePeriodofContent:
                    break;
                case TagNumbers.SpecialCodedDates:
                    break;
                case TagNumbers.FormofMusicalCompositionCode:
                    break;
                case TagNumbers.NumberofMusicalInstrumentsorVoicesCodes:
                    break;
                case TagNumbers.LibraryofCongressCallNumber:
                    break;
                case TagNumbers.LibraryofCongressCopyIssueOrOffprintStatement:
                    break;
                case TagNumbers.GeographicClassification:
                    break;
                case TagNumbers.ClassificationNumbersAssignedinCanada:
                    break;
                case TagNumbers.NationalLibraryofMedicineCallNumber:
                    break;
                case TagNumbers.NationalLibraryofMedicineCopyStatement:
                    break;
                case TagNumbers.CharacterSetsPresent:
                    break;
                case TagNumbers.NationalAgriculturalLibraryCallNumber:
                    break;
                case TagNumbers.NationalAgriculturalLibraryCopyStatement:
                    break;
                case TagNumbers.SubjectCategoryCode:
                    break;
                case TagNumbers.GPOItemNumber:
                    break;
                case TagNumbers.UniversalDecimalClassificationNumber:
                    break;
                case TagNumbers.DeweyDecimalClassificationNumber:
                    break;
                case TagNumbers.AdditionalDeweyDecimalClassificationNumber:
                    break;
                case TagNumbers.OtherClassificationNumber:
                    break;
                case TagNumbers.SynthesizedClassificationNumberComponents:
                    break;
                case TagNumbers.GovernmentDocumentClassificationNumber:
                    break;
                case TagNumbers.ReportNumber:
                    break;
                default:
                    break;
            }
        }

        private static void ParseMainEntryField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.PersonalNameMainEntry:
                    break;
                case TagNumbers.CorporateNameMainEntry:
                    break;
                case TagNumbers.MeetingNameMainEntry:
                    break;
                case TagNumbers.UniformTitleMainEntry:
                    break;
                default:
                    break;
            }
        }

        private static void ParseTitleOrTitleRelatedField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.AbbreviatedTitle:
                    break;
                case TagNumbers.KeyTitle:
                    break;
                case TagNumbers.UniformTitle:
                    break;
                case TagNumbers.TranslationOfTitleByCatalogingAgency:
                    break;
                case TagNumbers.CollectiveUniformTitle:
                    break;
                case TagNumbers.TitleStatement:
                    break;
                case TagNumbers.VaryingFormOfTitle:
                    break;
                case TagNumbers.FormerTitle:
                    break;
                default:
                    break;
            }
        }

        private static void ParseEditionImprintOrRelatedField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.EditionStatement:
                    break;
                case TagNumbers.MusicalPresentationStatement:
                    break;
                case TagNumbers.CartographicMathematicalData:
                    break;
                case TagNumbers.ComputerFileCharacteristics:
                    break;
                case TagNumbers.CountryOfProducingEntity:
                    break;
                case TagNumbers.PhilatelicIssueData:
                    break;
                case TagNumbers.PublicationDistribution:
                    break;
                case TagNumbers.ProjectedPublicationDate:
                    break;
                case TagNumbers.ProductionPublicationDistributionManufactureAndCopyrightNotice:
                    break;
                case TagNumbers.Address:
                    break;
                default:
                    break;
            }
        }

        private static void ParsePhysicalDescriptionOrRelatedField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.PhysicalDescription:
                    break;
                case TagNumbers.PlayingTime:
                    break;
                case TagNumbers.HoursEtc:
                    break;
                case TagNumbers.CurrentPublicationFrequency:
                    break;
                case TagNumbers.FormerPublicationFrequency:
                    break;
                case TagNumbers.ContentType:
                    break;
                case TagNumbers.MediaType:
                    break;
                case TagNumbers.CarrierType:
                    break;
                case TagNumbers.PhysicalMedium:
                    break;
                case TagNumbers.GeospatialReferenceData:
                    break;
                case TagNumbers.PlanarCoordinateData:
                    break;
                case TagNumbers.SoundCharacteristics:
                    break;
                case TagNumbers.ProjectionCharacteristicsOfMovingImage:
                    break;
                case TagNumbers.VideoCharacteristics:
                    break;
                case TagNumbers.DigitalFileCharacteristics:
                    break;
                case TagNumbers.FormatOfNotatedMusic:
                    break;
                case TagNumbers.OrganizationAndArrangementOfMaterials:
                    break;
                case TagNumbers.DigitalGraphicRepresentation:
                    break;
                case TagNumbers.SecurityClassificationControl:
                    break;
                case TagNumbers.OriginatorDisseminationControl:
                    break;
                case TagNumbers.DatesOfPublicationAndSequentialDesignation:
                    break;
                case TagNumbers.NormalizedDateAndSequentialDesignation:
                    break;
                case TagNumbers.TradePrice:
                    break;
                case TagNumbers.TradeAvailabilityInformation:
                    break;
                case TagNumbers.AssociatedPlace:
                    break;
                case TagNumbers.AssociatedLanguage:
                    break;
                case TagNumbers.FormOfWork:
                    break;
                case TagNumbers.OtherDistinguishingCharacteristicsOfWorkOrExpression:
                    break;
                case TagNumbers.MediumOfPerformance:
                    break;
                case TagNumbers.NumericDesignationOfMusicalWork:
                    break;
                case TagNumbers.Key:
                    break;
                case TagNumbers.AudienceCharacteristics:
                    break;
                case TagNumbers.CreatorcontributorCharacteristics:
                    break;
                case TagNumbers.TimePeriodOfCreation:
                    break;
                default:
                    break;
            }
        }

        private static void ParseSeriesStatementField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.SeriesStatement:
                    break;
                default:
                    break;
            }
        }

        private static void ParseNoteField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.GeneralNote:
                    break;
                case TagNumbers.WithNote:
                    break;
                case TagNumbers.DissertationNote:
                    break;
                case TagNumbers.BibliographyNote:
                    break;
                case TagNumbers.FormattedContentsNote:
                    break;
                case TagNumbers.RestrictionsOnAccessNote:
                    break;
                case TagNumbers.ScaleNoteForGraphicMaterial:
                    break;
                case TagNumbers.CreationproductionCreditsNote:
                    break;
                case TagNumbers.CitationreferencesNote:
                    break;
                case TagNumbers.ParticipantOrPerformerNote:
                    break;
                case TagNumbers.TypeOfReportAndPeriodCoveredNote:
                    break;
                case TagNumbers.DataQualityNote:
                    break;
                case TagNumbers.NumberingPeculiaritiesNote:
                    break;
                case TagNumbers.TypeOfComputerFileOrDataNote:
                    break;
                case TagNumbers.DatetimeAndPlaceOfAnEventNote:
                    break;
                case TagNumbers.Summary:
                    break;
                case TagNumbers.TargetAudienceNote:
                    break;
                case TagNumbers.GeographicCoverageNote:
                    break;
                case TagNumbers.PreferredCitationOfDescribedMaterialsNote:
                    break;
                case TagNumbers.SupplementNote:
                    break;
                case TagNumbers.StudyProgramInformationNote:
                    break;
                case TagNumbers.AdditionalPhysicalFormAvailableNote:
                    break;
                case TagNumbers.ReproductionNote:
                    break;
                case TagNumbers.OriginalVersionNote:
                    break;
                case TagNumbers.LocationOfOriginalsduplicatesNote:
                    break;
                case TagNumbers.FundingInformationNote:
                    break;
                case TagNumbers.SystemDetailsNote:
                    break;
                case TagNumbers.TermsGoverningUseAndReproductionNote:
                    break;
                case TagNumbers.ImmediateSourceOfAcquisitionNote:
                    break;
                case TagNumbers.InformationRelatingToCopyrightStatus:
                    break;
                case TagNumbers.LocationOfOtherArchivalMaterialsNote:
                    break;
                case TagNumbers.BiographicalOrHistoricalData:
                    break;
                case TagNumbers.LanguageNote:
                    break;
                case TagNumbers.FormerTitleComplexityNote:
                    break;
                case TagNumbers.IssuingBodyNote:
                    break;
                case TagNumbers.EntityAndAttributeInformationNote:
                    break;
                case TagNumbers.CumulativeIndexfindingAidsNote:
                    break;
                case TagNumbers.InformationAboutDocumentationNote:
                    break;
                case TagNumbers.OwnershipAndCustodialHistory:
                    break;
                case TagNumbers.CopyAndVersionIdentificationNote:
                    break;
                case TagNumbers.BindingInformation:
                    break;
                case TagNumbers.CaseFileCharacteristicsNote:
                    break;
                case TagNumbers.MethodologyNote:
                    break;
                case TagNumbers.LinkingEntryComplexityNote:
                    break;
                case TagNumbers.PublicationsAboutDescribedMaterialsNote:
                    break;
                case TagNumbers.ActionNote:
                    break;
                case TagNumbers.AccumulationAndFrequencyOfUseNote:
                    break;
                case TagNumbers.ExhibitionsNote:
                    break;
                case TagNumbers.AwardsNote:
                    break;
                case TagNumbers.SourceOfDescriptionNote:
                    break;
                default:
                    break;
            }
        }

        private static void ParseSubjectAccessField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.SubjectAddedEntryPersonalName:
                    break;
                case TagNumbers.SubjectAddedEntryCorporateName:
                    break;
                case TagNumbers.SubjectAddedEntryMeetingName:
                    break;
                case TagNumbers.SubjectAddedEntryUniformTitle:
                    break;
                case TagNumbers.SubjectAddedEntryNamedEvent:
                    break;
                case TagNumbers.SubjectAddedEntryChronologicalTerm:
                    break;
                case TagNumbers.SubjectAddedEntryTopicalTerm:
                    break;
                case TagNumbers.SubjectAddedEntryGeographicName:
                    break;
                case TagNumbers.IndexTermUncontrolled:
                    break;
                case TagNumbers.SubjectAddedEntryFacetedTopicalTerms:
                    break;
                case TagNumbers.IndexTermGenreForm:
                    break;
                case TagNumbers.IndexTermOccupation:
                    break;
                case TagNumbers.IndexTermFunction:
                    break;
                case TagNumbers.IndexTermCurriculumObjective:
                    break;
                case TagNumbers.SubjectAddedEntryHierarchicalPlaceName:
                    break;
                default:
                    break;
            }
        }

        private static void ParseAddedEntryField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.AddedEntryPersonalName:
                    break;
                case TagNumbers.AddedEntryCorporateName:
                    break;
                case TagNumbers.AddedEntryMeetingName:
                    break;
                case TagNumbers.AddedEntryUncontrolledName:
                    break;
                case TagNumbers.AddedEntryUniformTitle:
                    break;
                case TagNumbers.AddedEntryUncontrolledRelatedAnalyticalTitle:
                    break;
                case TagNumbers.AddedEntryGeographicName:
                    break;
                case TagNumbers.AddedEntryHierarchicalPlaceName:
                    break;
                case TagNumbers.SystemDetailsAccesstoComputerFiles:
                    break;
                case TagNumbers.AddedEntryTaxonomicIdentification:
                    break;
                default:
                    break;
            }
        }

        private static void ParseLinkingEntryField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.MainSeriesEntry:
                    break;
                case TagNumbers.SubseriesEntry:
                    break;
                case TagNumbers.OriginalLanguageEntry:
                    break;
                case TagNumbers.TranslationEntry:
                    break;
                case TagNumbers.SupplementSpecialIssueEntry:
                    break;
                case TagNumbers.SupplementParentEntry:
                    break;
                case TagNumbers.HostItemEntry:
                    break;
                case TagNumbers.ConstituentUnitEntry:
                    break;
                case TagNumbers.OtherEditionEntry:
                    break;
                case TagNumbers.AdditionalPhysicalFormEntry:
                    break;
                case TagNumbers.IssuedWithEntry:
                    break;
                case TagNumbers.PrecedingEntry:
                    break;
                case TagNumbers.SucceedingEntry:
                    break;
                case TagNumbers.DataSourceEntry:
                    break;
                case TagNumbers.OtherRelationshipEntry:
                    break;
                default:
                    break;
            }
        }

        private static void ParseSeriesAddedEntryField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.SeriesAddedEntryPersonalName:
                    break;
                case TagNumbers.SeriesAddedEntryCorporateName:
                    break;
                case TagNumbers.SeriesAddedEntryMeetingName:
                    break;
                case TagNumbers.SeriesAddedEntryUniformTitle:
                    break;
                default:
                    break;
            }
        }

        private static void ParseHoldingLocationAlternateGraphicsOrRelatedField(ref XElement element, ref List<ItemAttribute> attributes)
        {
            //todo: implement parsing logic for cases as they occur
            var tag = element.Attribute("tag").Value.ToString();
            switch (tag)
            {
                case TagNumbers.HoldingsCodedDataValues:
                    break;
                case TagNumbers.TextualPhysicalFormDesignator:
                    break;
                case TagNumbers.HoldingsReproductionNote:
                    break;
                case TagNumbers.NameofUnit:
                    break;
                case TagNumbers.TermsGoverningUseandReproduction:
                    break;
                case TagNumbers.HoldingInstitution:
                    break;
                case TagNumbers.Location:
                    break;
                case TagNumbers.CaptionsandPatternBasicBibliographicUnit:
                    break;
                case TagNumbers.CaptionsandPatternSupplementaryMaterial:
                    break;
                case TagNumbers.CaptionsandPatternIndexes:
                    break;
                case TagNumbers.ElectronicLocationandAccess:
                    break;
                case TagNumbers.EnumerationandChronologyBasicBibliographicUnit:
                    break;
                case TagNumbers.EnumerationandChronologySupplementaryMaterial:
                    break;
                case TagNumbers.EnumerationandChronologyIndexes:
                    break;
                case TagNumbers.TextualHoldingsBasicBibliographicUnit:
                    break;
                case TagNumbers.TextualHoldingsSupplementaryMaterial:
                    break;
                case TagNumbers.TextualHoldingsIndexes:
                    break;
                case TagNumbers.ItemInformationBasicBibliographicUnit:
                    break;
                case TagNumbers.ItemInformationSupplementaryMaterial:
                    break;
                case TagNumbers.ItemInformationIndexes:
                    break;
                case TagNumbers.AlternateGraphicRepresentation:
                    break;
                case TagNumbers.ReplacementRecordInformation:
                    break;
                case TagNumbers.MachinegeneratedMetadataProvenance:
                    break;
                case TagNumbers.DescriptionConversionInformation:
                    break;
                case TagNumbers.MatchingInformation:
                    break;
                case TagNumbers.ForeignMARCInformationField:
                    break;
                case TagNumbers.NonMARCInformationField:
                    break;
                default:
                    break;
            }
        }
    }
}
