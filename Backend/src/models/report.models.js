const mongoose = require("mongoose");
/**
 * @name Basic user-server --- side architecture
 * 
 * -> job description Schema: String
 * -> resume text : String
 * -> self description : String
 * 
 * 
 * 
 * -> matchScore : Number
 * -> technical questions : 
 *              [{
 *                  question :"", 
 *                  intention behind question : "",
 *                  answer:""
 *              }]
 * -> behavioural questions : 
 *              [{
*               question :"", 
 *              intention behind question : "",
 *              answer:""
 *              }]
 * -> skill gap : 
 *              [{
 *                skill :"",
 *                severity :{
 *                          type: String,
 *                          enum : ["low","medium","high"]
 *                          }
 *              }]
 * -> preparation plan : [{
 *                          day : Number,
 *                          focus : String,
 *                          tasks : [String]
 *                        }]
 */

// Defining the schema for the interview report
const technicalQuestionSChema = new mongoose.Schema({
    question :{
        type:String,
        required:true
    },
    intention : {
        type:String,
        required:true
    },
    answer:{
        type:String,
        required : true
    },
    _id:false
});

// Defining the schema for the interview report
const behaviouralQuestionSchema = new mongoose.Schema({
    question :{
        type:String,
        required:true
    },
    intention : {
        type:String,
        required:true
    },
    answer:{
        type:String,
        required : true
    },
    _id:false
});

// Defining the schema for the interview report
const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required : true
    },
    severity:{
        type : String,
        enum : ["low" , "medium" , "high"],
        required : true
    },
    _id : false
})


// Defining the schema for the interview report
const prepPlanSchema = new mongoose.Schema({
    day:{
        type:Number,
        required: true
    },
    focus :{
        type: String,
        required: true
    },
    tasks : [{
        type:String,
        required : true
    }]
})

// Defining the main schema for the interview report
const reportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required : true
    },
    resume :{
        type : String
    },
    selfDescription :{
        type:String
    },
    matchScore : {
        type : Number,
        min : 0,
        max : 100
    },
    // Embedding the technical questions, behavioral questions, skill gap and preparation plan schemas into the main report schema
    technicalQuestions :[technicalQuestionSChema],
    behavioralQuestions : [behaviouralQuestionSchema],
    skillGap : [skillGapSchema],
    prepPlan : [prepPlanSchema]
});

const interviewReportModel = mongoose.model("interviwReport",reportSchema);

module.exports = interviewReportModel;