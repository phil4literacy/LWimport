"use strict";
const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
	colors: 1,           // (0|false)|(1|true)|2 
	cleanStack: 1,       // (0|false)|(1|true)|2|3 
	verbosity: 4,        // (0|false)|1|2|(3|true)|4 
	listStyle: 'indent', // "flat"|"indent" 
	activity: false
});
 
var BoxOfQuestions = require('../js/BoxOfQuestions');
var LWdb = require('../js/LWdb');

var lw, wordlist;

describe("BoxOfQuestions construction", function() {
	// construction of empty db
	beforeAll(function(done){
		lw = BoxOfQuestions(LWdb('learnWords')); 
		
		this.getGermanWordList(function(err,data){
			if(err){
				console.log(err);
			}else{
				wordlist = data;
			}
			done();
		});
	});

	it("should indicate the correct library version", function() {

		expect(lw).toHaveString("version");
		expect(lw.version).toBe('0.3-beta');

	});



	it("should be able to create a BoxOfQuestions object (var 1a)", function() {

		console.log("*** should be able to create a BoxOfQuestions object (var 1a) ***");
		// construction of empty db
		var lw = BoxOfQuestions(LWdb('learnWords')); 

		// checks
		expect(lw).not.toBe(null);
		expect(lw).not.toBe(undefined);

		expect(lw).toBeObject();

		expect(lw.name).toBe("learnWords");

		expect(lw).toHaveObject("db");
		expect(lw.db.dbName).toBe("learnWords");
 
		expect(lw.db.numberOfWords()).toBe(0);


	});



	it("should be able to create a BoxOfQuestions object (var 1b)", function() {

		console.log("*** should be able to create a BoxOfQuestions object (var 1b) ***");

		// construction of empty db
		var lw = BoxOfQuestions(LWdb('learnWords'));

		// load words
		lw.db.loadWords(wordlist);

		// checks
		expect(lw.db.dbName).toBe("learnWords");
		expect(lw.db.numberOfWords()).toBe(wordlist.length);

		expect((lw.wordsWithStepValue(-1)).length).toBe(wordlist.length);


	});



	it("should be able to create a BoxOfQuestions object (var 2)", function() {

		console.log("*** should be able to create a BoxOfQuestions object (var 2) ***");

		// construction

		var lw = function(){

			var db = LWdb('learnWords');

			db.loadWords(wordlist);

			var box = BoxOfQuestions(db);

			// if necessary more configuration later

			return box
		}();


		// checks
		expect(lw).not.toBe(null);
		expect(lw).not.toBe(undefined);

		expect(lw).toBeObject();

		expect(lw.db.dbName).toBe("learnWords");
		expect(lw.db.numberOfWords()).toBe(wordlist.length);


	});




	it("should support the Box API 2", function() {

		console.log("*** should support the Box API 2 ***");

		// construction of empty db
		var lw = BoxOfQuestions(LWdb('learnWords')); 

		expect(lw).toHaveString("version");

		expect(lw).toHaveMethod("question");
		expect(lw).toHaveMethod("answer");
		expect(lw).toHaveMethod("moveQuestionForward");
		expect(lw).toHaveMethod("moveQuestionBackwards");

		// synonyms
		expect(lw).toHaveMethod("answerWasCorrect");
		expect(lw).toHaveMethod("answerWasWrong");


		expect(lw).toHaveMethod("importFrom");
		expect(lw).toHaveMethod("wordsToReview");


		expect(lw).toHaveMethod("wordsWithStepValue");
		expect(lw).toHaveMethod("addMoreWordsForLearning");
		expect(lw).toHaveMethod("chooseRandomObject");
		expect(lw).toHaveMethod("config");
		expect(lw).toHaveMethod("status");


	});



});

var fs = require('fs');

beforeAll(function(){

	this.getGermanWordList = function(callback){

		if (typeof window === 'undefined'){
			// running in node
			var data = fs.readFileSync('data/json/wordlist-en-ge.json');
			var js = JSON.parse(data);
			callback.call(null,null,js);
		}else{
			// running in browser
			var req = new XMLHttpRequest();
			req.open('GET','/data/json/wordlist-en-ge.json');
			req.addEventListener("load",function(){
				try{
					var data = JSON.parse(this.responseText);
					callback.call(null,null,data);
				}catch(e){
					callback.call(null,e,null);
				}
			});
			req.send();
		}
		
	};

});






