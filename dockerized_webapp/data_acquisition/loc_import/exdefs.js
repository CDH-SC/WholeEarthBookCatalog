/**
 * exdefs.js
 * -----------------------------------------------------------------------------
 * all extraction definitions currently in use
 */
function basicDataFieldExtractor(tag, code, marc21) {
    let json = marc21
    var data = []
    var dataFields = json._dataFields;
    try {
        for (let i = 0; i < dataFields.length; i++) {
            try {
                if (dataFields[i]._tag == tag) {
                    try {
                        let subFields = dataFields[i]._subfields;
                        for (let j = 0; j < subFields.length; j++) {
                            try {
                                if (subFields[j]._code == code) {
                                    data.push(subFields[j]._data);
                                }
                            } catch (e) { }
                        }
                    } catch (e) { }
                }
            } catch (e) { }
        }
    } catch (e) { }
    
    if (data.length == 0) {
        return null;
    } else if (data.length == 1) {
        return data[0];
    } else if (data.length > 1) {
        return data;
    } else {
        return null;
    }
}

module.exports = [
	{
		fieldName: "LibraryOfCongressControlNumber",
		extractor: (record) => { return basicDataFieldExtractor("010", "a", record); }
	},	{
		fieldName: "NationalUnionCatalogOfManuscriptCollections",
		extractor: (record) => { return basicDataFieldExtractor("010", "b", record); }
	},
	{
		fieldName: "PatentControlNumber",
		extractor: (record) => { return basicDataFieldExtractor("013", "a", record); }
    },
	{
		fieldName: "PatentControlCountry",
		extractor: (record) => { return basicDataFieldExtractor("013", "b", record); } 
    },
	{
		fieldName: "PatentControlType",
		extractor: (record) => basicDataFieldExtractor("013", "c", record)
    },
	{
		fieldName: "PatentControlDate",
		extractor: (record) => basicDataFieldExtractor("013", "d", record)
    },
	{
		fieldName: "InternationalStandardBookNumber",
		extractor: (record) => basicDataFieldExtractor("020", "a", record)
    },
	{
		fieldName: "InternationalStandardBookNumberTermsOfAvailability",
		extractor: (record) => basicDataFieldExtractor("020", "c", record)
    },
	{
		fieldName: "InternationalStandardBookNumberQualifyingInformation",
		extractor: (record) => basicDataFieldExtractor("020", "q", record)
    },
	{
		fieldName: "InternationalStandardBookNumberCanceled",
		extractor: (record) => basicDataFieldExtractor("020", "z", record)
    },
	{
		fieldName: "InternationalStandardSerialNumber",
		extractor: (record) => basicDataFieldExtractor("022", "a", record)
    },
	{
		fieldName: "InternationalStandardSerialNumberLinking",
		extractor: (record) => basicDataFieldExtractor("022", "l", record)
    },
	{
		fieldName: "InternationalStandardSerialNumberLinkingCanceled",
		extractor: (record) => basicDataFieldExtractor("022", "m", record)
    },
	{
		fieldName: "InternationalStandardSerialNumberIncorrect",
		extractor: (record) => basicDataFieldExtractor("022", "y", record)
    },
	{
		fieldName: "InternationalStandardSerialNumberCanceled",
		extractor: (record) => basicDataFieldExtractor("022", "z", record)
    },
	{
		fieldName: "LanguageCodeOfTextOrSoundTrack",
		extractor: (record) => basicDataFieldExtractor("041", "a", record)
    },
	{
		fieldName: "LanguageCodeOfSummaryOrAbstract",
		extractor: (record) => basicDataFieldExtractor("041", "b", record)
    },
	{
		fieldName: "LanguageCodeOfSungOrSpokenText",
		extractor: (record) => basicDataFieldExtractor("041", "d", record)
    },
	{
		fieldName: "LanguageCodeOfOrigional",
		extractor: (record) => basicDataFieldExtractor("041", "h", record)
    },
	{
		fieldName: "LibraryOfCongressCallNumberClassificationNumber",
		extractor: (record) => basicDataFieldExtractor("050", "a", record)
    },
	{
		fieldName: "LibraryOfCongressCallNumberItemNumber",
		extractor: (record) => basicDataFieldExtractor("050", "b", record)
    },
	{
		fieldName: "LibraryOfCongressCallNumberURI",
		extractor: (record) => basicDataFieldExtractor("050", "1", record)
    },
	{
		fieldName: "UniversialDecimalClassificationNumber",
		extractor: (record) => basicDataFieldExtractor("080", "a", record)
    },
	{
        fieldName: "UniversialDecimalItemNumber",
		extractor: (record) => basicDataFieldExtractor("080", "b", record)
    },
	{
		fieldName: "UniversialDecimalEditionNumber",
		extractor: (record) => basicDataFieldExtractor("080", "2", record)
    },
	{
		fieldName: "UniversialDecimalURI",
		extractor: (record) => basicDataFieldExtractor("080", "1", record)
    },
	{
		fieldName: "DeweyDecimalClassificationNumber",
		extractor: (record) => basicDataFieldExtractor("082", "a", record)
    },
	{
		fieldName: "DeweyDecimalItemNumber",
		extractor: (record) => basicDataFieldExtractor("082", "b", record)
    },
	{
		fieldName: "DeweyDecimaEdition",
		extractor: (record) => basicDataFieldExtractor("082", "2", record)
    },
	{
		fieldName: "GovernmentDocumentClassificationNumber",
		extractor: (record) => basicDataFieldExtractor("086", "a", record)
    },
	{
		fieldName: "GovernmentDocumentURI",
		extractor: (record) => basicDataFieldExtractor("086", "1", record)
    }
];



