var mongoose = require('mongoose');
var log = require('noogger');
var lineReader = require('line-reader');
var Schema = mongoose.Schema;
var BibleVerse = mongoose.model('BibleVerse', new Schema({
    testament: String,
    book: String,
    chapter: Number,
    verse: Number,
    word: String,
    version: String,
    lang: String

}));


mongoose.connect('mongodb://127.0.0.1:27017/simpleWorship'); 


var arr=[];
arr.push(
"Genesis",
"Exodus",
"Leviticus",
"Numbers",
"Deuteronomy",
"Joshua",
"Judges",
"Ruth",
"1 Samuel",
"2 Samuel",
"1 Kings",
"2 Kings",
"1 Chronicles",
"2 Chronicles",
"Ezra",
"Nehemiah",
"Esther",
"Job",
"Psalm",
"Proverbs",
"Ecclesiastes",
"Song of Solomon",
"Isaiah",
"Jeremiah",
"Lamentations",
"Ezekiel",
"Daniel",
"Hosea",
"Joel",
"Amos",
"Obadiah",
"Jonah",
"Micah",
"Nahum",
"Habakkuk",
"Zephaniah",
"Haggai",
"Zechariah",
"Malachi",
"Matthew",
"Mark",
"Luke",
"John",
"Acts",
"Romans",
"1 Corinthians",
"2 Corinthians",
"Galatians",
"Ephesians",
"Philippians",
"Colossians",
"1 Thessalonians",
"2 Thessalonians",
"1 Timothy",
"2 Timothy",
"Titus",
"Philemon",
"Hebrews",
"James",
"1 Peter",
"2 Peter",
"1 John",
"2 John",
"3 John",
"Jude",
"Revelation"
);

var formats = ["GETBIBLE.NET"];
 
function addBible(filename, format)
{
    var count= 0;
    var i;    
    switch(format) {
        case "GETBIBLE.NET":
            var s= filename.split('/').slice(-1)[0];
            s= s.split('.');
            s.splice(-1);
            s= s[0].split('__');
            s.splice(-2);
            var lang= s[0];
            var version= s[1]; 
            lineReader.eachLine(filename, function(line, last) {   // /bibles/French__Darby__darby__LTR.txt
            raw= line.split('||');

            var verse= {};
            i= parseInt( raw[0].slice(0,2) );
            verse.testament= raw[0].slice(-1);
            verse.book= arr[i-1];
            verse.chapter= raw[1];
            verse.verse= raw[2];
            verse.word= raw[3];   
            verse.version= version;
            verse.lang= lang;
            BibleVerse.create(verse, function(err, obj){
                if(err) log.error("ERROR: "+err);
                else  {
                    count++;
                    log.notice(JSON.stringify(obj)+" no"+count+"\n"); 
                }
            }); 
            if(last){
                log.warning(JSON.stringify(verse,null,4));
            }
        });
        break;
    }
}

addBible('../bibles/French__Darby__darby__LTR.txt','GETBIBLE.NET');

exports.addBible= addBible;