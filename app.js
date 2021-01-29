const express = require('express');
const bodyParser = require("body-parser");
const custom_validation_middleware = require("./custom_validator")



const app = express();


// app.use(bodyParser.urlencoded({extended: true}));
function rawBodySaver (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
}
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));
// app.use(express.json());


app.get('/', (req, res) => {
    
    const user = {
        message: 'My Rule-Validation Api',
        status: 'success',
        data : {
            name: 'Johnson Afuye',
            github : '@ambiti0n',
            email : 'johnsonafuye@gmail.com',
            mobile : '09061324604',
            twitter : '@ambition___'
            },
         }
         res.send(user);
});


app.post('/validate-rule',  custom_validation_middleware.validate, (req, res)=>{
    let {rule , data } = req.body;
    
    // check if the field in RULE is present in DATA
    let to_checkRuleAgainstDataField= checkRuleAgainstDataField(rule, data);
    if(to_checkRuleAgainstDataField)
    return res.status(400).send(to_checkRuleAgainstDataField);

    // check condition in RULE against DATA
    let to_checkConditionAgainstData= checkConditionAgainstData(rule, data);
    if(to_checkConditionAgainstData.error === "error")
    return res.status(400).send(to_checkConditionAgainstData);
    else return res.status(200).send(to_checkConditionAgainstData);
});


function checkRuleAgainstDataField(rule, data) {
    if(!data[rule.field]){
        return returnMethod("field  "+rule.field+" is missing from data.", "error", null); 
    }
    return null;
}

function checkConditionAgainstData(rule, data) {
    let {field, condition, condition_value} = rule;
    let field_value = data[field] ;
    let error = true;
    
    if(condition === 'eq' && field_value === condition_value) error = false;
    else if(condition === 'neq' && field_value !== condition_value) error = false;
    else if(typeof field_value === typeof condition_value && condition === 'gt' && field_value > condition_value) error = false;
    else if(typeof field_value === typeof condition_value && condition === 'gte' && field_value >= condition_value) error = false;
    else if(typeof field_value === 'string' && condition === 'contains' && field_value.includes(condition_value)) error = false;

    let validation = { error, field, field_value, condition, condition_value };

    return error? 
    returnMethod("field "+field+" failed validation", "error", {validation}):
    returnMethod("field "+field+" successfully validated", "success", {validation});

}

function returnMethod(message, status, data) {
    return {message, status, data};
}


      




app.listen(process.env.PORT || 5000 , () => 
    console.log("Server is running on port 5000"));