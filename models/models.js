var mongoose = require( 'mongoose' );

//User model schema
var userSchema = new mongoose.Schema({
  phonenumber: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  blocked: {
    type: Number,
    required: true
  },
  joinedat: {
    type: Date,
    default: Date.now
  },
  tier: {
    type: Number,
    required: true
  }
});

//License plate model schema
var plateSchema = new mongoose.Schema({
    numberPlate: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: String
    },
    approved: {
      type: Number,
    },
    approvedat: {
      type: Date,
      default: Date.now
    }
  });

//Reports of plates
var ReportSchema = new mongoose.Schema({
  phonenumber : {
    type: String,
    required: true
  },
  numberPlate : {
    type: String,
    required: true
  },
  content : {
    type: String,
    required: true
  },
  addedat : {
    type: Date,
    default: Date.now
  }
});

//License plate submissions
var SubPlateSchema = new mongoose.Schema({
  numberplate:{
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  additionalInfo:{
    type: String,
    required: true
  },
  approved:{
    type: String,
    required: true
  },
  addedby:{
    type: String,
    required: true
  },
  sentAt : {
    type: Date,
    default: Date.now
  }
});

//Plate queries
var PlateQuerySchema = new mongoose.Schema({
  phoneNumber:{
    type: String,
    required: true
  },
  numberPlate:{
    type: String,
    required: true
  },
  result:{
    type: String,
    required: true
  },
  runAt: {
    type: Date,
    default: Date.now
  }
});


//contact
var ContactSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('User', userSchema);
mongoose.model("Plate", plateSchema);
mongoose.model("Report", ReportSchema);
mongoose.model("PlateSubmission", SubPlateSchema);
mongoose.model("PlateQuery", PlateQuerySchema);
mongoose.model("Contact", ContactSchema);