describe("BoxOfQuestions", function() {

    
	beforeEach(function() {

		// set up test fixture

		lw = BoxOfQuestions(LWdb('learnWords'));
		lw.importFrom(wordlist);

		// change default settings
		var settings = lw.db.getSettings();
		settings.suggestedNumberOfWordsInASession = 7;
		lw.db.putSettings(settings);

		// setup a particular set of step values

		var allWords = lw.db.allWords();
		lw.allWordsFilteredByTag();
		
		allWords[0].step = 0;  // question for word has not been answered yet 
		allWords[0].queried = 1;
		allWords[1].step = 0;
		allWords[1].queried = 1;
		allWords[2].step = 0;
		allWords[2].queried = 1;

		allWords[3].step = 1;  // question for word has been answered once
		allWords[3].queried = 1;
		allWords[4].step = 1;  
		allWords[4].queried = 1;
		allWords[5].step = 1;
		allWords[5].queried = 1;
		allWords[6].step = 2;  // word has been answered two times
		allWords[6].queried = 1;
		allWords[7].step = 3;  // word has been answered three times
		allWords[7].queried = 1;

		lw.db.putWord(allWords[0]);
		lw.db.putWord(allWords[1]);
		lw.db.putWord(allWords[2]);
		lw.db.putWord(allWords[3]);
		lw.db.putWord(allWords[4]);
		lw.db.putWord(allWords[5]);
		lw.db.putWord(allWords[6]);
		lw.db.putWord(allWords[7]);
    
	});






	it("should be able to import questions", function() {

		console.log("*** should be able to import questions ***");

		expect(lw).not.toBe(null);


		expect(lw.db).toHaveMethod("loadWords");

		expect(lw).toHaveMethod("importFrom");

		expect(lw.db.numberOfWords()).toBe(wordlist.length);

		var allWords = lw.db.allWords();
		var aWord = allWords[0];
		expect(aWord.step).toBe(0);


		aWord = allWords[4];
		expect(aWord.step).toBe(1);

		aWord = allWords[8];
		expect(aWord.step).toBe(-1);

	});







	it("should have a helper function to get random integers", function(){

		console.log("*** should have a helper function to get random integers ***");

		expect(lw).not.toBe(null);

		// FIXME
		// expect(lw).toHaveMethod("_getRandomInt");

		var n = lw.db.numberOfWords();

		expect(n).toBe(wordlist.length);
		expect(lw.db.allWords().length).toBe(wordlist.length);

		// FIXME add more expect

		// expect(lw._getRandomInt(0,n-1)).toBeNumber(); 

	});









	it("should be able to indicate which words are to be repeated", function() {

		console.log("*** should be able to indicate which words are to be repeated ***");

		expect(lw).not.toBe(null);    
		expect(lw).toHaveMethod("wordsToReview");


		var r0 = lw.wordsToReview();
  
		expect(r0.length).toBeNumber();
		expect(r0.length).toBe(8);

		lw.question("","review");
		lw.moveQuestionForward();

		var r1 = lw.wordsToReview();
		expect(r1.length).toBeNumber();
		expect(r1.length).toBe(7);


		lw.question("","review");
		lw.moveQuestionForward();

		var r2 = lw.wordsToReview();
		expect(r2.length).toBeNumber();
		expect(r2.length).toBe(6);


		lw.question("","review");
		lw.moveQuestionForward();

		var r2 = lw.wordsToReview();
		expect(r2.length).toBeNumber();
		expect(r2.length).toBe(5);


	});



	it("should give an array of words having particular step values", function() {

		console.log("*** should give an array of words having particular step values ***");

		expect(lw).not.toBe(null);    
		expect(lw).toHaveMethod("wordsWithStepValue");

		var wordWithStepEqualMinus1 = lw.wordsWithStepValue(-1);
		expect(wordWithStepEqualMinus1.length).toBe(76);
      
		var wordsWithStep0 = lw.wordsWithStepValue(0);
		expect(wordsWithStep0.length).toBe(3);

		var wordsWithStepMinus1ToZero = lw.wordsWithStepValue(-1,0);
		expect(wordsWithStepMinus1ToZero.length).toBe(79);

		var wordsWithStepMinus1ToPlus1 = lw.wordsWithStepValue(-1,1);
		expect(wordsWithStepMinus1ToPlus1.length).toBe(82);


	});




	it("should be able to give a question", function() {

		console.log("*** should be able to give a question ***");

		expect(lw).not.toBe(null);
		expect(lw).toHaveMethod("question");

		var q = lw.question("","review");

		expect(q).not.toBe(null);
		expect(q).not.toBe(undefined);
		expect(q).toBeObject();    

		expect(q).toHaveString("translate");
		expect(q).toHaveNumber("step");
		expect(q).toHaveNumber("date");

		var todayNow = new Date();

		expect(q.date <= todayNow).toBe(true);


		var id1 = q._id;
		var r1 = lw.wordsToReview();
		expect(r1).toBeArray();
		var n1 = r1.length;

		lw.moveQuestionForward();
		// This means the question has been answered
		// correctly.
		// Thus we should get a next question

		q = lw.question("","review");

		// which is different from the previous one.
		expect(q._id).not.toBe(id1);

		// and the number of remaining questions should be
		// one less.
		var r2 = lw.wordsToReview();
		expect(r2).toBeArray();
		var n2 = r2.length;
		expect(n2).toBe(n1-1); 


	});


	it("should be able to give questions until there are no more questions", function() {

		console.log("*** should be able to give questions until there are no more questions ***");

		// total of 84 words
		expect(lw.db.numberOfWords()).toBe(wordlist.length);

		// eight are to be learned / repeated
		// 8 is the expected result
		expect((lw.wordsWithStepValue(0,1000)).length).toBe(8);

		// for are not put into the system yet.
		expect((lw.wordsWithStepValue(-1)).length).toBe(76);


		// ask questions repeatedly until there are no more questions
		var q;
		var noOfQuestions = 0;
		do {
			q = lw.question("","review");
			lw.moveQuestionBackwards();
			if(q) {// q is not null
				noOfQuestions =  noOfQuestions +1};
		} while (q);
   
		// check result
		expect(noOfQuestions).toBe(8);

	});







	it("should be able to give an answer", function() {

		console.log("*** should be able to give an answer ***");

		expect(lw).not.toBe(null);


		expect(lw).toHaveMethod("answer");


		var a = lw.answer("","review");

		expect(a).not.toBe(null);
		expect(a).not.toBe(undefined);

		// FIXME add more expect statements

	});









	it("should be able to give answer options", function() {


		// Check API
		expect(lw).not.toBe(null);

		expect(lw).toHaveMethod("getAnswerOptions");

		expect((lw.wordsToReview()).length > 0).toBe(true);


		// default value

		expect((lw.db.getSettings()).numberOfOptions).toBe(4);


		var question = lw.question("","review");

		// check availability of numberOfOptions property
		var settings = lw.db.getSettings();
		expect(settings).toBeObject();
		expect(settings).toHaveNumber("numberOfOptions");
 


		// check number of options

		var n = settings.numberOfOptions;

		var options = lw.getAnswerOptions();
    
		expect(options).toBeArray();
		expect(options.length).toBe(n);



		// verify is all _ids of all elements 
		// in options are different

		var idOptionsSet = new Set();

		options.forEach(function(element) {
			idOptionsSet.add(element._id);
		});
    
		expect(idOptionsSet.size).toBe(n);
    



		// Check it question is included in answerOptions
   
		expect(idOptionsSet.has(question._id)).toBe(true);




		// FIXME add more expect statements

	});




	it("should be able to move an incorrect question back in the box", function() {

		var q = lw.question("","review");
		var question_id = q._id;
      
		lw.moveQuestionBackwards(); // issue #65

		var updatedWord = lw.db.getWord(question_id);

		expect(updatedWord.date).toBeNumber();
		expect(updatedWord.date).toBeGreaterThan(new Date().valueOf());

        
		expect(updatedWord.step).toBe(0);


	});






	it("should be able to move an answer forward", function() {

         
		var q = lw.question("","review");
		expect(q).toBeObject();

	 expect(lw).toHaveMethod("moveQuestionForward");

		var _id = q._id;
		var step = q.step;
		var date = q.date;

		lw.moveQuestionForward();

		// get updated question object
		q = lw.db.getWord(_id);

		expect(_id == q._id).toBe(true);
		expect(step + 1 == q.step).toBe(true);
		expect(date < q.date).toBe(true);

	});



	it("should be able to choose a random object from a collection", function() {

		// lw.chooseRandomObject(anArray); issue #59
		// returns a random object from anArray.

		expect(wordlist).toBeArray();

		var _id;
		var sum = 0;

		for(var i = 0; i < 10000; i++){
			_id = (lw.chooseRandomObject(wordlist))._id;

			expect(_id >= 1).toBe(true); 
			expect(_id <= wordlist.length).toBe(true);

			sum = sum + _id;

		}

		var expectedValue = wordlist.length/2.0;
		var avg = sum/10000.0;

		expect(avg >= expectedValue).toBe(true); 
		expect(avg < (expectedValue+2)).toBe(true);
        
	});




	it("should be able to make use of settings information", function() {
  
		var s = lw.db.getSettings();

		expect(s.delay).toBeNumber();
   
		expect(s.factorForDelayValue).toBeArray();
		expect(s.factorForDelayValue.length).toBeGreaterThan(0);

		expect(s.defaultInitialStepValue).toBe(-1);
		expect(s.numberOfOptions).toBe(4);
		expect(s.sessionExpiryTimeInSeconds).toBe(1800);
		expect(s.suggestedNumberOfWordsInASession).toBe(7);


	});


 
	it("should be able to give status information", function() {
  
		var st = lw.status();
   
		expect(st).toBeObject();
		expect(st.numberOfWords).toBe(wordlist.length);

		// FIXME
		// add more expect statements

	});

});

